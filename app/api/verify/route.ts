import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleNumber } = body

    if (!vehicleNumber) {
      return NextResponse.json({ error: "No vehicle number provided" }, { status: 400 })
    }

    // Search for vehicle in database
    const { db } = await connectToDatabase()
    const vehicle = await db.collection("vehicles").findOne({
      vehicleNumber: vehicleNumber,
    })

    if (vehicle) {
      const student = await db.collection("students").findOne({
        studentId: vehicle.studentId,
      });

      return NextResponse.json({
        success: true,
        vehicle: {
          studentName: student?.studentName,
          studentId: vehicle.studentId,
          vehicleNumber: vehicle.vehicleNumber,
          registrationDate: vehicle.registrationDate.toISOString(),
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
