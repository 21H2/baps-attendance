"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut, Search, Sun, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function Header() {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Search - Hidden on mobile */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search anything..."
                className="pl-10 w-64 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors h-10"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="relative overflow-hidden group h-10 w-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-transform group-hover:rotate-180" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 transition-transform group-hover:-rotate-12" />
              )}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative group h-10 w-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-md" />
              <Bell className="w-5 h-5 text-gray-600 group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
              </div>
            </Button>

            {/* User Section */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <Avatar className="ring-2 ring-blue-100 hover:ring-blue-200 transition-all h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors group h-10 w-10"
              >
                <LogOut className="w-5 h-5 group-hover:animate-pulse" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
