import dbConnect, { ParkingSlot } from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    
    // Check if slots already exist
    const existingSlots = await ParkingSlot.countDocuments();
    if (existingSlots > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `${existingSlots} parking slots already exist`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Create 40 parking slots
    const slots = [];
    for (let i = 1; i <= 40; i++) {
      slots.push({
        slotId: `P${i.toString().padStart(3, '0')}`,
        status: 'available'
      });
    }
    
    await ParkingSlot.insertMany(slots);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "40 parking slots created successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
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