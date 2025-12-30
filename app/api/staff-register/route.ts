import dbConnect from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    await dbConnect();
    
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;

    // Check if staff already exists
    const existingStaff = await db.collection("staff").findOne({ staffId: payload.staffId });
    if (existingStaff) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Staff ID already exists",
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

    // Create staff record
    const staffResult = await db.collection("staff").insertOne({
      staffName: payload.staffName,
      staffId: payload.staffId,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      department: payload.department,
      position: payload.position,
      registrationDate: new Date(),
    });

    // Create user record for login
    await db.collection("users").insertOne({
      email: payload.email,
      password: payload.staffId, // Use staffId as default password
      role: "Staff",
      staffId: payload.staffId,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Staff registered successfully. Use your email and Staff ID as password to login.",
        data: { _id: staffResult.insertedId },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Staff Register API error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}