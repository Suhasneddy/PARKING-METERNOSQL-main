"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ParkingSlot {
  _id: string
  slotId: string
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  occupiedByVehicle?: string
  lastUpdated: string
}

export default function StaffDashboard() {
  const [slots, setSlots] = useState<ParkingSlot[]>([])
  const [newSlotId, setNewSlotId] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchSlots()
  }, [])

  const fetchSlots = async () => {
    try {
      const res = await fetch("/api/parking-slots")
      const data = await res.json()
      if (data.success) {
        setSlots(data.slots)
      }
    } catch (error) {
      console.error("Failed to fetch slots:", error)
    }
  }

  const addSlot = async () => {
    if (!newSlotId) return
    
    try {
      setLoading(true)
      const res = await fetch("/api/staff/add-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: newSlotId }),
      })
      
      const data = await res.json()
      if (data.success) {
        setMessage("Slot added successfully")
        setNewSlotId("")
        fetchSlots()
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage("Failed to add slot")
    } finally {
      setLoading(false)
    }
  }

  const removeSlot = async (slotId: string) => {
    try {
      setLoading(true)
      const res = await fetch("/api/staff/remove-slot", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId }),
      })
      
      const data = await res.json()
      if (data.success) {
        setMessage("Slot removed successfully")
        fetchSlots()
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage("Failed to remove slot")
    } finally {
      setLoading(false)
    }
  }

  const changeSlotStatus = async (slotId: string, newStatus: string) => {
    try {
      setLoading(true)
      const res = await fetch("/api/staff/update-slot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, status: newStatus }),
      })
      
      const data = await res.json()
      if (data.success) {
        setMessage(`Slot ${slotId} updated to ${newStatus}`)
        fetchSlots()
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage("Failed to update slot")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Staff Dashboard</h1>
          <p className="text-muted-foreground">Manage parking slots and system</p>
        </div>

        {/* Add New Slot */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Parking Slot</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="newSlotId">Slot ID</Label>
              <Input
                id="newSlotId"
                value={newSlotId}
                onChange={(e) => setNewSlotId(e.target.value)}
                placeholder="e.g., P041"
              />
            </div>
            <Button onClick={addSlot} disabled={loading || !newSlotId}>
              Add Slot
            </Button>
          </div>
        </Card>

        {message && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
            {message}
          </div>
        )}

        {/* Slots Management */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Manage Parking Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <div key={slot._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{slot.slotId}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    slot.status === 'available' ? 'bg-green-100 text-green-800' :
                    slot.status === 'occupied' ? 'bg-red-100 text-red-800' :
                    slot.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {slot.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <select
                    className="w-full p-2 border rounded"
                    value={slot.status}
                    onChange={(e) => changeSlotStatus(slot.slotId, e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => removeSlot(slot.slotId)}
                  >
                    Remove Slot
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}