import { connectToDatabase } from "@/lib/mongodb";
import dbConnect, { ParkingSlot, Vehicle } from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const slots = await ParkingSlot.find({}).populate('occupiedByVehicle');
    
    return new Response(
      JSON.stringify({
        success: true,
        data: slots,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { slotId, vehicleNumber } = await req.json();
    
    await dbConnect();
    
    // Check if vehicle exists (check both numberPlate and vehicleNumber for compatibility)
    const vehicle = await Vehicle.findOne({
      $or: [
        { numberPlate: vehicleNumber },
        { vehicleNumber: vehicleNumber }
      ]
    });
    if (!vehicle) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Number plate not registered",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Update slot status
    const slot = await ParkingSlot.findOneAndUpdate(
      { slotId, status: 'available' },
      { 
        status: 'occupied',
        occupiedByVehicle: vehicle._id,
        lastUpdated: new Date()
      },
      { new: true }
    ).populate('occupiedByVehicle');
    
    if (!slot) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Slot not available or not found",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Slot booked successfully",
        data: slot,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}