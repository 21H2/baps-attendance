"use server"

import { cookies } from "next/headers"
import { getUserByEmail } from "@/lib/simple-db"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher"
}

export interface Session {
  user: User
  expires: number
}

export async function createSession(email: string, password: string): Promise<string | null> {
  try {
    const user = await getUserByEmail(email)

    if (!user || user.password_hash !== password) {
      console.log("Invalid credentials for:", email)
      return null
    }

    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

    const session: Session = {
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role as "admin" | "teacher",
      },
      expires,
    }

    // Store session in cookie directly (more reliable than in-memory)
    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    console.log("Session created for:", email)
    return sessionId
  } catch (error) {
    console.error("Error creating session:", error)
    return null
  }
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie?.value) {
      return null
    }

    const session = JSON.parse(sessionCookie.value) as Session

    // Check if session is expired
    if (Date.now() > session.expires) {
      await destroySession()
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function destroySession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session")
  } catch (error) {
    console.error("Error destroying session:", error)
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  const sessionId = await createSession(email, password)
  return sessionId !== null
}

export async function logout() {
  await destroySession()
}
