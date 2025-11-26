import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "parking_meter";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  if (db && client) return { client, db };

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return { client, db };
}
