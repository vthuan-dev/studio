import { connectToDatabase } from './_lib/mongodb.js';

function deduplicateById(items) {
  if (!Array.isArray(items)) return [];
  const map = new Map();
  for (const item of items) {
    if (!item) continue;
    const id = item.id || (item._id ? String(item._id) : null);
    if (id) {
      map.set(id, { ...item, id });
    }
  }
  return Array.from(map.values());
}

async function syncCollectionById(collection, items) {
  const cleanItems = deduplicateById(items).map(({ _id, ...rest }) => rest);
  const ids = cleanItems.map(item => item.id).filter(Boolean);

  if (cleanItems.length === 0) {
    await collection.deleteMany({});
    return;
  }

  const bulkOps = cleanItems.map(item => ({
    updateOne: {
      filter: { id: item.id },
      update: { $set: item },
      upsert: true
    }
  }));

  bulkOps.push({
    deleteMany: {
      filter: { id: { $nin: ids } }
    }
  });

  await collection.bulkWrite(bulkOps, { ordered: false });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const customersCol = db.collection('customers');
    const staffCol = db.collection('staff');
    const settingsCol = db.collection('settings');
    const servicesCol = db.collection('services');
    const accessoriesCol = db.collection('accessories');

    // GET /api/sync -> Lấy toàn bộ dữ liệu mới nhất từ MongoDB Atlas (luôn deduplicate)
    if (req.method === 'GET') {
      const [rawCustomers, rawStaff, rawServices, rawAccessories, config] = await Promise.all([
        customersCol.find({}).toArray(),
        staffCol.find({}).toArray(),
        servicesCol.find({}).toArray(),
        accessoriesCol.find({}).toArray(),
        settingsCol.findOne({ _id: 'studio_config' })
      ]);

      const customers = deduplicateById(rawCustomers.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      })));

      const staffList = deduplicateById(rawStaff.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      })));

      const servicesList = deduplicateById(rawServices.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      })));

      const accessoriesList = deduplicateById(rawAccessories.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      })));

      return res.status(200).json({
        customers,
        staffList: staffList.length > 0 ? staffList : null,
        servicesList: servicesList.length > 0 ? servicesList : null,
        accessoriesList: accessoriesList.length > 0 ? accessoriesList : null,
        userProfile: config?.userProfile || null,
        updatedAt: config?.updatedAt || 1
      });
    }

    // POST or PUT /api/sync -> Đồng bộ ghi dữ liệu an toàn vào MongoDB Atlas
    if (req.method === 'POST' || req.method === 'PUT') {
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          payload = {};
        }
      }
      const { customers, staffList, servicesList, accessoriesList, userProfile, updatedAt = Date.now() } = payload || {};

      const operations = [];

      // 1. Cập nhật collection customers bằng BulkWrite Upsert an toàn
      if (Array.isArray(customers)) {
        operations.push(syncCollectionById(customersCol, customers));
      }

      // 2. Cập nhật collection staff
      if (Array.isArray(staffList) && staffList.length > 0) {
        operations.push(syncCollectionById(staffCol, staffList));
      }

      // 3. Cập nhật collection services
      if (Array.isArray(servicesList) && servicesList.length > 0) {
        operations.push(syncCollectionById(servicesCol, servicesList));
      }

      // 4. Cập nhật collection accessories
      if (Array.isArray(accessoriesList) && accessoriesList.length > 0) {
        operations.push(syncCollectionById(accessoriesCol, accessoriesList));
      }

      // 5. Cập nhật collection settings (userProfile & updatedAt)
      operations.push(
        settingsCol.updateOne(
          { _id: 'studio_config' },
          { 
            $set: { 
              ...(userProfile ? { userProfile } : {}),
              updatedAt 
            } 
          },
          { upsert: true }
        )
      );

      await Promise.all(operations);

      return res.status(200).json({
        success: true,
        count: Array.isArray(customers) ? deduplicateById(customers).length : 0,
        updatedAt
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /api/sync Error]:', error);
    return res.status(500).json({
      error: 'Lỗi máy chủ cơ sở dữ liệu MongoDB Atlas',
      details: error?.message
    });
  }
}

