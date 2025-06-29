import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminPanel from "@/components/admin-panel"

export default async function AdminPage() {
  const session = await getServerSession()

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-muted-foreground dark:text-gray-400">Manage users and system settings</p>
      </div>

      <AdminPanel />
    </div>
  )
}
