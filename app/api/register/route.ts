import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("Register API - Received payload:", payload);

    const { db } = await connectToDatabase();
    console.log("Register API - Connected to database");

    const result = await db.collection("students").insertOne({
      studentName: payload.studentName,
      studentId: payload.studentId,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      department: payload.department,
      year: payload.year,
      registrationDate: new Date(),
    });
    console.log("Register API - Insert result:", result);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Student registered successfully",
        data: { _id: result.insertedId },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Register API error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}