"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { FadeIn } from "@/components/ui/fade-in"
import { ResponsiveCard } from "@/components/ui/responsive-card"
import { ResponsiveGrid } from "@/components/ui/responsive-grid"

interface Stats {
  totalStudents: number
  presentToday: number
  absentToday: number
  attendanceRate: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]

      // Fetch students
      const studentsResponse = await fetch("/api/students")
      const students = await studentsResponse.json()

      // Fetch today's attendance
      const attendanceResponse = await fetch(`/api/attendance?date=${today}`)
      const attendance = await attendanceResponse.json()

      const presentToday = attendance.filter((record: any) => record.status === "present").length
      const absentToday = attendance.filter((record: any) => record.status === "absent").length
      const attendanceRate = students.length > 0 ? Math.round((presentToday / students.length) * 100) : 0

      setStats({
        totalStudents: students.length,
        presentToday,
        absentToday,
        attendanceRate,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statItems = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      gradient: "blue" as const,
      iconBg: "bg-blue-500",
    },
    {
      title: "Present Today",
      value: stats.presentToday,
      icon: UserCheck,
      gradient: "green" as const,
      iconBg: "bg-green-500",
    },
    {
      title: "Absent Today",
      value: stats.absentToday,
      icon: UserX,
      gradient: "orange" as const,
      iconBg: "bg-red-500",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      gradient: "purple" as const,
      iconBg: "bg-purple-500",
    },
  ]

  if (loading) {
    return (
      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }} gap="md">
        {[...Array(4)].map((_, i) => (
          <ResponsiveCard key={i} padding="md" className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-16" />
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>
    )
  }

  return (
    <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }} gap="md">
      {statItems.map((stat, index) => (
        <FadeIn key={stat.title} delay={index * 100}>
          <ResponsiveCard
            gradient={stat.gradient}
            padding="md"
            className="group hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {stat.title}
              </h3>
              <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:shadow-xl transition-shadow`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform origin-left">
                <AnimatedCounter value={stat.value} />
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: typeof stat.value === "string" ? stat.value : `${Math.min(stat.value * 2, 100)}%` }}
                />
              </div>
            </div>
          </ResponsiveCard>
        </FadeIn>
      ))}
    </ResponsiveGrid>
  )
}
