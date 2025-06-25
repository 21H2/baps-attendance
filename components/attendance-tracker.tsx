"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCheck, UserX, Calendar, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  student_id: string
  name: string
  grade: string
}

interface AttendanceRecord {
  student_id: string
  status: "present" | "absent"
}

export default function AttendanceTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students?status=active")
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?date=${selectedDate}`)
      const records = await response.json()

      const attendanceMap: Record<string, "present" | "absent"> = {}
      records.forEach((record: any) => {
        attendanceMap[record.student_id] = record.status
      })

      setAttendance(attendanceMap)
    } catch (error) {
      console.error("Error fetching attendance:", error)
    }
  }

  const handleAttendanceChange = (studentId: string, status: "present" | "absent") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const handleSaveAttendance = async () => {
    setSaving(true)
    try {
      const promises = Object.entries(attendance).map(([studentId, status]) =>
        fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            date: selectedDate,
            status,
          }),
        }),
      )

      await Promise.all(promises)

      toast({
        title: "Attendance Saved",
        description: `Attendance for ${selectedDate} has been saved successfully.`,
      })
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const presentCount = Object.values(attendance).filter((status) => status === "present").length
  const absentCount = Object.values(attendance).filter((status) => status === "absent").length

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Attendance Tracker</span>
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span>Present: {presentCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserX className="w-4 h-4 text-red-600" />
                  <span>Absent: {absentCount}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleSaveAttendance} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.student_id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>
                    {attendance[student.id] && (
                      <Badge variant={attendance[student.id] === "present" ? "default" : "destructive"}>
                        {attendance[student.id]}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "present" ? "default" : "outline"}
                        onClick={() => handleAttendanceChange(student.id, "present")}
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "absent" ? "destructive" : "outline"}
                        onClick={() => handleAttendanceChange(student.id, "absent")}
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
