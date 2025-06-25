"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, GraduationCap, ArrowRight, UserPlus, LogIn } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function NeonLogin() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")

  const [loginData, setLoginData] = useState({
    email: "admin@school.com", // Pre-fill for demo
    password: "admin123",
  })

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "teacher",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("three").then((THREE) => {
        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x000000, 0)

        if (mountRef.current) {
          mountRef.current.appendChild(renderer.domElement)
        }

        // Create neon grid
        const gridSize = 50
        const gridDivisions = 50
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00ffff, 0xff00ff)
        gridHelper.position.y = -10
        gridHelper.material.opacity = 0.3
        gridHelper.material.transparent = true
        scene.add(gridHelper)

        // Create neon lines
        const neonLines: any[] = []
        for (let i = 0; i < 20; i++) {
          const geometry = new THREE.BufferGeometry()
          const points = []

          for (let j = 0; j < 100; j++) {
            points.push(
              new THREE.Vector3((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100),
            )
          }

          geometry.setFromPoints(points)

          const material = new THREE.LineBasicMaterial({
            color: i % 3 === 0 ? 0x00ffff : i % 3 === 1 ? 0xff00ff : 0x00ff00,
            transparent: true,
            opacity: 0.1,
          })

          const line = new THREE.Line(geometry, material)
          scene.add(line)
          neonLines.push(line)
        }

        // Create floating neon orbs
        const orbs: any[] = []
        for (let i = 0; i < 8; i++) {
          const geometry = new THREE.SphereGeometry(0.5, 16, 16)
          const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x00ffff : 0xff00ff,
            transparent: true,
            opacity: 0.6,
            wireframe: true,
          })

          const orb = new THREE.Mesh(geometry, material)
          orb.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40)

          scene.add(orb)
          orbs.push({
            mesh: orb,
            speed: Math.random() * 0.02 + 0.01,
            radius: Math.random() * 10 + 5,
            angle: Math.random() * Math.PI * 2,
          })
        }

        camera.position.set(0, 5, 15)
        camera.lookAt(0, 0, 0)

        // Animation loop
        let animationId: number
        const animate = () => {
          animationId = requestAnimationFrame(animate)

          // Animate grid
          gridHelper.rotation.y += 0.005

          // Animate neon lines
          neonLines.forEach((line, index) => {
            line.rotation.x += 0.001 * ((index % 3) + 1)
            line.rotation.y += 0.002 * ((index % 2) + 1)
          })

          // Animate orbs
          orbs.forEach((orbData) => {
            orbData.angle += orbData.speed
            orbData.mesh.position.x = Math.cos(orbData.angle) * orbData.radius
            orbData.mesh.position.z = Math.sin(orbData.angle) * orbData.radius
            orbData.mesh.rotation.x += 0.01
            orbData.mesh.rotation.y += 0.02
          })

          renderer.render(scene, camera)
        }

        animate()

        // Handle resize
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener("resize", handleResize)

        return () => {
          window.removeEventListener("resize", handleResize)
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement)
          }
          renderer.dispose()
        }
      })
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Attempting login with:", loginData.email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (response.ok && data.success) {
        toast({
          title: "Welcome back! 🎉",
          description: "Login successful. Redirecting to dashboard...",
        })

        // Wait a bit longer before redirect to ensure session is set
        setTimeout(() => {
          window.location.href = "/"
        }, 1500)
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account Created! 🎉",
          description: "Please sign in with your credentials",
        })
        setActiveTab("signin")
      } else {
        toast({
          title: "Signup Failed",
          description: data.error || "Failed to create account",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Neon Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-pink-900/20" />
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/30 via-transparent to-purple-900/30" />
      </div>

      {/* Three.js Neon Background */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Neon Grid Overlay */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-all duration-300 neon-glow">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-2 neon-text">
              AttendanceMS
            </h1>
            <p className="text-cyan-200 text-lg">Smart Management System</p>
          </div>

          {/* Auth Card */}
          <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30 shadow-2xl neon-border animate-slide-up">
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/50 border border-cyan-500/30">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-cyan-300"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-300"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-cyan-200">Sign in to your account</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-cyan-300">
                        Email Address
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="h-12 bg-black/30 border-cyan-500/50 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/50 neon-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-cyan-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter your password"
                          className="h-12 bg-black/30 border-cyan-500/50 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/50 neon-input pr-12"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 neon-button group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="p-4 bg-black/20 rounded-lg border border-cyan-500/20 neon-border-subtle">
                    <p className="text-cyan-300 font-medium mb-2 text-sm">Demo Credentials (Pre-filled):</p>
                    <div className="space-y-1 text-xs">
                      <p className="text-cyan-200">
                        <span className="font-medium text-cyan-400">Admin:</span> admin@school.com / admin123
                      </p>
                      <p className="text-cyan-200">
                        <span className="font-medium text-cyan-400">Teacher:</span> teacher1@school.com / admin123
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-pink-200">Join our platform today</p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-pink-300">
                        Full Name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={signupData.name}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="h-12 bg-black/30 border-pink-500/50 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/50 neon-input-pink"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-pink-300">
                        Email Address
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="h-12 bg-black/30 border-pink-500/50 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/50 neon-input-pink"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-role" className="text-pink-300">
                        Role
                      </Label>
                      <Select
                        value={signupData.role}
                        onValueChange={(value) => setSignupData((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger className="h-12 bg-black/30 border-pink-500/50 text-white focus:border-pink-400 focus:ring-pink-400/50 neon-input-pink">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-pink-500/50 text-white">
                          <SelectItem value="teacher" className="text-white hover:bg-pink-500/20">
                            Teacher
                          </SelectItem>
                          <SelectItem value="admin" className="text-white hover:bg-pink-500/20">
                            Administrator
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-pink-300">
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Password"
                          className="h-12 bg-black/30 border-pink-500/50 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/50 neon-input-pink"
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password" className="text-pink-300">
                          Confirm
                        </Label>
                        <Input
                          id="signup-confirm-password"
                          type={showPassword ? "text" : "password"}
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm"
                          className="h-12 bg-black/30 border-pink-500/50 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/50 neon-input-pink"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 neon-button-pink group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-cyan-300/60 text-sm">
            <p>© 2024 AttendanceMS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
