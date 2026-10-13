import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://vthuanngit_db_user:mcGAP9pzAKnQ6hnw@cluster0.9jxxjao.mongodb.net/meyzi_studio?retryWrites=true&w=majority&appName=Cluster0';

async function cleanupStaff() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('meyzi_studio');
    const staffCol = db.collection('staff');
    
    const allStaff = await staffCol.find({}).toArray();
    const seen = new Set();
    const unique = [];

    for (const s of allStaff) {
      const key = `${s.name?.trim().toLowerCase()}_${s.role?.trim().toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        const { _id, ...clean } = s;
        unique.push(clean);
      }
    }

    await staffCol.deleteMany({});
    if (unique.length > 0) {
      await staffCol.insertMany(unique);
    }

    console.log(`✔ Cleaned up staff collection: Reduced from ${allStaff.length} to ${unique.length} unique staff members.`);
    unique.forEach(s => console.log(`  - ${s.name} (${s.role})`));

  } catch (err) {
    console.error('Error cleaning up staff:', err);
  } finally {
    await client.close();
  }
}

cleanupStaff();
