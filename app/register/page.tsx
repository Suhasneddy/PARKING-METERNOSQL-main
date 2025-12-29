"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    studentName: "John Doe",
    studentId: "12345",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
    department: "Computer Science",
    year: "3",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleRegister() {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to register")
      }

      setSuccess("Student registered successfully!")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Registration failed:", err)
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Registration Portal</h1>
          <p className="text-muted-foreground">
            Register as a student to access campus services.
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Student Information</h2>
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
              <Label htmlFor="studentId">Student ID / Roll Number</Label>
              <Input
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="e.g., 12345"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g., john.doe@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="e.g., 1234567890"
              />
            </div>
            <div>
              <Label htmlFor="department">Department / Course</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="year">Year / Semester</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g., 3"
              />
            </div>
          </div>
          <Button
            onClick={handleRegister}
            disabled={loading || !formData.studentName || !formData.studentId || !formData.email || !formData.phoneNumber || !formData.department || !formData.year}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
        </Card>
      </div>
    </main>
  )
}

