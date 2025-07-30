import { NextRequest, NextResponse } from "next/server"
import { createAttendee } from "@/lib/neon-db"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"

// Input validation schema
const AttendeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email format").max(100, "Email too long"),
})

// Rate limiting (simple in-memory for demo - use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5 // 5 requests per 15 minutes

  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set")
      return NextResponse.json(
        { error: "Database not configured. Please contact administrator." },
        { status: 500 }
      )
    }

    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validationResult = AttendeeSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const attendeeData = validationResult.data

    try {
      // Test database connection first
      const sql = neon(process.env.DATABASE_URL!)
      
      // Check if attendees table exists
      try {
        await sql`SELECT 1 FROM attendees LIMIT 1`
      } catch (tableError: any) {
        console.error("Table check error:", tableError)
        return NextResponse.json(
          { error: "Database table not found. Please run the setup script." },
          { status: 500 }
        )
      }

      // Create attendee using the utility function
      const attendee = await createAttendee(attendeeData)

      // Log the submission (for audit purposes)
      console.log(`New attendee registered: ${attendeeData.name} (${attendeeData.email})`)

      return NextResponse.json({
        success: true,
        message: "Attendee registered successfully",
        data: {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          created_at: attendee.created_at
        }
      }, { status: 201 })
    } catch (error: any) {
      console.error("Database operation error:", error)
      
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
      
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return NextResponse.json(
          { error: "Database table not found. Please run the setup script." },
          { status: 500 }
        )
      }
      
      throw error // Re-throw to be caught by outer catch block
    }

  } catch (error: any) {
    console.error("Error in attendee submission:", error)
    
    // Log more details for debugging
    if (error.message) {
      console.error("Error message:", error.message)
    }
    if (error.stack) {
      console.error("Error stack:", error.stack)
    }
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
} 