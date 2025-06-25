import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { updateStudent, deleteStudent } from "@/lib/simple-db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()
    const student = await updateStudent(params.id, updates)

    return NextResponse.json(student)
  } catch (error: any) {
    console.error("Error updating student:", error)

    if (error.code === "23505") {
      return NextResponse.json({ error: "Student ID or email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteStudent(params.id)
    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
