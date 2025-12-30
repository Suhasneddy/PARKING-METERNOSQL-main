"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, LogOut, Car, MapPin, Shield } from "lucide-react"

interface UserData {
  email: string;
  _id: string;
  studentId?: string;
  staffId?: string;
  role: string;
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

interface StaffData {
  staffName: string;
  staffId: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  registrationDate: string;
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [staffData, setStaffData] = useState<StaffData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    if (parsedUser.role === 'Staff' && parsedUser.staffId) {
      fetchStaffData(parsedUser.staffId)
    } else if (parsedUser.studentId) {
      fetchStudentData(parsedUser.studentId)
    } else {
      setLoading(false)
    }
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

  const fetchStaffData = async (staffId: string) => {
    try {
      const response = await fetch(`/api/staff-profile?staffId=${staffId}`)
      const data = await response.json()
      if (data.success) {
        setStaffData(data.staff)
      }
    } catch (error) {
      console.error('Failed to fetch staff data:', error)
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

  if (!user || (!studentData && !staffData)) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p>Profile not found</p>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      </main>
    )
  }

  const isStaff = user.role === 'Staff'
  const profileData = isStaff ? staffData : studentData

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isStaff ? 'Staff Profile' : 'Student Profile'}
            </h1>
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
              {isStaff ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
              {isStaff ? 'Staff Information' : 'Student Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isStaff && staffData ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg">{staffData.staffName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Staff ID</label>
                  <p className="text-lg">{staffData.staffId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{staffData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-lg">{staffData.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-lg">{staffData.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Position</label>
                  <p className="text-lg">{staffData.position}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Registration Date</label>
                  <p className="text-lg">{new Date(staffData.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            ) : studentData ? (
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
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Registration Date</label>
                  <p className="text-lg">{new Date(studentData.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {isStaff ? (
            <>
              <Button 
                onClick={() => router.push('/staff-dashboard')} 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
              >
                <Shield className="h-6 w-6" />
                Staff Dashboard
              </Button>
              <Button 
                onClick={() => router.push('/verification')} 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
              >
                <Car className="h-6 w-6" />
                Vehicle Verification
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </main>
  )
}