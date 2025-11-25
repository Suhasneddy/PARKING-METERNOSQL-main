import { type NextRequest, NextResponse } from "next/server"

interface StudentVehicle {
  _id?: string
  studentName: string
  usn: string
  hostelRoom: string
  vehicleNumber: string
  licensePlateImage: string
  registrationDate: Date
}

// Mock database
const vehicleDatabase: StudentVehicle[] = [
  {
    _id: "1",
    studentName: "John Doe",
    usn: "1BM19CS001",
    hostelRoom: "A-201",
    vehicleNumber: "KA01AB1234",
    licensePlateImage: "",
    registrationDate: new Date("2025-01-15"),
  },
  {
    _id: "2",
    studentName: "Jane Smith",
    usn: "1BM19CS002",
    hostelRoom: "B-305",
    vehicleNumber: "KA01CD5678",
    licensePlateImage: "",
    registrationDate: new Date("2025-01-10"),
  },
]

/**
 * GET /api/vehicles?vehicleNumber=KA01AB1234
 * Get student details by vehicle number
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehicleNumber = searchParams.get("vehicleNumber")
    const usn = searchParams.get("usn")

    console.log("[v0] Vehicle lookup request - plate:", vehicleNumber, "usn:", usn)

    // Search by vehicle number
    if (vehicleNumber) {
      const student = vehicleDatabase.find((v) => v.vehicleNumber.toUpperCase() === vehicleNumber.toUpperCase())

      if (student) {
        console.log("[v0] Vehicle found by plate:", vehicleNumber)
        return NextResponse.json({
          success: true,
          found: true,
          student: {
            studentName: student.studentName,
            usn: student.usn,
            hostelRoom: student.hostelRoom,
            vehicleNumber: student.vehicleNumber,
            registrationDate: student.registrationDate.toISOString(),
          },
        })
      }
    }

    // Search by USN
    if (usn) {
      const student = vehicleDatabase.find((v) => v.usn.toUpperCase() === usn.toUpperCase())

      if (student) {
        console.log("[v0] Vehicle found by USN:", usn)
        return NextResponse.json({
          success: true,
          found: true,
          student: {
            studentName: student.studentName,
            usn: student.usn,
            hostelRoom: student.hostelRoom,
            vehicleNumber: student.vehicleNumber,
            registrationDate: student.registrationDate.toISOString(),
          },
        })
      }
    }

    console.log("[v0] Vehicle not found")
    return NextResponse.json({
      success: true,
      found: false,
      message: "Vehicle not found in system",
    })
  } catch (error) {
    console.error("[v0] Vehicle lookup error:", error)
    return NextResponse.json({ error: "Failed to lookup vehicle", success: false }, { status: 500 })
  }
}

/**
 * GET /api/vehicles/all
 * Get all registered vehicles (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "getAllVehicles") {
      console.log("[v0] Fetching all registered vehicles - total:", vehicleDatabase.length)
      return NextResponse.json({
        success: true,
        vehicles: vehicleDatabase.map((v) => ({
          studentName: v.studentName,
          usn: v.usn,
          hostelRoom: v.hostelRoom,
          vehicleNumber: v.vehicleNumber,
          registrationDate: v.registrationDate.toISOString(),
        })),
        count: vehicleDatabase.length,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Server error", success: false }, { status: 500 })
  }
}
