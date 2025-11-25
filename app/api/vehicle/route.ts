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
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehicleNumber = searchParams.get("vehicleNumber")

    if (!vehicleNumber) {
      return NextResponse.json({ error: "Vehicle number is required" }, { status: 400 })
    }

    const student = vehicleDatabase.find((v) => v.vehicleNumber.toUpperCase() === vehicleNumber.toUpperCase())

    if (student) {
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
    } else {
      return NextResponse.json({
        success: true,
        found: false,
      })
    }
  } catch (error) {
    console.error("[v0] Vehicle lookup error:", error)
    return NextResponse.json({ error: "Failed to lookup vehicle" }, { status: 500 })
  }
}
