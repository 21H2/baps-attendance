import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import ReportsGenerator from "@/components/reports-generator"

export default async function ReportsPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and download attendance reports</p>
      </div>

      <ReportsGenerator />
    </div>
  )
}
