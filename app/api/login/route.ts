import { connectToDatabase } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { email, password, role } = payload;

    const { db } = await connectToDatabase();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 401 }
      );
    }

    // Optionally update last-login timestamp
    await db
      .collection("users")
      .updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    // Store user session in localStorage (client-side)
    const response = NextResponse.json(
      { success: true, message: "Login successful", role: user.role, user: { email: user.email, _id: user._id } },
      { status: 200 }
    );
    
    return response;
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
