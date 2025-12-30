"use client";

import React, { useState, useEffect } from 'react';
import { Car, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ParkingSlot {
  _id: string;
  slotId: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  occupiedByVehicle?: { numberPlate: string };
}

interface UserData {
  email: string;
  _id: string;
  role: string;
}

export default function ParkingLayoutPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [studentData, setStudentData] = useState({ studentId: '', studentName: '' });
  const { toast } = useToast();
  const router = useRouter();

  const generateSlots = () => {
    const generatedSlots: ParkingSlot[] = [];
    for (let i = 1; i <= 40; i++) {
      generatedSlots.push({
        _id: `slot-${i}`,
        slotId: `P${i.toString().padStart(3, '0')}`,
        status: 'available'
      });
    }
    return generatedSlots;
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/parking-slots');
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setSlots(data.data);
      } else {
        setSlots(generateSlots());
      }
    } catch (error) {
      setSlots(generateSlots());
    }
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setShowBooking(false);
    setVehicleNumber('');
  };

  const handleBookNow = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (selectedSlot?.status === 'available') {
      setShowBooking(true);
    }
  };

  const submitBooking = async () => {
    if (!selectedSlot || !vehicleNumber.trim() || !studentData.studentId) return;

    try {
      const response = await fetch('/api/parking-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.slotId,
          vehicleNumber: vehicleNumber.trim(),
          studentId: studentData.studentId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({ title: "Success", description: data.message });
        fetchSlots();
        setShowBooking(false);
        setVehicleNumber('');
      } else {
        toast({ 
          title: "Error", 
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to book slot",
        variant: "destructive"
      });
    }
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500 hover:bg-green-600';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const summary = {
    total: 40,
    occupied: slots.filter(s => s.status === 'occupied').length,
    reserved: slots.filter(s => s.status === 'reserved').length,
    maintenance: slots.filter(s => s.status === 'maintenance').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Parking Layout</h1>
            {user && <p className="text-gray-600">Welcome, {user.email}</p>}
          </div>
          {!user && (
            <Button onClick={() => router.push('/login')} variant="outline">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-gray-600">Total Slots</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{summary.occupied}</div>
              <div className="text-sm text-gray-600">Occupied</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.reserved}</div>
              <div className="text-sm text-gray-600">Reserved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{summary.maintenance}</div>
              <div className="text-sm text-gray-600">Maintenance</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6">
          {/* Parking Grid */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Parking Area Map</h2>
            <div className="grid grid-cols-8 gap-2 p-4 bg-white rounded-lg shadow">
              {slots.map((slot) => (
                <div
                  key={slot.slotId}
                  onClick={() => handleSlotClick(slot)}
                  className={`
                    w-16 h-16 rounded cursor-pointer transition-all duration-200
                    ${getSlotColor(slot.status)}
                    ${selectedSlot?.slotId === slot.slotId ? 'ring-4 ring-blue-400' : ''}
                    flex items-center justify-center text-white text-xs font-semibold
                  `}
                >
                  {slot.slotId}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Slot Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSlot ? (
                  <>
                    <div>
                      <div className="font-semibold">Slot ID: {selectedSlot.slotId}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        Status: {selectedSlot.status}
                      </div>
                      {selectedSlot.occupiedByVehicle && (
                        <div className="text-sm text-gray-600">
                          Vehicle: {selectedSlot.occupiedByVehicle.numberPlate}
                        </div>
                      )}
                    </div>
                    
                    {selectedSlot.status === 'available' && (
                      <div className="space-y-3">
                        {!showBooking ? (
                          <Button onClick={handleBookNow} className="w-full">
                            Book Now
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <Label>Student ID</Label>
                              <Input
                                placeholder="Enter Student ID"
                                value={studentData.studentId}
                                onChange={(e) => setStudentData(prev => ({...prev, studentId: e.target.value}))}
                              />
                            </div>
                            <div>
                              <Label>Vehicle Number</Label>
                              <Input
                                placeholder="Enter Vehicle Number"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={submitBooking} className="flex-1">
                                Submit
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setShowBooking(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    Select a parking slot to view details
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Login Dialog */}
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>You need to login to book a parking slot.</p>
              <div className="flex gap-2">
                <Button onClick={() => router.push('/login')} className="flex-1">
                  Go to Login
                </Button>
                <Button onClick={() => router.push('/register')} variant="outline" className="flex-1">
                  Register
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}