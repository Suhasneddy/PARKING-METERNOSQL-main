import dbConnect from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const staffId = url.searchParams.get('staffId');
    
    if (!staffId || staffId === 'undefined') {
      return new Response(
        JSON.stringify({ success: false, message: "Valid Staff ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await dbConnect();
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    const staff = await db.collection("staff").findOne({ staffId });
    
    if (!staff) {
      return new Response(
        JSON.stringify({ success: false, message: "Staff not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        staff: {
          staffName: staff.staffName,
          staffId: staff.staffId,
          email: staff.email,
          phoneNumber: staff.phoneNumber,
          department: staff.department,
          position: staff.position,
          registrationDate: staff.registrationDate
        }
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