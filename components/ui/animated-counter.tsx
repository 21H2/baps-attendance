"use client"

import { useEffect, useState } from "react"

interface AnimatedCounterProps {
  value: number | string
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 1000, className }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = typeof value === "string" ? Number.parseInt(value.replace(/\D/g, "")) || 0 : value

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(Math.floor(easeOutQuart * numericValue))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [numericValue, duration])

  const formattedValue = typeof value === "string" && value.includes("%") ? `${displayValue}%` : displayValue

  return <span className={className}>{formattedValue}</span>
}
