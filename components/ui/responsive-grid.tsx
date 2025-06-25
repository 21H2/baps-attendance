import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: "sm" | "md" | "lg" | "xl"
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = "md",
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-4 sm:gap-6 lg:gap-8",
    lg: "gap-6 sm:gap-8 lg:gap-12",
    xl: "gap-8 sm:gap-12 lg:gap-16",
  }

  const getColsClass = () => {
    const classes = ["grid"]

    if (cols.default) classes.push(`grid-cols-${cols.default}`)
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)

    return classes.join(" ")
  }

  return <div className={cn(getColsClass(), gapClasses[gap], className)}>{children}</div>
}
