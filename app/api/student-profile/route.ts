import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId');
    
    if (!studentId) {
      return new Response(
        JSON.stringify({ success: false, message: "Student ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { db } = await connectToDatabase();
    const student = await db.collection("students").findOne({ studentId });
    
    if (!student) {
      return new Response(
        JSON.stringify({ success: false, message: "Student not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        student: {
          studentName: student.studentName,
          studentId: student.studentId,
          email: student.email,
          phoneNumber: student.phoneNumber,
          department: student.department,
          year: student.year,
          registrationDate: student.registrationDate
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