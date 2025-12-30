import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ----------------------------------------------------
// Mongoose Schemas and Models for Parking Management
// ----------------------------------------------------

// Define the User Schema (placeholder)
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // Add other user properties as needed
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Define the Vehicle Schema
const VehicleSchema = new mongoose.Schema({
  numberPlate: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true, unique: true }, // For backward compatibility
  studentId: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationDate: { type: Date, default: Date.now },
  // Add other vehicle properties as needed
}, { timestamps: true });

export const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);

// Define the ParkingSlot Schema
const ParkingSlotSchema = new mongoose.Schema({
  slotId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available',
    required: true,
  },
  occupiedByVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null,
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export const ParkingSlot = mongoose.models.ParkingSlot || mongoose.model('ParkingSlot', ParkingSlotSchema);

export default dbConnect;