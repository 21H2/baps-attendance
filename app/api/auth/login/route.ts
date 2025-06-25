import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const sessionId = await createSession(email, password)

    if (!sessionId) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login successful",
      success: true,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
