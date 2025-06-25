import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/simple-db"

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

    // Create user in database
    const user = await createUser({
      email,
      password_hash: password, // In production, hash this properly
      name,
      role,
    })

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

    if (error.message.includes("already exists")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
