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
    blue: "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200",
    purple: "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200",
    green: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200",
    orange: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200",
    pink: "bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200",
    none: "bg-white border-gray-200",
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
