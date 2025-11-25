import { type NextRequest, NextResponse } from "next/server"
import { extractPlateNumberFromImage, extractValidPlate } from "@/lib/ocr-service"

interface StudentVehicle {
  _id?: string
  studentName: string
  usn: string
  hostelRoom: string
  vehicleNumber: string
  licensePlateImage: string
  registrationDate: Date
}

// Mock database (will be replaced with MongoDB)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { licensePlateImage } = body

    if (!licensePlateImage) {
      console.log("[v0] No image provided for scanning")
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("[v0] Processing license plate scan...")

    // Extract plate number using OCR
    const ocrResult = await extractPlateNumberFromImage(licensePlateImage)

    if (!ocrResult.success) {
      console.log("[v0] OCR processing failed:", ocrResult.error)
      return NextResponse.json({
        success: false,
        error: "Failed to process image",
        found: false,
      })
    }

    const extractedPlate = extractValidPlate(ocrResult)

    if (!extractedPlate) {
      console.log("[v0] Could not extract valid plate from OCR result")
      return NextResponse.json({
        success: true,
        found: false,
        message: "Could not extract valid plate number from image",
      })
    }

    console.log("[v0] Extracted plate number:", extractedPlate, "Confidence:", ocrResult.confidence)

    // Search for vehicle in database
    const student = vehicleDatabase.find((v) => v.vehicleNumber === extractedPlate)

    if (student) {
      console.log("[v0] Vehicle found in database:", extractedPlate)
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
        ocrConfidence: ocrResult.confidence,
      })
    } else {
      console.log("[v0] Vehicle not found in database:", extractedPlate)
      return NextResponse.json({
        success: true,
        found: false,
        message: "Vehicle not registered in system",
        detectedPlate: extractedPlate,
        ocrConfidence: ocrResult.confidence,
      })
    }
  } catch (error) {
    console.error("[v0] Scan error:", error)
    return NextResponse.json({ error: "Failed to process scan", success: false }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "License Plate Scanning API",
    method: "POST",
    description: "Scan a license plate to verify vehicle registration",
  })
}
