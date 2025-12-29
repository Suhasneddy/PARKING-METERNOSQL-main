"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StudentDetails {
  studentName: string
  usn: string
  hostelRoom: string
  vehicleNumber: string
  registrationDate: string
}

export default function DashboardPage() {
  const [verifyPlate, setVerifyPlate] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  async function handleVerify() {
    try {
      setVerifyLoading(true)
      setVerifyError(null)
      setVerificationResult(null)

      const res = await fetch("/api/verify", {
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
        setVerificationResult("Vehicle not registered")
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
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Vehicle Verification</h1>
          <p className="text-muted-foreground">
            Enter a vehicle number to verify its registration and view student details.
          </p>
        </div>

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
                  <p className="text-green-500 font-semibold">Vehicle verified</p>
                  <p><strong>Student Name:</strong> {verificationResult.studentName}</p>
                  <p><strong>Student ID:</strong> {verificationResult.studentId}</p>
                  <p><strong>Vehicle Number:</strong> {verificationResult.vehicleNumber}</p>
                  <p><strong>Registration Date:</strong> {new Date(verificationResult.registrationDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}

