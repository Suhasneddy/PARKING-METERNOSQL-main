"use client"

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
      </div>
    </main>
  )
}

