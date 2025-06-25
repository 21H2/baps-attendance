import type React from "react"
import { cn } from "@/lib/utils"

interface GradientCardProps {
  children: React.ReactNode
  className?: string
  gradient?: "blue" | "purple" | "green" | "orange" | "pink"
}

export function GradientCard({ children, className, gradient = "blue" }: GradientCardProps) {
  const gradients = {
    blue: "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200",
    purple: "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200",
    green: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200",
    orange: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200",
    pink: "bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200",
  }

  return (
    <div
      className={cn(
        "rounded-xl border backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        gradients[gradient],
        className,
      )}
    >
      {children}
    </div>
  )
}
