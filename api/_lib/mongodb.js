import { MongoClient } from 'mongodb';

const DEFAULT_URI = 'mongodb+srv://vthuanngit_db_user:mcGAP9pzAKnQ6hnw@cluster0.9jxxjao.mongodb.net/meyzi_studio?retryWrites=true&w=majority&appName=Cluster0';

const uri = process.env.MONGODB_URI || DEFAULT_URI;

let cachedClient = null;
let cachedDb = null;

/**
 * Kết nối đến MongoDB Atlas với connection pooling tối ưu cho Serverless
 */
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
  });

  await client.connect();
  const db = client.db('meyzi_studio');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
