"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestPage() {
  const [formData, setFormData] = useState({
    studentName: "John Doe",
    usn: "1BM19CS001",
    hostelRoom: "A-201",
    vehicleNumber: "KA01AB1234",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [verifyPlate, setVerifyPlate] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleRegister() {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const res = await fetch("/api/test/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to register")
      }

      setSuccess("Student and vehicle registered successfully!")
    } catch (err: any) {
      console.error("Registration failed:", err)
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify() {
    try {
      setVerifyLoading(true)
      setVerifyError(null)
      setVerificationResult(null)

      const res = await fetch("/api/test/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleNumber: verifyPlate }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify")
      }

      if (data.success) {
        setVerificationResult(data.vehicle)
      } else {
        setVerificationResult("User not registered")
      }
    } catch (err: any) {
      console.error("Verification failed:", err)
      setVerifyError(err?.message || "Something went wrong")
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Test Page</h1>
          <p className="text-muted-foreground">
            Use this page to register student details and verify vehicle number plates.
          </p>
        </div>

        <Card className="p-8 space-y-6 mb-8">
          <h2 className="text-2xl font-semibold">Register Student</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentName">Full Name</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="usn">USN (University Serial Number)</Label>
              <Input
                id="usn"
                name="usn"
                value={formData.usn}
                onChange={handleInputChange}
                placeholder="e.g., 1BM19CS001"
              />
            </div>
            <div>
              <Label htmlFor="hostelRoom">Hostel Room Number</Label>
              <Input
                id="hostelRoom"
                name="hostelRoom"
                value={formData.hostelRoom}
                onChange={handleInputChange}
                placeholder="e.g., A-201"
              />
            </div>
            <div>
              <Label htmlFor="vehicleNumber">Vehicle Number / Registration Plate</Label>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                placeholder="e.g., KA01AB1234"
              />
            </div>
          </div>
          <Button
            onClick={handleRegister}
            disabled={loading || !formData.studentName || !formData.usn || !formData.hostelRoom || !formData.vehicleNumber}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
        </Card>

        <Card className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Verify Vehicle</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="verifyPlate">Vehicle Number Plate</Label>
              <Input
                id="verifyPlate"
                name="verifyPlate"
                value={verifyPlate}
                onChange={(e) => setVerifyPlate(e.target.value)}
                placeholder="Enter vehicle number plate to verify"
              />
            </div>
          </div>
          <Button
            onClick={handleVerify}
            disabled={verifyLoading || !verifyPlate}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {verifyLoading ? "Verifying..." : "Verify"}
          </Button>
          {verifyError && <p className="text-red-500 text-sm mt-4">{verifyError}</p>}
          {verificationResult && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Verification Result</h3>
              {typeof verificationResult === "string" ? (
                <p>{verificationResult}</p>
              ) : (
                <div>
                  <p className="text-green-500 font-semibold">Number plate verified</p>
                  <p><strong>Student Name:</strong> {verificationResult.studentName}</p>
                  <p><strong>USN:</strong> {verificationResult.usn}</p>
                  <p><strong>Hostel Room:</strong> {verificationResult.hostelRoom}</p>
                  <p><strong>Vehicle Number:</strong> {verificationResult.vehicleNumber}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
