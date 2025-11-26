// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

interface MongoDBCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

// @ts-ignore
let cached: MongoDBCache = global.mongodb;

if (!cached) {
  // @ts-ignore
  cached = global.mongodb = { client: null, db: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.db && cached.client) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("❌ MONGODB_URI is missing. Add it to .env.local");
    }

    const dbName = uri.split("/").pop()?.split("?")[0] || "parking_meter";
    const client = new MongoClient(uri);

    cached.promise = client.connect().then(() => {
      const db = client.db(dbName);
      console.log("✅ Connected to MongoDB:", dbName);
      cached.client = client;
      cached.db = db;
      return { client, db };
    });
  }

  const { client, db } = await cached.promise;
  return { client, db };
}
