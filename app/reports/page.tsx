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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-muted-foreground dark:text-gray-400">Generate and download attendance reports</p>
      </div>

      <ReportsGenerator />
    </div>
  )
}
