import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import DashboardStats from "@/components/dashboard-stats"
import RecentActivity from "@/components/recent-activity"
import QuickActions from "@/components/quick-actions"
import { ResponsiveGrid } from "@/components/ui/responsive-grid"
import { FadeIn } from "@/components/ui/fade-in"

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Header */}
      <FadeIn>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Welcome back, {session.user.name}
          </p>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={100}>
        <DashboardStats />
      </FadeIn>

      {/* Content Grid */}
      <FadeIn delay={200}>
        <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="lg">
          <RecentActivity />
          <QuickActions />
        </ResponsiveGrid>
      </FadeIn>
    </div>
  )
} 