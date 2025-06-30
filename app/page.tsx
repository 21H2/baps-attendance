"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AttendeeForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const tickRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowSuccess(false)

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your details have been submitted successfully.",
        })
        setFormData({ name: "", email: "", phone: "" })
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2500)
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-xl">
            <Image
              src="/Baps_logo.svg"
              alt="BAPS Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            BAPS Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please fill in your details below
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              Attendee Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                  className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-200 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                  className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">
                  Email ID
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                  className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Details"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Animated Success Tickmark */}
        {showSuccess && (
          <div
            ref={tickRef}
            className="flex justify-center items-center mb-6 animate-fade-in"
            style={{ minHeight: 80 }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="#22c55e"
                strokeWidth="4"
                fill="#dcfce7"
                className="animate-scale-in"
              />
              <path
                d="M20 34L29 43L44 26"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-tick"
              />
            </svg>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 BAPS Attendance System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

// Add animation styles
<style jsx global>{`
@keyframes fade-in {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.5s cubic-bezier(0.4,0,0.2,1);
}
@keyframes scale-in {
  0% { transform: scale(0.5); }
  100% { transform: scale(1); }
}
.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.4,0,0.2,1);
}
@keyframes draw-tick {
  0% { stroke-dasharray: 0 60; }
  100% { stroke-dasharray: 60 0; }
}
.animate-draw-tick {
  stroke-dasharray: 60 0;
  animation: draw-tick 0.6s 0.2s cubic-bezier(0.4,0,0.2,1) forwards;
}
`}</style>
