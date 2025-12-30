"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Car, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserData {
  email: string;
  _id: string;
  studentId: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              {user ? `Welcome back, ${user.email}` : "Welcome to your dashboard."}
            </p>
          </div>
          
          {user && (
            <div className="flex gap-2">
              <Button onClick={() => router.push('/profile')} variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
        
        {/* Navigation Cards */}
        <div className="grid gap-6">
          <Link href="/parking-layout">
            <Button className="w-full h-20 text-lg" variant="outline">
              <Car className="mr-2 h-6 w-6" />
              Parking Layout
            </Button>
          </Link>
          
          {!user && (
            <div className="grid grid-cols-2 gap-4">
              <Link href="/login">
                <Button className="w-full h-16" variant="default">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full h-16" variant="outline">
                  Register
                </Button>
              </Link>
            </div>
          )}
          
          {user && (
            <div className="grid grid-cols-2 gap-4">
              <Link href="/vehicles">
                <Button className="w-full h-16" variant="outline">
                  <Car className="mr-2 h-5 w-5" />
                  Vehicles
                </Button>
              </Link>
              <Link href="/profile">
                <Button className="w-full h-16" variant="outline">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

