import { type NextRequest, NextResponse } from "next/server"

// Simple user storage (in production, use a proper database)
const registeredUsers = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = "teacher" } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    if (registeredUsers.has(email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Create user
    const user = {
      id: Math.random().toString(36).substring(2),
      email,
      password, // In production, hash this
      name,
      role,
      status: "active",
      created_at: new Date().toISOString(),
    }

    registeredUsers.set(email, user)

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
