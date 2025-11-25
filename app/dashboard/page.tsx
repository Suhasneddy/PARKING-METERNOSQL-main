"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CameraCapture } from "@/components/camera-capture"

interface StudentDetails {
  studentName: string
  usn: string
  hostelRoom: string
  vehicleNumber: string
  registrationDate: string
}

export default function DashboardPage() {
  const [mode, setMode] = useState<"scan" | "results">("scan")
  const [isLoading, setIsLoading] = useState(false)
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleCapture = async (imageData: string) => {
    setIsLoading(true)
    setNotFound(false)
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licensePlateImage: imageData }),
      })

      const data = await response.json()
      if (data.success && data.student) {
        setStudentDetails(data.student)
        setMode("results")
      } else {
        setNotFound(true)
        setMode("results")
      }
    } catch (error) {
      console.error("Scan error:", error)
      setNotFound(true)
      setMode("results")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Vehicle Verification</h1>
          <p className="text-muted-foreground">
            Scan a license plate to verify vehicle registration and view student details.
          </p>
        </div>

        {mode === "scan" && (
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Scan License Plate</h2>
            <CameraCapture onCapture={handleCapture} isLoading={isLoading} />
          </Card>
        )}

        {mode === "results" && (
          <div className="space-y-6">
            {notFound ? (
              <Card className="p-8 text-center space-y-6 border-red-200 bg-red-50">
                <div className="text-5xl">❌</div>
                <div>
                  <h2 className="text-2xl font-semibold text-red-900 mb-2">Vehicle Not Registered</h2>
                  <p className="text-red-700">
                    This license plate is not registered in our system. Please contact the parking office.
                  </p>
                </div>
                <Button onClick={() => setMode("scan")} className="w-full bg-primary hover:bg-primary/90" size="lg">
                  Scan Another Plate
                </Button>
              </Card>
            ) : studentDetails ? (
              <Card className="p-8 space-y-6 border-green-200 bg-green-50">
                <div className="text-center">
                  <div className="text-5xl mb-2">✅</div>
                  <h2 className="text-2xl font-semibold text-green-900">Vehicle Registered</h2>
                </div>
                <div className="bg-white p-6 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Student Name</p>
                      <p className="text-xl font-semibold text-foreground">{studentDetails.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">USN</p>
                      <p className="text-xl font-semibold text-foreground">{studentDetails.usn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hostel Room</p>
                      <p className="text-xl font-semibold text-foreground">{studentDetails.hostelRoom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle Number</p>
                      <p className="text-xl font-semibold text-primary">{studentDetails.vehicleNumber}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Registration Date</p>
                      <p className="text-lg font-medium text-foreground">
                        {new Date(studentDetails.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setMode("scan")
                    setStudentDetails(null)
                  }}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Scan Another Plate
                </Button>
              </Card>
            ) : null}
          </div>
        )}
      </div>
    </main>
  )
}
