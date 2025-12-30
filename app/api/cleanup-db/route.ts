import { connectToDatabase } from "@/lib/mongodb";
import dbConnect from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  // Skip during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "This endpoint is not available during build time",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

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