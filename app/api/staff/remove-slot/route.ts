import dbConnect, { ParkingSlot } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request) {
  try {
    const { slotId } = await req.json();

    await dbConnect();

    // Remove the slot
    const result = await ParkingSlot.deleteOne({ slotId });
    
    if (result.deletedCount === 0) {
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
        message: "Slot removed successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Remove slot error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Failed to remove slot",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}