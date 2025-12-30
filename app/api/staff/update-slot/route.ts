import dbConnect, { ParkingSlot } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    const { slotId, status } = await req.json();

    await dbConnect();

    // Update slot status
    const result = await ParkingSlot.updateOne(
      { slotId },
      { 
        status,
        lastUpdated: new Date(),
        ...(status === 'available' && { occupiedByVehicle: null, reservedBy: null })
      }
    );
    
    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Slot not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Slot updated successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Update slot error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Failed to update slot",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}