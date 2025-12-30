// PARKING-METERNOSQL-main/app/parking-layout/page.tsx
"use client";

import React from 'react';
import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ParkingSpot {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
}

const mockParkingSpots: ParkingSpot[] = [
  { id: 'P001', name: 'Spot 1A', status: 'available' },
  { id: 'P002', name: 'Spot 1B', status: 'occupied' },
  { id: 'P003', name: 'Spot 1C', status: 'available' },
  { id: 'P004', name: 'Spot 1D', status: 'reserved' },
  { id: 'P005', name: 'Spot 2A', status: 'available' },
  { id: 'P006', name: 'Spot 2B', status: 'available' },
  { id: 'P007', name: 'Spot 2C', status: 'occupied' },
  { id: 'P008', name: 'Spot 2D', status: 'available' },
  { id: 'P009', name: 'Spot 3A', status: 'reserved' },
  { id: 'P010', name: 'Spot 3B', status: 'available' },
];

export default function ParkingLayoutPage() {
  const getStatusVariant = (status: ParkingSpot['status']) => {
    switch (status) {
      case 'available':
        return 'success'; // Assuming a 'success' variant exists or define one
      case 'occupied':
        return 'destructive'; // Assuming a 'destructive' variant exists or define one
      case 'reserved':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    console.log(`Clicked on parking spot: ${spot.name}, Status: ${spot.status}`);
    // Future: Open a dialog or sheet for more details/actions
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Parking Layout</h1>
          <p className="text-slate-600 dark:text-slate-400">Overview and management of parking spots.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockParkingSpots.map((spot) => (
            <Card
              key={spot.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSpotClick(spot)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{spot.name}</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  <Badge variant={getStatusVariant(spot.status)}>
                    {spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">ID: {spot.id}</p>
                {/* Future: Add more details or a button */}
                {/* <Button variant="outline" size="sm" className="mt-4">
                  View Details
                </Button> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}