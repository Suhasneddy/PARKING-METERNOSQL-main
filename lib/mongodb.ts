import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = "parking_system"; // Single unified database

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  if (db && client) return { client, db };

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    retryWrites: true,
    w: 'majority',
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
  };

  client = new MongoClient(uri, options);
  await client.connect();
  db = client.db(dbName);

  return { client, db };
}
