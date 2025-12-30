import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Add connection timeout and retry logic
    let db;
    let retries = 3;
    
    while (retries > 0) {
      try {
        const connection = await connectToDatabase();
        db = connection.db;
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!db) {
      throw new Error("Failed to connect to database");
    }

    // Check if student already exists
    const existingStudent = await db.collection("students").findOne({ studentId: payload.studentId });
    if (existingStudent) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Student ID already exists",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if email already exists
    const existingUser = await db.collection("users").findOne({ email: payload.email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email already registered",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create student record
    const studentResult = await db.collection("students").insertOne({
      studentName: payload.studentName,
      studentId: payload.studentId,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      department: payload.department,
      year: payload.year,
      registrationDate: new Date(),
    });

    // Create user record for login
    await db.collection("users").insertOne({
      email: payload.email,
      password: payload.studentId, // Use studentId as default password
      role: "User",
      studentId: payload.studentId,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Student registered successfully. Use your email and Student ID as password to login.",
        data: { _id: studentResult.insertedId },
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