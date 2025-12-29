"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "User",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  async function handleLogin() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to login")
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Login</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account.
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <Label>Role</Label>
              <RadioGroup
                defaultValue="User"
                onValueChange={handleRoleChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="User" id="role-user" />
                  <Label htmlFor="role-user">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Staff" id="role-staff" />
                  <Label htmlFor="role-staff">Staff</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button
            onClick={handleLogin}
            disabled={loading || !formData.email || !formData.password}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </Card>
      </div>
    </main>
  )
}
