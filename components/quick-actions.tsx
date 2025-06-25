"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ClipboardCheck, FileText, Calendar } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    {
      title: "Mark Attendance",
      description: "Record today's attendance",
      icon: ClipboardCheck,
      href: "/attendance",
      color: "text-green-600",
    },
    {
      title: "Add Student",
      description: "Register new student",
      icon: Users,
      href: "/students",
      color: "text-blue-600",
    },
    {
      title: "Generate Report",
      description: "Create attendance reports",
      icon: FileText,
      href: "/reports",
      color: "text-purple-600",
    },
    {
      title: "View Calendar",
      description: "Check attendance history",
      icon: Calendar,
      href: "/attendance",
      color: "text-orange-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button variant="ghost" className="w-full justify-start h-auto p-4">
                <action.icon className={`w-5 h-5 mr-3 ${action.color}`} />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
