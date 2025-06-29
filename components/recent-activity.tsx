"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, RefreshCw, User, Calendar } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

interface ActivityRecord {
  id: string
  attendance_date: string
  status: "present" | "absent"
  student: {
    name: string
    student_id: string
  }
  created_at: string
  notes?: string
}

export default function RecentActivity() {
  const [recentRecords, setRecentRecords] = useState<ActivityRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/attendance?limit=10")
      if (!response.ok) {
        throw new Error("Failed to fetch recent activity")
      }
      const data = await response.json()
      setRecentRecords(data.slice(0, 10))
    } catch (error) {
      console.error("Error fetching recent activity:", error)
      setError("Failed to load recent activity")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getStatusColor = (status: string) => {
    return status === "present" 
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  }

  if (loading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <Clock className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Activity</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchRecentActivity}
            disabled={loading}
            className="h-8 w-8 p-0 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-500 dark:text-red-400 text-sm mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchRecentActivity} className="dark:border-gray-600 dark:text-gray-300">
              Retry
            </Button>
          </div>
        ) : recentRecords.length > 0 ? (
          <div className="space-y-4">
            {recentRecords.map((record, index) => (
              <FadeIn key={record.id} delay={index * 50}>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {record.student?.name || "Unknown Student"}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(record.attendance_date)}</span>
                        {record.student?.student_id && (
                          <>
                            <span>•</span>
                            <span>ID: {record.student.student_id}</span>
                          </>
                        )}
                      </div>
                      {record.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">"{record.notes}"</p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={record.status === "present" ? "default" : "destructive"}
                    className={getStatusColor(record.status)}
                  >
                    {record.status}
                  </Badge>
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Attendance records will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
