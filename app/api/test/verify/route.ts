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
      return NextResponse.json({
        success: true,
        vehicle: {
          studentName: vehicle.studentName,
          usn: vehicle.usn,
          hostelRoom: vehicle.hostelRoom,
          vehicleNumber: vehicle.vehicleNumber,
          registrationDate: vehicle.registrationDate.toISOString(),
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "User not registered",
      })
    }
  } catch (error) {
    console.error("Verify API error:", error)
    return NextResponse.json({ error: "Failed to verify vehicle", success: false }, { status: 500 })
  }
}
