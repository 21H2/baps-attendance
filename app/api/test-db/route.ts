import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: "error",
        message: "DATABASE_URL environment variable is not set",
        config: {
          hasDatabaseUrl: false,
          nodeEnv: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    // Test database connection
    const sql = neon(process.env.DATABASE_URL)
    
    // Simple query to test connection
    const [result] = await sql`SELECT 1 as test`
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: result,
      config: {
        hasDatabaseUrl: true,
        nodeEnv: process.env.NODE_ENV
      }
    })

  } catch (error: any) {
    console.error("Database test error:", error)
    
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
              config: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          nodeEnv: process.env.NODE_ENV
        }
    }, { status: 500 })
  }
} 