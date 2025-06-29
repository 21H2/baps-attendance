"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search, Filter, Download, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import EditStudentDialog from "./edit-student-dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FadeIn } from "@/components/ui/fade-in"
import { GradientCard } from "@/components/ui/gradient-card"

interface Student {
  id: string
  student_id: string
  name: string
  email: string
  grade: string
  status: string
}

export default function StudentsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/students?search=${searchTerm}`)
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Student Deleted ✅",
          description: `${name} has been successfully removed.`,
        })
        fetchStudents()
      } else {
        throw new Error("Failed to delete student")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      })
    }
  }

  const handleSearch = async () => {
    setSearchLoading(true)
    await fetchStudents()
    setSearchLoading(false)
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <GradientCard gradient="blue">
        <CardHeader>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
            </div>
          </div>
        </CardHeader>
      </GradientCard>
    )
  }

  return (
    <FadeIn>
      <GradientCard gradient="blue" className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white -m-6 mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                <UserPlus className="w-6 h-6" />
                <span>Student Records</span>
              </CardTitle>
              <p className="text-blue-100 mt-1">Manage and track all student information</p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={searchLoading}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              {searchLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Search
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-700/50">
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Student ID</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Email</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Grade</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400">{student.student_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
                        Grade {student.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === "active" ? "default" : "secondary"}
                        className={
                          student.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <EditStudentDialog student={student} onUpdate={fetchStudents}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </EditStudentDialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student.id, student.name)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first student"}
              </p>
            </div>
          )}
        </CardContent>
      </GradientCard>
    </FadeIn>
  )
}
