"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, UserX, TrendingUp, Calendar, Clock, TrendingDown } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { FadeIn } from "@/components/ui/fade-in"
import { ResponsiveCard } from "@/components/ui/responsive-card"
import { ResponsiveGrid } from "@/components/ui/responsive-grid"
import { Badge } from "@/components/ui/badge"

interface DashboardStats {
  totalStudents: number
  presentToday: number
  absentToday: number
  attendanceRate: number
  rateChange: number
  weeklyPresent: number
  weeklyAbsent: number
  weeklyRate: number
  recentActivity: any[]
  lastUpdated: string
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      setError(null)
      const response = await fetch("/api/dashboard/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setError("Failed to load dashboard stats")
    } finally {
      setLoading(false)
    }
  }

  const statItems = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      gradient: "blue" as const,
      iconBg: "bg-blue-500",
      description: "Active students",
      trend: null,
    },
    {
      title: "Present Today",
      value: stats?.presentToday || 0,
      icon: UserCheck,
      gradient: "green" as const,
      iconBg: "bg-green-500",
      description: "Students present",
      trend: null,
    },
    {
      title: "Absent Today",
      value: stats?.absentToday || 0,
      icon: UserX,
      gradient: "pink" as const,
      iconBg: "bg-red-500",
      description: "Students absent",
      trend: null,
    },
    {
      title: "Attendance Rate",
      value: `${stats?.attendanceRate || 0}%`,
      icon: TrendingUp,
      gradient: "purple" as const,
      iconBg: "bg-purple-500",
      description: "Today's rate",
      trend: stats?.rateChange || 0,
    },
    {
      title: "Weekly Rate",
      value: `${stats?.weeklyRate || 0}%`,
      icon: Calendar,
      gradient: "orange" as const,
      iconBg: "bg-orange-500",
      description: "This week",
      trend: null,
    },
    {
      title: "Weekly Present",
      value: stats?.weeklyPresent || 0,
      icon: Clock,
      gradient: "blue" as const,
      iconBg: "bg-teal-500",
      description: "This week",
      trend: null,
    },
  ]

  if (loading) {
    return (
      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap="md">
        {[...Array(6)].map((_, i) => (
          <ResponsiveCard key={i} padding="md" className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-2" />
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap="md">
        {statItems.map((stat, index) => (
          <FadeIn key={stat.title} delay={index * 100}>
            <ResponsiveCard
              gradient={stat.gradient}
              padding="md"
              className="group hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform origin-left">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  {stat.trend !== null && (
                    <div className="flex items-center space-x-1">
                      {stat.trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : stat.trend < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className={`text-sm font-medium ${stat.trend > 0 ? 'text-green-600 dark:text-green-400' : stat.trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                        {stat.trend > 0 ? '+' : ''}{stat.trend}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: typeof stat.value === "string" 
                        ? stat.value 
                        : `${Math.min((stat.value as number) * 2, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </ResponsiveCard>
          </FadeIn>
        ))}
      </ResponsiveGrid>

      {stats?.lastUpdated && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(stats.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  )
}
