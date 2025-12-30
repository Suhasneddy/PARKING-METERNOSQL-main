"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard.
          </p>
        </div>
        
        {/* Navigation Cards */}
        <div className="grid gap-6">
          <Link href="/parking-layout">
            <Button className="w-full h-20 text-lg" variant="outline">
              <Car className="mr-2 h-6 w-6" />
              Parking Layout
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

