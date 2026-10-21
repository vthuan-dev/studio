import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://vthuanngit_db_user:mcGAP9pzAKnQ6hnw@cluster0.9jxxjao.mongodb.net';

async function restore() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('meyzi_studio');
  const customersCol = db.collection('customers');
  const settingsCol = db.collection('settings');

  const now = Date.now();
  const restoredCustomers = [
    {
      id: 'cust-20261001-nhungta',
      stt: 1,
      name: 'Nhung Ta',
      phone: '0987654321',
      locationType: 'studio',
      guestCount: 1,
      address: 'Tại cửa hàng',
      date: '2026-10-01',
      time: '08:00',
      category: 'co-dau',
      categoryName: 'Cô dâu',
      services: ['Makeup cô dâu'],
      staffMakeup: 'Tuyết Mai',
      staffHair: 'Quỳnh Anh',
      totalAmount: 1750000,
      depositAmount: 0,
      remainingAmount: 1750000,
      status: 'chua-coc',
      statusText: 'Chưa cọc',
      paymentHistory: []
    },
    {
      id: 'cust-20261001-cha',
      stt: 2,
      name: 'C Hà',
      phone: '0987654322',
      locationType: 'studio',
      guestCount: 1,
      address: 'Tại cửa hàng',
      date: '2026-10-01',
      time: '08:00',
      category: 'tiec',
      categoryName: 'Tiệc',
      services: ['Makeup tiệc'],
      staffMakeup: 'Tuyết Mai',
      staffHair: 'Quỳnh Anh',
      totalAmount: 1500000,
      depositAmount: 1500000,
      remainingAmount: 0,
      status: 'da-thanh-toan',
      statusText: 'Đã thanh toán',
      paymentHistory: [
        { date: '01/10/2026', amount: 1500000, type: 'Thanh toán đủ' }
      ]
    },
    {
      id: 'cust-20261001-thanhtam',
      stt: 3,
      name: 'Thanh Tâm',
      phone: '0987654323',
      locationType: 'studio',
      guestCount: 1,
      address: 'Tại cửa hàng',
      date: '2026-10-01',
      time: '08:00',
      category: 'tiec',
      categoryName: 'Tiệc',
      services: ['Makeup tiệc'],
      staffMakeup: 'Tuyết Mai',
      staffHair: 'Khánh Vy',
      totalAmount: 1350000,
      depositAmount: 0,
      remainingAmount: 1350000,
      status: 'chua-coc',
      statusText: 'Chưa cọc',
      paymentHistory: []
    }
  ];

  await customersCol.deleteMany({});
  await customersCol.insertMany(restoredCustomers);
  await settingsCol.updateOne(
    { _id: 'studio_config' },
    { $set: { updatedAt: now + 5000 } },
    { upsert: true }
  );

  console.log('Restored 3 customers successfully with new updatedAt:', now + 5000);
  const count = await customersCol.countDocuments();
  console.log('Current count in DB:', count);
  await client.close();
}

restore().catch(console.error);
