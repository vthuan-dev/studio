import { connectToDatabase } from './_lib/mongodb.js';

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

    // GET /api/sync -> Lấy toàn bộ dữ liệu mới nhất từ MongoDB Atlas
    if (req.method === 'GET') {
      const [rawCustomers, rawStaff, rawServices, rawAccessories, config] = await Promise.all([
        customersCol.find({}).toArray(),
        staffCol.find({}).toArray(),
        servicesCol.find({}).toArray(),
        accessoriesCol.find({}).toArray(),
        settingsCol.findOne({ _id: 'studio_config' })
      ]);

      const customers = rawCustomers.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      }));

      const staffList = rawStaff.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      }));

      const servicesList = rawServices.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      }));

      const accessoriesList = rawAccessories.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      }));

      return res.status(200).json({
        customers,
        staffList: staffList.length > 0 ? staffList : null,
        servicesList: servicesList.length > 0 ? servicesList : null,
        accessoriesList: accessoriesList.length > 0 ? accessoriesList : null,
        userProfile: config?.userProfile || null,
        updatedAt: config?.updatedAt || 1
      });
    }

    // POST or PUT /api/sync -> Đồng bộ ghi dữ liệu vào MongoDB Atlas
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

      // 1. Cập nhật collection customers
      if (Array.isArray(customers)) {
        operations.push((async () => {
          await customersCol.deleteMany({});
          if (customers.length > 0) {
            const cleanCustomers = customers.map(({ _id, ...c }) => c);
            await customersCol.insertMany(cleanCustomers);
          }
        })());
      }

      // 2. Cập nhật collection staff
      if (Array.isArray(staffList) && staffList.length > 0) {
        operations.push((async () => {
          await staffCol.deleteMany({});
          const cleanStaff = staffList.map(({ _id, ...s }) => s);
          await staffCol.insertMany(cleanStaff);
        })());
      }

      // 3. Cập nhật collection services
      if (Array.isArray(servicesList) && servicesList.length > 0) {
        operations.push((async () => {
          await servicesCol.deleteMany({});
          const cleanServices = servicesList.map(({ _id, ...s }) => s);
          await servicesCol.insertMany(cleanServices);
        })());
      }

      // 4. Cập nhật collection accessories
      if (Array.isArray(accessoriesList) && accessoriesList.length > 0) {
        operations.push((async () => {
          await accessoriesCol.deleteMany({});
          const cleanAcc = accessoriesList.map(({ _id, ...a }) => a);
          await accessoriesCol.insertMany(cleanAcc);
        })());
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
        count: customers?.length || 0,
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
