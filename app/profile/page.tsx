"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, LogOut, Car, MapPin } from "lucide-react"

interface UserData {
  email: string;
  _id: string;
  studentId: string;
}

interface StudentData {
  studentName: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  department: string;
  year: string;
  registrationDate: string;
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchStudentData(parsedUser.studentId)
  }, [router])

  const fetchStudentData = async (studentId: string) => {
    try {
      const response = await fetch(`/api/student-profile?studentId=${studentId}`)
      const data = await response.json()
      if (data.success) {
        setStudentData(data.student)
      }
    } catch (error) {
      console.error('Failed to fetch student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  if (!user || !studentData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p>Profile not found</p>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">User Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg">{studentData.studentName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Student ID</label>
                <p className="text-lg">{studentData.studentId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{studentData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg">{studentData.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <p className="text-lg">{studentData.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Year</label>
                <p className="text-lg">{studentData.year}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Registration Date</label>
              <p className="text-lg">{new Date(studentData.registrationDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => router.push('/vehicles')} 
            variant="outline" 
            className="h-20 flex flex-col items-center gap-2"
          >
            <Car className="h-6 w-6" />
            Manage Vehicles
          </Button>
          <Button 
            onClick={() => router.push('/parking-layout')} 
            variant="outline" 
            className="h-20 flex flex-col items-center gap-2"
          >
            <MapPin className="h-6 w-6" />
            Parking Layout
          </Button>
        </div>
      </div>
    </main>
  )
}