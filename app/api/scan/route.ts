import { type NextRequest, NextResponse } from "next/server"
import { extractPlateNumberFromImage, extractValidPlate } from "@/lib/ocr-service"
import { connectToDatabase } from "@/lib/mongodb"

interface StudentVehicle {
  _id?: string
  studentName: string
  usn: string
  hostelRoom: string
  vehicleNumber: string
  licensePlateImage: string
  registrationDate: Date
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { licensePlateImage } = body

    if (!licensePlateImage) {
      console.log("[v1] No image provided for scanning")
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("[v1] Processing license plate scan...")

    // Extract plate number using OCR
    const ocrResult = await extractPlateNumberFromImage(licensePlateImage)

    if (!ocrResult.success) {
      console.log("[v1] OCR processing failed:", ocrResult.error)
      return NextResponse.json({
        success: false,
        error: "Failed to process image",
        found: false,
      })
    }

    const extractedPlate = extractValidPlate(ocrResult)

    if (!extractedPlate) {
      console.log("[v1] Could not extract valid plate from OCR result")
      return NextResponse.json({
        success: true,
        found: false,
        message: "Could not extract valid plate number from image",
      })
    }

    console.log(
      `[v1] Extracted Plate: ${extractedPlate}, Confidence: ${ocrResult.confidence?.toFixed(
        2
      )}%`
    )

    // Search for vehicle in database
    const { db } = await connectToDatabase()
    const student = await db.collection("vehicles").findOne({
      vehicleNumber: extractedPlate,
    })

    if (student) {
      console.log("[v1] Vehicle found in database:", extractedPlate)
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
      console.log("[v1] Vehicle not found in database:", extractedPlate)
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
