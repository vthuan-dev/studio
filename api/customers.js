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
    const customersCol = db.collection('customers');

    if (req.method === 'GET') {
      const list = await customersCol.find({}).toArray();
      const customers = list.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id.toString()
      }));
      return res.status(200).json(customers);
    }

    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const customers = Array.isArray(payload) ? payload : payload?.customers;

      if (Array.isArray(customers)) {
        await customersCol.deleteMany({});
        if (customers.length > 0) {
          const clean = customers.map(({ _id, ...c }) => c);
          await customersCol.insertMany(clean);
        }
        return res.status(200).json({ success: true, count: customers.length });
      }

      return res.status(400).json({ error: 'Payload must be an array of customers' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /api/customers Error]:', error);
    return res.status(500).json({ error: error.message });
  }
}
