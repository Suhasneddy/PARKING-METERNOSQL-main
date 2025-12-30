import { NextResponse } from 'next/server';
import dbConnect, { Vehicle } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Skip during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
    return NextResponse.json({
      success: false,
      message: "This endpoint is not available during build time",
    }, { status: 503 });
  }

  try {
    await dbConnect();
    
    // Check if vehicle exists to avoid duplicates
    const existing = await Vehicle.findOne({ vehicleNumber: 'ABC-1234' });
    if (existing) {
      return NextResponse.json({ message: 'Test vehicle ABC-1234 already exists' });
    }

    await Vehicle.create({
      vehicleNumber: 'ABC-1234',
      numberPlate: 'ABC-1234',
      studentId: '12345'
    });

    return NextResponse.json({ success: true, message: 'Created vehicle: ABC-1234' });
  } catch (error) {
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}