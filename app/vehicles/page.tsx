"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function VehiclesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    studentId: "",
    vehicleNumber: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [verifyPlate, setVerifyPlate] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData(prev => ({ ...prev, studentId: parsedUser.studentId || "" }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleRegister() {
    if (!user) {
      toast({ title: "Login Required", description: "Please login first", variant: "destructive" })
      router.push('/login')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to register vehicle")
      }

      setSuccess("Vehicle registered successfully!")
      setFormData(prev => ({ ...prev, vehicleNumber: "" }))
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

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Vehicle Management</h1>
          <p className="text-muted-foreground mb-8">Please login to manage your vehicles</p>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Welcome {user.email}. Register and verify vehicles.
          </p>
        </div>

        <Card className="p-8 space-y-6 mb-8">
          <h2 className="text-2xl font-semibold">Register Vehicle</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="Enter student ID"
                disabled={!!user.studentId}
              />
            </div>
            <div>
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                placeholder="Enter vehicle number"
              />
            </div>
          </div>
          <Button
            onClick={handleRegister}
            disabled={loading || !formData.studentId || !formData.vehicleNumber}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading ? "Registering..." : "Register Vehicle"}
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
                  <p className="text-green-500 font-semibold">Vehicle verified</p>
                  <p><strong>Student Name:</strong> {verificationResult.studentName}</p>
                  <p><strong>Student ID:</strong> {verificationResult.studentId}</p>
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
