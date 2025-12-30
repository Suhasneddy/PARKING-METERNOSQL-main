import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Test connection
    const collections = await db.listCollections().toArray();
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Database connection successful",
        collections: collections.map(c => c.name),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Database test error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Database connection failed",
        error: err?.name || "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}