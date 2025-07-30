import { neon } from "@neondatabase/serverless"

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is required")
}

const sql = neon(process.env.DATABASE_URL)

// User operations
export interface CreateUserData {
  email: string
  password_hash: string
  name: string
  role: string
}

export async function createUser(userData: CreateUserData) {
  try {
    const [user] = await sql`
      INSERT INTO users (email, password_hash, name, role, status)
      VALUES (${userData.email}, ${userData.password_hash}, ${userData.name}, ${userData.role}, 'active')
      RETURNING id, email, name, role, status, created_at
    `
    return user
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Email already exists")
    }
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const [user] = await sql`
      SELECT id, email, password_hash, name, role, status
      FROM users
      WHERE email = ${email} AND status = 'active'
    `
    return user || null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const [user] = await sql`
      SELECT id, email, name, role, status
      FROM users
      WHERE id = ${id} AND status = 'active'
    `
    return user || null
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
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
  try {
    const [student] = await sql`
      INSERT INTO students (student_id, name, email, grade, status, created_by)
      VALUES (${studentData.student_id}, ${studentData.name}, ${studentData.email}, 
              ${studentData.grade}, ${studentData.status || "active"}, ${studentData.created_by})
      RETURNING id, student_id, name, email, grade, status, created_at
    `
    return student
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Student ID or email already exists")
    }
    throw error
  }
}

export async function getStudents(filters: { search?: string | null; status?: string | null } = {}) {
  try {
    let query = sql`
      SELECT id, student_id, name, email, grade, status, created_at
      FROM students
      WHERE 1=1
    `

    if (filters.status) {
      query = sql`
        SELECT id, student_id, name, email, grade, status, created_at
        FROM students
        WHERE status = ${filters.status}
      `
    }

    if (filters.search) {
      const searchTerm = `%${filters.search}%`
      query = sql`
        SELECT id, student_id, name, email, grade, status, created_at
        FROM students
        WHERE (name ILIKE ${searchTerm} OR email ILIKE ${searchTerm} OR student_id ILIKE ${searchTerm})
        ${filters.status ? sql`AND status = ${filters.status}` : sql``}
      `
    }

    const students = await query
    return students
  } catch (error) {
    console.error("Error fetching students:", error)
    return []
  }
}

export async function updateStudent(id: string, updates: Partial<CreateStudentData>) {
  try {
    const setClause = Object.entries(updates)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = $${key}`)
      .join(", ")

    if (!setClause) {
      throw new Error("No valid updates provided")
    }

    const [student] = await sql`
      UPDATE students
      SET ${sql(updates)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, student_id, name, email, grade, status, updated_at
    `

    if (!student) {
      throw new Error("Student not found")
    }

    return student
  } catch (error) {
    console.error("Error updating student:", error)
    throw error
  }
}

export async function deleteStudent(id: string) {
  try {
    await sql`
      DELETE FROM students
      WHERE id = ${id}
    `
  } catch (error) {
    console.error("Error deleting student:", error)
    throw error
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
  try {
    const [record] = await sql`
      INSERT INTO attendance_records (student_id, attendance_date, status, marked_by, notes)
      VALUES (${attendanceData.studentId}, ${attendanceData.attendanceDate}, 
              ${attendanceData.status}, ${attendanceData.markedBy}, ${attendanceData.notes || null})
      ON CONFLICT (student_id, attendance_date)
      DO UPDATE SET 
        status = EXCLUDED.status,
        marked_by = EXCLUDED.marked_by,
        notes = EXCLUDED.notes,
        updated_at = NOW()
      RETURNING id, student_id, attendance_date, status, marked_by, notes, created_at
    `
    return record
  } catch (error) {
    console.error("Error marking attendance:", error)
    throw error
  }
}

export async function getAttendanceRecords(
  filters: {
    date?: string | null
    studentId?: string | null
    startDate?: string | null
    endDate?: string | null
  } = {},
) {
  try {
    const whereConditions = []
    const params: any = {}

    if (filters.date) {
      whereConditions.push("ar.attendance_date = ${date}")
      params.date = filters.date
    }

    if (filters.studentId) {
      whereConditions.push("ar.student_id = ${studentId}")
      params.studentId = filters.studentId
    }

    if (filters.startDate && filters.endDate) {
      whereConditions.push("ar.attendance_date BETWEEN ${startDate} AND ${endDate}")
      params.startDate = filters.startDate
      params.endDate = filters.endDate
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const records = await sql`
      SELECT 
        ar.id,
        ar.student_id,
        ar.attendance_date,
        ar.status,
        ar.marked_by,
        ar.notes,
        ar.created_at,
        s.name as student_name,
        s.student_id as student_student_id,
        s.grade as student_grade
      FROM attendance_records ar
      LEFT JOIN students s ON ar.student_id = s.id
      ${whereClause ? sql.unsafe(whereClause) : sql``}
      ORDER BY ar.attendance_date DESC, s.name ASC
    `

    return records.map((record) => ({
      ...record,
      student: {
        name: record.student_name,
        student_id: record.student_student_id,
        grade: record.student_grade,
      },
    }))
  } catch (error) {
    console.error("Error fetching attendance records:", error)
    return []
  }
}

// System settings
export async function getSystemSettings() {
  try {
    const settings = await sql`
      SELECT key, value, description
      FROM system_settings
      ORDER BY key
    `
    return settings
  } catch (error) {
    console.error("Error fetching system settings:", error)
    return []
  }
}

export async function updateSystemSetting(key: string, value: string) {
  try {
    const [setting] = await sql`
      INSERT INTO system_settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      RETURNING key, value, updated_at
    `
    return setting
  } catch (error) {
    console.error("Error updating system setting:", error)
    throw error
  }
}

// Database health check
export async function checkDatabaseConnection() {
  try {
    const [result] = await sql`SELECT 1 as connected`
    return result?.connected === 1
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Attendee operations
export interface CreateAttendeeData {
  name: string
  phone: string
  email: string
}

export async function createAttendee(data: CreateAttendeeData) {
  try {
    // Check for existing attendee with same email or phone
    const existing = await sql`
      SELECT id FROM attendees 
      WHERE (email = ${data.email} OR phone = ${data.phone}) 
      AND status != 'deleted'
      LIMIT 1
    `

    if (existing.length > 0) {
      throw new Error("An attendee with this email or phone number already exists")
    }

    // Insert new attendee
    const [attendee] = await sql`
      INSERT INTO attendees (name, phone, email, status, created_at)
      VALUES (${data.name}, ${data.phone}, ${data.email}, 'active', NOW())
      RETURNING id, name, phone, email, created_at
    `

    return attendee
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      throw error
    }
    console.error("Database error creating attendee:", error)
    throw new Error("Failed to create attendee")
  }
}
