"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CameraCapture } from "@/components/camera-capture"

export default function RegisterPage() {
  const [step, setStep] = useState<"details" | "camera" | "preview">("details")
  const [formData, setFormData] = useState({
    studentName: "",
    usn: "",
    hostelRoom: "",
    vehicleNumber: "",
  })
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData)
    setStep("preview")
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          licensePlateImage: capturedImage,
        }),
      })

      if (response.ok) {
        setSuccessMessage("Vehicle registered successfully!")
        setFormData({ studentName: "", usn: "", hostelRoom: "", vehicleNumber: "" })
        setCapturedImage(null)
        setStep("details")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Register Your Vehicle</h1>
          <p className="text-muted-foreground">
            Complete the registration process to allow your vehicle access to campus parking.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-4 mb-8">
          <div
            className={`flex-1 h-2 rounded-full ${step === "details" || step === "camera" || step === "preview" ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`flex-1 h-2 rounded-full ${step === "camera" || step === "preview" ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div className={`flex-1 h-2 rounded-full ${step === "preview" ? "bg-primary" : "bg-muted"}`}></div>
        </div>

        {successMessage && (
          <Card className="mb-8 p-4 bg-green-50 border-green-200">
            <p className="text-green-800">{successMessage}</p>
          </Card>
        )}

        {/* Step 1: Student Details */}
        {step === "details" && (
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Student Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">USN (University Serial Number)</label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={handleInputChange}
                  placeholder="e.g., 1BM19CS001"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hostel Room Number</label>
                <input
                  type="text"
                  name="hostelRoom"
                  value={formData.hostelRoom}
                  onChange={handleInputChange}
                  placeholder="e.g., A-201"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Number / Registration Plate</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., KA01AB1234"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <Button
              onClick={() => setStep("camera")}
              disabled={!formData.studentName || !formData.usn || !formData.hostelRoom || !formData.vehicleNumber}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Next: Capture License Plate
            </Button>
          </Card>
        )}

        {/* Step 2: Camera Capture */}
        {step === "camera" && (
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Capture License Plate</h2>
            <CameraCapture onCapture={handleCapture} isLoading={isLoading} />
            <Button onClick={() => setStep("details")} variant="outline" className="w-full" size="lg">
              Back
            </Button>
          </Card>
        )}

        {/* Step 3: Preview and Confirm */}
        {step === "preview" && capturedImage && (
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Review & Confirm</h2>
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Student Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{formData.studentName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">USN</p>
                    <p className="font-medium">{formData.usn}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hostel Room</p>
                    <p className="font-medium">{formData.hostelRoom}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vehicle Number</p>
                    <p className="font-medium">{formData.vehicleNumber}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Captured License Plate</p>
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="License Plate"
                  className="w-full rounded-lg border border-border"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setStep("camera")} variant="outline" className="flex-1" size="lg">
                Recapture
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isLoading ? "Registering..." : "Confirm Registration"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
