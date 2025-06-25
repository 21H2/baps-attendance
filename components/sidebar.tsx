"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, ClipboardCheck, FileText, Settings, GraduationCap } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-blue-600" },
  { name: "Students", href: "/students", icon: Users, color: "text-green-600" },
  { name: "Attendance", href: "/attendance", icon: ClipboardCheck, color: "text-purple-600" },
  { name: "Reports", href: "/reports", icon: FileText, color: "text-orange-600" },
  { name: "Admin", href: "/admin", icon: Settings, color: "text-red-600" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white/80 backdrop-blur-xl w-64 min-h-screen shadow-2xl border-r border-gray-200/50">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AttendanceMS
            </h1>
            <p className="text-xs text-gray-500">Smart Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4 sm:px-6 space-y-2">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-105",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 animate-pulse" />
              )}
              <item.icon
                className={cn("w-5 h-5 mr-3 transition-colors duration-200", isActive ? "text-white" : item.color)}
              />
              <span className="relative z-10">{item.name}</span>
              {isActive && <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">v1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Version 1.0</p>
              <p className="text-xs text-gray-500">Latest Update</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
