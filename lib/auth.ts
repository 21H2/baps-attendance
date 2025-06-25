"use server"

import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher"
}

export interface Session {
  user: User
}

// Simple session storage (in production, use a proper database)
const sessions = new Map<string, Session>()

// Mock users for demo
const users = [
  { id: "1", name: "Admin User", email: "admin@school.com", password: "admin123", role: "admin" as const },
  { id: "2", name: "Teacher User", email: "teacher1@school.com", password: "admin123", role: "teacher" as const },
  { id: "3", name: "Teacher 2", email: "teacher2@school.com", password: "admin123", role: "teacher" as const },
]

export async function createSession(email: string, password: string): Promise<string | null> {
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return null
  }

  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const session: Session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }

  sessions.set(sessionId, session)

  const cookieStore = await cookies()
  cookieStore.set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return sessionId
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")

  if (!sessionId) {
    return null
  }

  const session = sessions.get(sessionId.value)
  return session || null
}

export async function destroySession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")

  if (sessionId) {
    sessions.delete(sessionId.value)
    cookieStore.delete("sessionId")
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  const sessionId = await createSession(email, password)
  return sessionId !== null
}

export async function logout() {
  await destroySession()
}
