// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing. Add it to .env.local");
}

const uri = process.env.MONGODB_URI;
const dbName = uri.split("/").pop()?.split("?")[0] || "parking_meter";

export async function connectToDatabase() {
  if (db) return { client, db };

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log("✅ Connected to MongoDB:", dbName);
  return { client, db };
}
