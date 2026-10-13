import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://vthuanngit_db_user:mcGAP9pzAKnQ6hnw@cluster0.9jxxjao.mongodb.net/meyzi_studio?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('meyzi_studio');
    console.log('Connected to database: meyzi_studio');

    // 1. Delete all customers
    const customersCol = db.collection('customers');
    const deleteResult = await customersCol.deleteMany({});
    console.log(`✔ Successfully deleted ${deleteResult.deletedCount} customer bookings from MongoDB Atlas!`);

    // 2. Update updatedAt timestamp so all connected devices immediately sync to empty
    const settingsCol = db.collection('settings');
    const now = Date.now();
    await settingsCol.updateOne(
      { _id: 'studio_config' },
      { $set: { updatedAt: now } },
      { upsert: true }
    );
    console.log(`✔ Updated sync timestamp to ${now} to trigger real-time refresh on all devices.`);

    // 3. Verify
    const count = await customersCol.countDocuments();
    console.log(`\nVerifying collection "customers": currently has ${count} documents.`);

  } catch (err) {
    console.error('Error clearing customers on MongoDB Atlas:', err);
  } finally {
    await client.close();
  }
}

main();
