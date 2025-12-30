"use client"
import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StaffRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    staffName: "",
    staffId: "",
    email: "",
    phoneNumber: "",
    department: "",
    position: "",
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

      const res = await fetch("/api/staff-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to register")
      }

      setSuccess("Staff registered successfully!")
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Staff Registration Portal</h1>
          <p className="text-muted-foreground">
            Register as staff to manage parking system.
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Staff Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="staffName">Full Name</Label>
              <Input
                id="staffName"
                name="staffName"
                value={formData.staffName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="staffId">Staff ID</Label>
              <Input
                id="staffId"
                name="staffId"
                value={formData.staffId}
                onChange={handleInputChange}
                placeholder="e.g., STF001"
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
                placeholder="e.g., staff@parking.com"
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
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Security"
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Parking Manager"
              />
            </div>
          </div>
          <Button
            onClick={handleRegister}
            disabled={loading || !formData.staffName || !formData.staffId || !formData.email || !formData.phoneNumber || !formData.department || !formData.position}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading ? "Registering..." : "Register Staff"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
        </Card>
      </div>
    </main>
  )
}