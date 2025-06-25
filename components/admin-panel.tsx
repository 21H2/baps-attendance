"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Settings, Users, Database, Shield } from "lucide-react"

interface SystemStats {
  totalUsers: number
  totalStudents: number
  totalAttendanceRecords: number
  systemUptime: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

export default function AdminPanel() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalAttendanceRecords: 0,
    systemUptime: "99.9%",
  })
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchSystemStats()
    fetchUsers()
  }, [])

  const fetchSystemStats = async () => {
    try {
      // Fetch students count
      const studentsResponse = await fetch("/api/students")
      const students = await studentsResponse.json()

      // Fetch attendance records count
      const attendanceResponse = await fetch("/api/attendance")
      const attendance = await attendanceResponse.json()

      setStats({
        totalUsers: 3, // Placeholder - would need admin API endpoint
        totalStudents: students.length,
        totalAttendanceRecords: attendance.length,
        systemUptime: "99.9%",
      })
    } catch (error) {
      console.error("Error fetching system stats:", error)
    }
  }

  const fetchUsers = async () => {
    // In a real app, this would be an admin-only API endpoint
    // For now, showing placeholder data
    setUsers([
      { id: "1", name: "Admin User", email: "admin@school.com", role: "admin", status: "active" },
      { id: "2", name: "Teacher 1", email: "teacher1@school.com", role: "teacher", status: "active" },
      { id: "3", name: "Teacher 2", email: "teacher2@school.com", role: "teacher", status: "active" },
    ])
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Database className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendanceRecords}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Settings className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemUptime}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Send email alerts for attendance</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Backup Settings</h4>
              <p className="text-sm text-muted-foreground">Automatic data backup configuration</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Security Settings</h4>
              <p className="text-sm text-muted-foreground">Password policies and security rules</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
