"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  student_id: string
}

interface ReportData {
  attendance_date: string
  status: string
  student: {
    name: string
    student_id: string
    grade: string
  }
}

export default function ReportsGenerator() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("all")
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const generateReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      if (selectedStudent !== "all") params.append("studentId", selectedStudent)

      const response = await fetch(`/api/attendance?${params.toString()}`)
      const data = await response.json()
      setReportData(data)

      toast({
        title: "Report Generated",
        description: `Found ${data.length} attendance records.`,
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    const headers = ["Date", "Student Name", "Student ID", "Grade", "Status"]
    const csvData = [
      headers.join(","),
      ...reportData.map((record) =>
        [
          record.attendance_date,
          `"${record.student?.name || "Unknown"}"`,
          record.student?.student_id || "N/A",
          record.student?.grade || "N/A",
          record.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const downloadPDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Attendance Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Attendance Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${reportData
              .map(
                (record) => `
              <tr>
                <td>${record.attendance_date}</td>
                <td>${record.student?.name || "Unknown"}</td>
                <td>${record.student?.student_id || "N/A"}</td>
                <td>${record.student?.grade || "N/A"}</td>
                <td>${record.status}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Generate Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <div>
              <Label>Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={generateReport} className="w-full" disabled={loading}>
                {loading ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>

          {reportData.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button onClick={downloadCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <Button onClick={downloadPDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results ({reportData.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.slice(0, 50).map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.attendance_date}</TableCell>
                    <TableCell>{record.student?.name || "Unknown"}</TableCell>
                    <TableCell>{record.student?.student_id || "N/A"}</TableCell>
                    <TableCell>{record.student?.grade || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {reportData.length > 50 && (
              <p className="text-sm text-muted-foreground mt-4">
                Showing first 50 records. Download full report for complete data.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
