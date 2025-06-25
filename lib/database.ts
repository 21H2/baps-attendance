// Simple in-memory database for next-lite compatibility
// In production, replace with actual database integration

interface User {
  id: string
  email: string
  password_hash: string
  name: string
  role: string
  status: string
  created_at: string
}

interface Student {
  id: string
  student_id: string
  name: string
  email: string
  grade: string
  status: string
  created_by: string
  created_at: string
}

interface AttendanceRecord {
  id: string
  student_id: string
  attendance_date: string
  status: "present" | "absent"
  marked_by: string
  notes?: string
  created_at: string
}

// In-memory storage
const students: Student[] = [
  {
    id: "1",
    student_id: "STU001",
    name: "Alice Johnson",
    email: "alice.johnson@student.com",
    grade: "10",
    status: "active",
    created_by: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    student_id: "STU002",
    name: "Bob Smith",
    email: "bob.smith@student.com",
    grade: "10",
    status: "active",
    created_by: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    student_id: "STU003",
    name: "Charlie Brown",
    email: "charlie.brown@student.com",
    grade: "11",
    status: "active",
    created_by: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    student_id: "STU004",
    name: "Diana Wilson",
    email: "diana.wilson@student.com",
    grade: "11",
    status: "active",
    created_by: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    student_id: "STU005",
    name: "Edward Davis",
    email: "edward.davis@student.com",
    grade: "12",
    status: "active",
    created_by: "1",
    created_at: new Date().toISOString(),
  },
]

const attendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    student_id: "1",
    attendance_date: new Date().toISOString().split("T")[0],
    status: "present",
    marked_by: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    student_id: "2",
    attendance_date: new Date().toISOString().split("T")[0],
    status: "present",
    marked_by: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    student_id: "3",
    attendance_date: new Date().toISOString().split("T")[0],
    status: "absent",
    marked_by: "1",
    created_at: new Date().toISOString(),
  },
]

// User operations
export interface CreateUserData {
  email: string
  password_hash: string
  name: string
  role: string
}

export async function createUser(userData: CreateUserData) {
  const user = {
    id: Math.random().toString(36).substring(2),
    ...userData,
    status: "active",
    created_at: new Date().toISOString(),
  }
  return user
}

export async function getUserByEmail(email: string) {
  // Mock users for demo
  const users = [
    {
      id: "1",
      email: "admin@school.com",
      password_hash: "admin123",
      name: "Admin User",
      role: "admin",
      status: "active",
    },
    {
      id: "2",
      email: "teacher1@school.com",
      password_hash: "admin123",
      name: "Teacher 1",
      role: "teacher",
      status: "active",
    },
  ]
  return users.find((u) => u.email === email) || null
}

export async function getUserById(id: string) {
  const users = [
    {
      id: "1",
      email: "admin@school.com",
      password_hash: "admin123",
      name: "Admin User",
      role: "admin",
      status: "active",
    },
    {
      id: "2",
      email: "teacher1@school.com",
      password_hash: "admin123",
      name: "Teacher 1",
      role: "teacher",
      status: "active",
    },
  ]
  return users.find((u) => u.id === id) || null
}

// Student operations
export interface CreateStudentData {
  student_id: string
  name: string
  email: string
  grade: string
  status?: string
  created_by: string
}

export async function createStudent(studentData: CreateStudentData) {
  const student: Student = {
    id: Math.random().toString(36).substring(2),
    ...studentData,
    status: studentData.status || "active",
    created_at: new Date().toISOString(),
  }
  students.push(student)
  return student
}

export async function getStudents(filters: { search?: string | null; status?: string | null } = {}) {
  let filteredStudents = [...students]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filteredStudents = filteredStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.student_id.toLowerCase().includes(search),
    )
  }

  if (filters.status) {
    filteredStudents = filteredStudents.filter((student) => student.status === filters.status)
  }

  return filteredStudents
}

export async function updateStudent(id: string, updates: Partial<CreateStudentData>) {
  const index = students.findIndex((s) => s.id === id)
  if (index !== -1) {
    students[index] = { ...students[index], ...updates }
    return students[index]
  }
  throw new Error("Student not found")
}

export async function deleteStudent(id: string) {
  const index = students.findIndex((s) => s.id === id)
  if (index !== -1) {
    students.splice(index, 1)
  }
}

// Attendance operations
export interface MarkAttendanceData {
  studentId: string
  attendanceDate: string
  status: "present" | "absent"
  markedBy: string
  notes?: string
}

export async function markAttendance(attendanceData: MarkAttendanceData) {
  const existingIndex = attendanceRecords.findIndex(
    (record) =>
      record.student_id === attendanceData.studentId && record.attendance_date === attendanceData.attendanceDate,
  )

  const record: AttendanceRecord = {
    id: existingIndex !== -1 ? attendanceRecords[existingIndex].id : Math.random().toString(36).substring(2),
    student_id: attendanceData.studentId,
    attendance_date: attendanceData.attendanceDate,
    status: attendanceData.status,
    marked_by: attendanceData.markedBy,
    notes: attendanceData.notes,
    created_at: new Date().toISOString(),
  }

  if (existingIndex !== -1) {
    attendanceRecords[existingIndex] = record
  } else {
    attendanceRecords.push(record)
  }

  return record
}

export async function getAttendanceRecords(
  filters: {
    date?: string | null
    studentId?: string | null
    startDate?: string | null
    endDate?: string | null
  } = {},
) {
  let filteredRecords = [...attendanceRecords]

  if (filters.date) {
    filteredRecords = filteredRecords.filter((record) => record.attendance_date === filters.date)
  }

  if (filters.studentId) {
    filteredRecords = filteredRecords.filter((record) => record.student_id === filters.studentId)
  }

  if (filters.startDate && filters.endDate) {
    filteredRecords = filteredRecords.filter(
      (record) => record.attendance_date >= filters.startDate! && record.attendance_date <= filters.endDate!,
    )
  }

  // Add student information
  return filteredRecords.map((record) => {
    const student = students.find((s) => s.id === record.student_id)
    return {
      ...record,
      student: student
        ? {
            name: student.name,
            student_id: student.student_id,
            grade: student.grade,
          }
        : null,
    }
  })
}

// System settings
export async function getSystemSettings() {
  return [
    { key: "school_name", value: "Demo School", description: "School name" },
    { key: "academic_year", value: "2024-2025", description: "Academic year" },
  ]
}

export async function updateSystemSetting(key: string, value: string) {
  return { key, value }
}
