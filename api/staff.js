import { connectToDatabase } from './_lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const staffCol = db.collection('staff');

    if (req.method === 'GET') {
      const list = await staffCol.find({}).toArray();
      const staffList = list.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      }));
      return res.status(200).json(staffList);
    }

    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const staffList = Array.isArray(payload) ? payload : payload?.staffList;

      if (Array.isArray(staffList)) {
        await staffCol.deleteMany({});
        if (staffList.length > 0) {
          const clean = staffList.map(({ _id, ...s }) => s);
          await staffCol.insertMany(clean);
        }
        return res.status(200).json({ success: true, count: staffList.length });
      }

      return res.status(400).json({ error: 'Payload must be an array of staff' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /api/staff Error]:', error);
    return res.status(500).json({ error: error.message });
  }
}
