import { connectToDatabase } from "@/lib/mongodb";
import dbConnect, { Vehicle } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const { db } = await connectToDatabase();
    await dbConnect();

    // Verify student exists
    const student = await db.collection("students").findOne({ studentId: payload.studentId });
    if (!student) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Student ID not found. Please register first.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if vehicle already registered
    const existingVehicle = await Vehicle.findOne({ 
      $or: [
        { vehicleNumber: payload.vehicleNumber },
        { numberPlate: payload.vehicleNumber }
      ]
    });
    
    if (existingVehicle) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Vehicle number already registered",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await Vehicle.create({
      studentId: payload.studentId,
      vehicleNumber: payload.vehicleNumber,
      numberPlate: payload.vehicleNumber,
      registrationDate: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Vehicle registered successfully",
        data: { _id: result._id },
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