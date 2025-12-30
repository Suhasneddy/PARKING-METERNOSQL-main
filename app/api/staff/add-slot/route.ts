import dbConnect, { ParkingSlot } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { slotId } = await req.json();

    await dbConnect();

    // Check if slot already exists
    const existingSlot = await ParkingSlot.findOne({ slotId });
    if (existingSlot) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Slot already exists",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create new slot
    await ParkingSlot.create({
      slotId,
      status: 'available'
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Slot added successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Add slot error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Failed to add slot",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}