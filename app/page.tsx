"use client";

import Link from 'next/link';
import { MapPin, Car } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
            <Car className="h-6 w-6 text-blue-600" />
            <span>ParkingManager</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Overview of your parking facility.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Parking Layout Card */}
          <Link href="/parking-layout" className="group">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all duration-200 h-full flex flex-col">
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Parking Layout
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">
                Visual map of all parking slots. Manage occupancy and bookings in real-time.
              </p>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                View Map &rarr;
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}