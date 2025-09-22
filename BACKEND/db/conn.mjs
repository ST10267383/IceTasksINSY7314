import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI in .env');

const dbName = process.env.DB_NAME || 'mydb';
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

try {
  await client.connect();
  console.log('✅ MongoDB connected');
} catch (err) {
  console.error('❌ MongoDB connection error:', err?.message || err);
  process.exit(1);
}

const db = client.db(dbName);
export default db;