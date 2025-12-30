import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import dbConnect, { Vehicle } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleNumber } = body

    if (!vehicleNumber) {
      return NextResponse.json({ error: "No vehicle number provided" }, { status: 400 })
    }

    await dbConnect();
    const { db } = await connectToDatabase();

    // Search for vehicle using Vehicle model
    const vehicle = await Vehicle.findOne({
      $or: [
        { vehicleNumber: vehicleNumber },
        { numberPlate: vehicleNumber }
      ]
    });

    if (vehicle) {
      const student = await db.collection("students").findOne({
        studentId: vehicle.studentId,
      });

      return NextResponse.json({
        success: true,
        vehicle: {
          studentName: student?.studentName || "Unknown",
          studentId: vehicle.studentId,
          vehicleNumber: vehicle.vehicleNumber,
          registrationDate: vehicle.registrationDate,
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Vehicle not registered",
      })
    }
  } catch (error) {
    console.error("Verify API error:", error)
    return NextResponse.json({ error: "Failed to verify vehicle", success: false }, { status: 500 })
  }
}
