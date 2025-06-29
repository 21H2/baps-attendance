"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  ClipboardCheck, 
  FileText, 
  Plus, 
  Download, 
  Upload, 
  Settings,
  Calendar,
  BarChart3,
  Bell
} from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { useRouter } from "next/navigation"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
  bgColor: string
  darkBgColor: string
  badge?: string
  badgeColor?: string
}

export default function QuickActions() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const quickActions: QuickAction[] = [
    {
      id: "add-student",
      title: "Add Student",
      description: "Register a new student",
      icon: Plus,
      href: "/students",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900/20",
      badge: "New",
      badgeColor: "bg-blue-500"
    },
    {
      id: "take-attendance",
      title: "Take Attendance",
      description: "Mark attendance for today",
      icon: ClipboardCheck,
      href: "/attendance",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-900/20"
    },
    {
      id: "view-reports",
      title: "View Reports",
      description: "Generate attendance reports",
      icon: FileText,
      href: "/reports",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-900/20"
    },
    {
      id: "manage-students",
      title: "Manage Students",
      description: "View and edit student records",
      icon: Users,
      href: "/students",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100",
      darkBgColor: "dark:bg-orange-900/20"
    },
    {
      id: "export-data",
      title: "Export Data",
      description: "Download attendance data",
      icon: Download,
      href: "/reports",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100",
      darkBgColor: "dark:bg-teal-900/20"
    },
    {
      id: "import-data",
      title: "Import Data",
      description: "Upload student data",
      icon: Upload,
      href: "/admin",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100",
      darkBgColor: "dark:bg-pink-900/20"
    },
    {
      id: "calendar-view",
      title: "Calendar View",
      description: "View attendance calendar",
      icon: Calendar,
      href: "/attendance",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100",
      darkBgColor: "dark:bg-indigo-900/20"
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View detailed analytics",
      icon: BarChart3,
      href: "/reports",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100",
      darkBgColor: "dark:bg-cyan-900/20"
    }
  ]

  const handleActionClick = async (action: QuickAction) => {
    setLoading(action.id)
    try {
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 300))
      router.push(action.href)
    } catch (error) {
      console.error("Navigation error:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Quick Actions</span>
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {quickActions.length} Actions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <FadeIn key={action.id} delay={index * 50}>
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg dark:hover:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${action.bgColor} ${action.darkBgColor}`}
                onClick={() => handleActionClick(action)}
              >
                <CardContent className="p-6 relative">
                  {loading === action.id && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-lg z-10">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${action.bgColor} ${action.darkBgColor} flex-shrink-0`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                          {action.title}
                        </h3>
                        {action.badge && (
                          <Badge 
                            className={`h-5 px-2 text-xs ${action.badgeColor} text-white`}
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Need help? Check the admin panel for more options
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin")}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              Admin Panel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
