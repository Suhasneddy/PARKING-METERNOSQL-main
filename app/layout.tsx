import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Roboto } from 'next/font/google'
// Remove this line
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})
// Remove this line

export const metadata: Metadata = {
  title: "Student Parking Meter",
  description: "License Plate Recognition System for Student Vehicle Management",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} font-sans antialiased`}>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between">
            <div className="flex space-x-4">
              <Link href="/" className="text-white">Home</Link>
              <Link href="/dashboard" className="text-white">Dashboard</Link>
              <Link href="/register" className="text-white">Register</Link>
              <Link href="/vehicles" className="text-white">Vehicles</Link>
              <Link href="/verification" className="text-white">Verification</Link>
              <Link href="/login" className="text-white">Login</Link>
            </div>
          </div>
        </nav>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
