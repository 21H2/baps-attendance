import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getServerSession } from "@/lib/auth"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { Container } from "@/components/ui/container"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AttendanceMS - Smart Attendance Management",
  description: "Modern attendance tracking and management system with beautiful UI",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null

  try {
    session = await getServerSession()
  } catch (error) {
    console.error("Error getting session in layout:", error)
  }

  if (!session) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Container size="full" padding="none">
              {children}
            </Container>
          </div>
          <Toaster />
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <Container size="full" padding="md" className="py-6 sm:py-8 lg:py-12">
                {children}
              </Container>
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
