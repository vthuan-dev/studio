import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://vthuanngit_db_user:mcGAP9pzAKnQ6hnw@cluster0.9jxxjao.mongodb.net/meyzi_studio?retryWrites=true&w=majority&appName=Cluster0';

const coreStaff = [
  { id: 'tuyet-mai', name: 'Tuyết Mai', role: 'Makeup Artist', specialty: 'makeup', phone: '0987 111 222', active: true },
  { id: 'khanh-vy', name: 'Khánh Vy', role: 'Làm tóc (Hair Stylist)', specialty: 'hair', phone: '0912 333 444', active: true },
  { id: 'lan-huong', name: 'Lan Hương', role: 'Makeup Artist', specialty: 'makeup', phone: '0945 555 666', active: true },
  { id: 'quynh-anh', name: 'Quỳnh Anh', role: 'Làm tóc (Hair Stylist)', specialty: 'hair', phone: '0357 832 390', active: true }
];

async function updateCoreStaff() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('meyzi_studio');
    const staffCol = db.collection('staff');
    await staffCol.deleteMany({});
    await staffCol.insertMany(coreStaff);
    console.log(`✔ Set core staff: ${coreStaff.length} members in MongoDB Atlas!`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

updateCoreStaff();
