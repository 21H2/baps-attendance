"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface ActivityRecord {
  id: string
  attendance_date: string
  status: "present" | "absent"
  student: {
    name: string
    student_id: string
  }
}

export default function RecentActivity() {
  const [recentRecords, setRecentRecords] = useState<ActivityRecord[]>([])

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/attendance?limit=5")
      const data = await response.json()
      setRecentRecords(data.slice(0, 5))
    } catch (error) {
      console.error("Error fetching recent activity:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRecords.length > 0 ? (
            recentRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{record.student?.name || "Unknown Student"}</p>
                  <p className="text-sm text-muted-foreground">{record.attendance_date}</p>
                </div>
                <Badge variant={record.status === "present" ? "default" : "destructive"}>{record.status}</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
