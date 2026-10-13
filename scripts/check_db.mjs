import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://vthuanngit_db_user:mcGAP9pzAKnQ6hnw@cluster0.9jxxjao.mongodb.net/meyzi_studio?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected successfully!');

    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log('\n--- DATABASES IN CLUSTER ---');
    dbs.databases.forEach(d => console.log(`- ${d.name} (${(d.sizeOnDisk / 1024).toFixed(1)} KB)`));

    const db = client.db('meyzi_studio');
    const collections = await db.listCollections().toArray();
    console.log('\n--- COLLECTIONS IN "meyzi_studio" ---');
    if (collections.length === 0) {
      console.log('No collections yet in meyzi_studio!');
    } else {
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`- ${col.name}: ${count} documents`);
        const samples = await db.collection(col.name).find({}).limit(2).toArray();
        console.log(`  Sample (2 items):`, JSON.stringify(samples, null, 2));
      }
    }
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  } finally {
    await client.close();
  }
}

main();
