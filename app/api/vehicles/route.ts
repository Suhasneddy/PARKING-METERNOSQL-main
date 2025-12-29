import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const { db } = await connectToDatabase();

    const result = await db.collection("vehicles").insertOne({
      studentId: payload.studentId,
      vehicleNumber: payload.vehicleNumber,
      registrationDate: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Vehicle registered successfully",
        data: { _id: result.insertedId },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Vehicle registration API error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}