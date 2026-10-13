import { MongoClient } from 'mongodb';
import { INITIAL_CUSTOMERS, STAFFS } from '../src/data/mockData.js';

const uri = 'mongodb+srv://vthuanngit_db_user:mcGAP9pzAKnQ6hnw@cluster0.9jxxjao.mongodb.net/meyzi_studio?retryWrites=true&w=majority&appName=Cluster0';

const initialServices = [
  {
    id: 'co-dau',
    name: 'Gói Makeup & Tóc Cô Dâu Ngày Cưới',
    price: 3200000,
    priceFormatted: '3.200.000 đ',
    duration: '120 - 150 phút',
    category: 'co-dau',
    categoryName: 'Cô dâu',
    features: ['Tone kem nền cao cấp chống trôi 18h', 'Thiết kế kiểu tóc cô dâu độc quyền', 'Bộ trang sức & cài tóc cao cấp', 'Dặm phấn lại trước giờ đón dâu']
  },
  {
    id: 'an-hoi',
    name: 'Gói Makeup Ăn Hỏi / Lễ Vu Quy',
    price: 1800000,
    priceFormatted: '1.800.000 đ',
    duration: '90 - 120 phút',
    category: 'an-hoi',
    categoryName: 'Ăn hỏi',
    features: ['Tone nhẹ nhàng, đằm thắm', 'Bới tóc hoặc tết tóc truyền thống', 'Phụ kiện trâm cài áo dài']
  },
  {
    id: 'tiec',
    name: 'Gói Makeup Dạ Tiệc & Sự Kiện',
    price: 800000,
    priceFormatted: '800.000 đ',
    duration: '60 - 75 phút',
    category: 'tiec',
    categoryName: 'Tiệc',
    features: ['Đánh khối tạo nét sắc sảo, quyến rũ', 'Tạo kiểu uốn xoăn sóng bồng bềnh', 'Dán mi gân mảnh tự nhiên']
  },
  {
    id: 'chup-anh',
    name: 'Gói Makeup Chụp Ảnh Kỷ Yếu / Lookbook',
    price: 1200000,
    priceFormatted: '1.200.000 đ',
    duration: '90 phút',
    category: 'chup-anh',
    categoryName: 'Chụp ảnh',
    features: ['Tối ưu ánh sáng studio & ngoại cảnh', 'Thay đổi 2 kiểu tóc đi kèm', 'Hỗ trợ dặm phấn trong buổi chụp']
  }
];

const initialAccessories = [
  { id: 'pk-01', name: 'Vương miện công chúa đính đá Zircon', code: 'PK-01', total: 4, available: 2, borrowed: 2, deposit: 500000, depositFormatted: '500.000 đ' },
  { id: 'pk-02', name: 'Khăn voan cô dâu thêu viền ren 3 mét', code: 'PK-02', total: 6, available: 5, borrowed: 1, deposit: 300000, depositFormatted: '300.000 đ' },
  { id: 'pk-03', name: 'Bộ cài tóc hoa ngọc trai thủ công', code: 'PK-03', total: 8, available: 6, borrowed: 2, deposit: 200000, depositFormatted: '200.000 đ' },
  { id: 'pk-04', name: 'Bộ trang sức cưới pha lê & ngọc trai cao cấp', code: 'PK-04', total: 5, available: 3, borrowed: 2, deposit: 600000, depositFormatted: '600.000 đ' },
  { id: 'pk-05', name: 'Trâm cài tóc truyền thống cho áo dài ăn hỏi', code: 'PK-05', total: 10, available: 8, borrowed: 2, deposit: 150000, depositFormatted: '150.000 đ' },
  { id: 'pk-06', name: 'Băng đô lụa đính hoa bướm phong cách Hàn Quốc', code: 'PK-06', total: 5, available: 4, borrowed: 1, deposit: 200000, depositFormatted: '200.000 đ' },
];

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('meyzi_studio');
    console.log('Connected to database: meyzi_studio');

    // 1. Seed users (Admin auth tk/mk)
    const usersCol = db.collection('users');
    await usersCol.updateOne(
      { username: 'admin' },
      {
        $set: {
          username: 'admin',
          password: '10102020',
          name: 'Tuyết Mai (Quản trị viên)',
          role: 'admin',
          updatedAt: Date.now()
        }
      },
      { upsert: true }
    );
    console.log('✔ Seeded collection "users": Admin (tk: admin, mk: 10102020) is ready in MongoDB Atlas!');

    // 2. Seed customers if empty
    const customersCol = db.collection('customers');
    const custCount = await customersCol.countDocuments();
    if (custCount === 0) {
      const cleanCust = INITIAL_CUSTOMERS.map(({ _id, ...c }) => c);
      await customersCol.insertMany(cleanCust);
      console.log(`✔ Seeded collection "customers": Added ${cleanCust.length} customers into MongoDB Atlas!`);
    } else {
      console.log(`ℹ Collection "customers" already has ${custCount} customers.`);
    }

    // 3. Seed services
    const servicesCol = db.collection('services');
    await servicesCol.deleteMany({});
    await servicesCol.insertMany(initialServices);
    console.log(`✔ Seeded collection "services": Added ${initialServices.length} service packages!`);

    // 4. Seed accessories
    const accessoriesCol = db.collection('accessories');
    await accessoriesCol.deleteMany({});
    await accessoriesCol.insertMany(initialAccessories);
    console.log(`✔ Seeded collection "accessories": Added ${initialAccessories.length} accessories items!`);

    // 5. Seed settings
    const settingsCol = db.collection('settings');
    await settingsCol.updateOne(
      { _id: 'studio_config' },
      {
        $set: {
          userProfile: {
            name: 'Tuyết Mai',
            role: 'Chủ Studio / Makeup Artist',
            branch: 'Chi nhánh Hà Nội',
            phone: '0987 654 321'
          },
          updatedAt: Date.now()
        }
      },
      { upsert: true }
    );
    console.log('✔ Seeded collection "settings": Config and Profile ready!');

    console.log('\n--- ALL COLLECTIONS IN MEYZI_STUDIO ---');
    const cols = await db.listCollections().toArray();
    for (const c of cols) {
      const count = await db.collection(c.name).countDocuments();
      console.log(`- ${c.name}: ${count} documents`);
    }

  } catch (err) {
    console.error('Error seeding MongoDB Atlas:', err);
  } finally {
    await client.close();
  }
}

seed();
