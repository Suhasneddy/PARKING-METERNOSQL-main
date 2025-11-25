import { type NextRequest, NextResponse } from "next/server";
import { normalizePlateNumber } from "@/lib/ocr-service";
import { validatePlate } from "@/lib/plate-validator";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface StudentVehicle {
  _id?: ObjectId;
  studentName: string;
  usn: string;
  hostelRoom: string;
  vehicleNumber: string;
  licensePlateImage: string;
  registrationDate: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { studentName, usn, hostelRoom, vehicleNumber, licensePlateImage } = body;

    console.log("[v0] Registration request received for vehicle:", vehicleNumber);

    // Validate required fields
    if (!studentName || !usn || !hostelRoom || !vehicleNumber || !licensePlateImage) {
      console.log("[v0] Missing required fields in registration");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate plate format
    const plateValidation = validatePlate(vehicleNumber);
    if (!plateValidation.isValid) {
      console.log("[v0] Invalid plate format:", vehicleNumber);
      return NextResponse.json(
        { error: "Invalid license plate format", details: plateValidation.errors },
        { status: 400 },
      );
    }

    const normalizedPlate = normalizePlateNumber(vehicleNumber);

    // Check if vehicle already registered
    const existingVehicle = await db.collection("vehicles").findOne({ vehicleNumber: normalizedPlate });

    if (existingVehicle) {
      console.log("[v0] Vehicle already registered:", normalizedPlate);
      return NextResponse.json({ error: "Vehicle already registered" }, { status: 409 });
    }

    // Validate student data
    if (!usn.match(/^[0-9]{1}[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3,4}$/)) {
      console.log("[v0] Invalid USN format:", usn);
      return NextResponse.json({ error: "Invalid USN format" }, { status: 400 });
    }

    // Create new record
    const newRecord: StudentVehicle = {
      studentName,
      usn: usn.toUpperCase(),
      hostelRoom,
      vehicleNumber: normalizedPlate,
      licensePlateImage,
      registrationDate: new Date(),
    };

    const result = await db.collection("vehicles").insertOne(newRecord);
    newRecord._id = result.insertedId as ObjectId;

    console.log("[v0] Vehicle registered successfully:", normalizedPlate);
    console.log("[v0] Total registrations:", await db.collection("vehicles").countDocuments());

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle registered successfully",
        data: newRecord,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[v0] Registration error:", error);
    return NextResponse.json({ error: "Failed to register vehicle" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Vehicle Registration API",
    method: "POST",
    description: "Register a new student vehicle",
  });
}