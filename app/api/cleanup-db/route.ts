import { connectToDatabase } from "@/lib/mongodb";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    await dbConnect();
    
    console.log("Cleaning up database...");
    
    // Drop all collections to start fresh
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`✅ Dropped collection: ${collection.name}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Database cleaned successfully. Run migration now.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Cleanup error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Cleanup failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}