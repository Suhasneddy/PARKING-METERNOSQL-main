import { NextResponse } from 'next/server';
import dbConnect, { Vehicle } from '@/lib/db';

export async function GET() {
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