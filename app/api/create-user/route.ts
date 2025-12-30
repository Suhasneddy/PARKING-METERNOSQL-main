import { connectToDatabase } from "@/lib/mongodb";
import dbConnect, { Vehicle } from "@/lib/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    await dbConnect();
    
    // Create test user
    await db.collection("users").insertOne({
      email: "test@example.com",
      password: "123456",
      role: "User"
    });
    
    // Create test student
    await db.collection("students").insertOne({
      studentName: "Test Student",
      studentId: "12345",
      email: "test@example.com",
      phoneNumber: "1234567890",
      department: "Computer Science",
      year: "3",
      registrationDate: new Date()
    });
    
    // Create test vehicle
    await Vehicle.create({
      numberPlate: "ABC123",
      vehicleNumber: "ABC123",
      studentId: "12345",
      registrationDate: new Date()
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Test data created: email: test@example.com, password: 123456, vehicle: ABC123"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Error creating test data"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}