import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "parking_meter";

let client: MongoClient | null = null;
let db: Db | null = null;

async function seedDatabase(db: Db) {
  const usersCollection = db.collection("users");
  const usersCount = await usersCollection.countDocuments();

  if (usersCount === 0) {
    const users = [
      {
        email: "user@example.com",
        password: "password",
        role: "User",
      },
      {
        email: "staff@example.com",
        password: "password",
        role: "Staff",
      },
    ];
    await usersCollection.insertMany(users);
    console.log("Database seeded successfully");
  }
}

export async function connectToDatabase() {
  if (db && client) return { client, db };

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  await seedDatabase(db);

  return { client, db };
}
