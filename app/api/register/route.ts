import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const { db } = await connectToDatabase();

    const result = await db.collection("students").insertOne({
      studentName: payload.studentName,
      studentId: payload.studentId,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      department: payload.department,
      year: payload.year,
      registrationDate: new Date(),
    });

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