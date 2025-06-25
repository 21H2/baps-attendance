// Mock data store - In production, this would be replaced with a real database

interface Student {
  id: string
  name: string
  email: string
  studentId: string
  grade: string
  status: "active" | "inactive"
}

interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  status: "present" | "absent"
}

// Mock data
let students: Student[] = [
  { id: "1", name: "John Doe", email: "john@student.com", studentId: "STU001", grade: "10", status: "active" },
  { id: "2", name: "Jane Smith", email: "jane@student.com", studentId: "STU002", grade: "10", status: "active" },
  { id: "3", name: "Bob Johnson", email: "bob@student.com", studentId: "STU003", grade: "11", status: "active" },
  { id: "4", name: "Alice Brown", email: "alice@student.com", studentId: "STU004", grade: "11", status: "active" },
  { id: "5", name: "Charlie Wilson", email: "charlie@student.com", studentId: "STU005", grade: "12", status: "active" },
]

const attendanceRecords: AttendanceRecord[] = [
  { id: "1", studentId: "1", date: "2024-01-15", status: "present" },
  { id: "2", studentId: "2", date: "2024-01-15", status: "present" },
  { id: "3", studentId: "3", date: "2024-01-15", status: "absent" },
  { id: "4", studentId: "4", date: "2024-01-15", status: "present" },
  { id: "5", studentId: "5", date: "2024-01-15", status: "present" },
]

export function getStudents(): Student[] {
  return students
}

export function addStudent(student: Student): void {
  students.push(student)
}

export function updateStudent(updatedStudent: Student): void {
  const index = students.findIndex((s) => s.id === updatedStudent.id)
  if (index !== -1) {
    students[index] = updatedStudent
  }
}

export function deleteStudent(id: string): void {
  students = students.filter((s) => s.id !== id)
}

export function getAttendanceRecords(): AttendanceRecord[] {
  return attendanceRecords
}

export function markAttendance(studentId: string, date: string, status: "present" | "absent"): void {
  const existingRecord = attendanceRecords.find((r) => r.studentId === studentId && r.date === date)

  if (existingRecord) {
    existingRecord.status = status
  } else {
    attendanceRecords.push({
      id: Date.now().toString(),
      studentId,
      date,
      status,
    })
  }
}

export function getAttendanceForDate(date: string): Record<string, "present" | "absent"> {
  const records = attendanceRecords.filter((r) => r.date === date)
  const attendance: Record<string, "present" | "absent"> = {}

  records.forEach((record) => {
    attendance[record.studentId] = record.status
  })

  return attendance
}
