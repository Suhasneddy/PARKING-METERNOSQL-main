import { connectToDatabase } from "@/lib/mongodb";
import dbConnect, { ParkingSlot, Vehicle } from "@/lib/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    await dbConnect();
    
    console.log("Starting database migration...");
    
    // 1. Create default admin user
    const adminExists = await db.collection("users").findOne({ email: "admin@parking.com" });
    if (!adminExists) {
      await db.collection("users").insertOne({
        email: "admin@parking.com",
        password: "admin123",
        role: "Staff",
        studentId: "ADMIN001",
        createdAt: new Date(),
      });
      console.log("✅ Admin user created");
    }
    
    // 2. Create test student + user
    const testUserExists = await db.collection("users").findOne({ email: "test@student.com" });
    if (!testUserExists) {
      await db.collection("students").insertOne({
        studentName: "Test Student",
        studentId: "STU001",
        email: "test@student.com",
        phoneNumber: "1234567890",
        department: "Computer Science",
        year: "3",
        registrationDate: new Date(),
      });
      
      await db.collection("users").insertOne({
        email: "test@student.com",
        password: "STU001",
        role: "User",
        studentId: "STU001",
        createdAt: new Date(),
      });
      console.log("✅ Test student created");
    }
    
    // 3. Create test vehicles
    const testVehicleExists = await Vehicle.findOne({ vehicleNumber: "ABC123" });
    if (!testVehicleExists) {
      await Vehicle.create({
        numberPlate: "ABC123",
        vehicleNumber: "ABC123",
        studentId: "STU001",
        registrationDate: new Date(),
      });
      
      await Vehicle.create({
        numberPlate: "XYZ789",
        vehicleNumber: "XYZ789", 
        studentId: "STU001",
        registrationDate: new Date(),
      });
      console.log("✅ Test vehicles created");
    }
    
    // 4. Create 40 parking slots
    const slotsCount = await ParkingSlot.countDocuments();
    if (slotsCount === 0) {
      const slots = [];
      for (let i = 1; i <= 40; i++) {
        slots.push({
          slotId: `P${i.toString().padStart(3, '0')}`,
          status: 'available'
        });
      }
      await ParkingSlot.insertMany(slots);
      console.log("✅ 40 parking slots created");
    }
    
    // 5. Set a few slots as occupied for demo
    await ParkingSlot.updateOne(
      { slotId: "P001" },
      { 
        status: "occupied",
        occupiedByVehicle: (await Vehicle.findOne({ vehicleNumber: "ABC123" }))?._id,
        lastUpdated: new Date()
      }
    );
    
    await ParkingSlot.updateOne(
      { slotId: "P005" },
      { status: "maintenance", lastUpdated: new Date() }
    );
    
    await ParkingSlot.updateOne(
      { slotId: "P010" },
      { status: "reserved", lastUpdated: new Date() }
    );
    
    console.log("✅ Demo slots configured");
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Database migration completed successfully!",
        data: {
          adminLogin: { email: "admin@parking.com", password: "admin123" },
          testLogin: { email: "test@student.com", password: "STU001" },
          testVehicles: ["ABC123", "XYZ789"],
          parkingSlots: 40
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Migration error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Migration failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}