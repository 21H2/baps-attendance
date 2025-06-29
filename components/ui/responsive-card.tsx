import type React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
  spacing?: "sm" | "md" | "lg"
  gradient?: "blue" | "purple" | "green" | "orange" | "pink" | "none"
}

export function ResponsiveCard({
  children,
  className,
  padding = "md",
  spacing = "md",
  gradient = "none",
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-4 sm:p-6 lg:p-8",
    lg: "p-6 sm:p-8 lg:p-12",
  }

  const spacingClasses = {
    sm: "space-y-4",
    md: "space-y-4 sm:space-y-6 lg:space-y-8",
    lg: "space-y-6 sm:space-y-8 lg:space-y-12",
  }

  const gradientClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700 dark:text-white",
    purple: "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 dark:from-purple-900/20 dark:to-violet-900/20 dark:border-purple-700 dark:text-white",
    green: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700 dark:text-white",
    orange: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 dark:from-orange-900/20 dark:to-amber-900/20 dark:border-orange-700 dark:text-white",
    pink: "bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200 dark:from-pink-900/20 dark:to-rose-900/20 dark:border-pink-700 dark:text-white",
    none: "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
  }

  return (
    <Card
      className={cn(
        "rounded-xl border backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        gradientClasses[gradient],
        className,
      )}
    >
      <div className={cn(paddingClasses[padding], spacingClasses[spacing])}>{children}</div>
    </Card>
  )
}
