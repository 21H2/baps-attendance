"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/health")
      if (response.ok) {
        setStatus("connected")
        setError(null)
      } else {
        setStatus("error")
        setError("Database connection failed")
      }
    } catch (err) {
      setStatus("error")
      setError("Unable to connect to database")
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "checking":
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "checking":
        return <Badge variant="secondary">Checking...</Badge>
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Database Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-medium">
              {status === "checking"
                ? "Checking connection..."
                : status === "connected"
                  ? "Database Online"
                  : "Connection Failed"}
            </span>
          </div>
          {getStatusBadge()}
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}
