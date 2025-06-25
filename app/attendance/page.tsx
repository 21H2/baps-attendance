import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import AttendanceTracker from "@/components/attendance-tracker"

export default async function AttendancePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Track student attendance</p>
      </div>

      <AttendanceTracker />
    </div>
  )
}
