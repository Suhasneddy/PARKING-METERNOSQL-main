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
      dbName: 'parking_system', // Use same database as MongoDB client
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority' as const,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Define the User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Define the Vehicle Schema
const VehicleSchema = new mongoose.Schema({
  numberPlate: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationDate: { type: Date, default: Date.now },
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