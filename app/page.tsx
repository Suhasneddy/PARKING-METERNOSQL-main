"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">ParkMeter</div>
          <div className="flex gap-4">
            <Link href="/register">
              <Button variant="ghost">Register Student</Button>
            </Link>
            <Link href="/vehicles">
              <Button>Manage Vehicles</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              Smart Parking Management for <span className="text-primary">Students</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A simplified system for student and vehicle registration and verification.
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Register Now
                </Button>
              </Link>
              <Link href="/vehicles">
                <Button size="lg" variant="outline">
                  Manage Vehicles
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">🚗</div>
                  <p className="text-sm text-muted-foreground">Vehicle Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-2">Student Registration</h3>
            <p className="text-muted-foreground">
              Easily register students with their details.
            </p>
          </Card>
          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold mb-2">Vehicle Registration</h3>
            <p className="text-muted-foreground">
              Register vehicles and associate them with students.
            </p>
          </Card>
          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Manual Verification</h3>
            <p className="text-muted-foreground">
              Manually verify vehicles using their number plates.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started with ParkMeter today.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Registration
            </Button>
          </Link>
        </Card>
      </section>
    </main>
  )
}

