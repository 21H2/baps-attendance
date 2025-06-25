import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { markAttendance, getAttendanceRecords } from "@/lib/neon-db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const studentId = searchParams.get("studentId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const records = await getAttendanceRecords({
      date,
      studentId,
      startDate,
      endDate,
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, date, status, notes } = await request.json()

    const record = await markAttendance({
      studentId,
      attendanceDate: date,
      status,
      markedBy: session.user.id,
      notes,
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error("Error marking attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
