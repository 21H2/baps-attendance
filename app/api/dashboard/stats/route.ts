import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { getStudents, getAttendanceRecords } from "@/lib/simple-db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    // Fetch all students
    const students = await getStudents()
    const activeStudents = students.filter(student => student.status === 'active')

    // Fetch today's attendance
    const todayAttendance = await getAttendanceRecords({ date: today })
    const yesterdayAttendance = await getAttendanceRecords({ date: yesterday })
    const weekAttendance = await getAttendanceRecords({ startDate: thisWeek, endDate: today })

    // Calculate stats
    const presentToday = todayAttendance.filter(record => record.status === 'present').length
    const absentToday = todayAttendance.filter(record => record.status === 'absent').length
    const presentYesterday = yesterdayAttendance.filter(record => record.status === 'present').length
    const absentYesterday = yesterdayAttendance.filter(record => record.status === 'absent').length

    const attendanceRate = activeStudents.length > 0 ? Math.round((presentToday / activeStudents.length) * 100) : 0
    const yesterdayRate = activeStudents.length > 0 ? Math.round((presentYesterday / activeStudents.length) * 100) : 0
    const rateChange = attendanceRate - yesterdayRate

    // Weekly stats
    const weeklyPresent = weekAttendance.filter(record => record.status === 'present').length
    const weeklyAbsent = weekAttendance.filter(record => record.status === 'absent').length
    const weeklyRate = (activeStudents.length * 7) > 0 ? Math.round((weeklyPresent / (activeStudents.length * 7)) * 100) : 0

    // Recent activity (last 5 records)
    const recentActivity = weekAttendance
      .sort((a, b) => new Date(b.attendance_date).getTime() - new Date(a.attendance_date).getTime())
      .slice(0, 5)

    const stats = {
      totalStudents: activeStudents.length,
      presentToday,
      absentToday,
      attendanceRate,
      rateChange,
      weeklyPresent,
      weeklyAbsent,
      weeklyRate,
      recentActivity,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 