import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = "parking_system";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  if (db && client) return { client, db };

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    bufferMaxEntries: 0,
    retryWrites: true,
    w: 'majority' as const,
  };

  try {
    client = new MongoClient(uri, options);
    await client.connect();
    db = client.db(dbName);
    
    // Test the connection
    await db.admin().ping();
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
