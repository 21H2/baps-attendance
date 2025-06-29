"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Image from "next/image"

export default function ThreeLogin() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

        // Create floating geometric shapes
        const geometries = [
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.SphereGeometry(0.7, 32, 32),
          new THREE.ConeGeometry(0.7, 1.5, 8),
          new THREE.OctahedronGeometry(0.8),
          new THREE.TetrahedronGeometry(0.9),
        ]

        const materials = [
          new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.6,
            wireframe: true,
          }),
          new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.4,
            wireframe: true,
          }),
          new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.5,
            wireframe: true,
          }),
          new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.3,
            wireframe: true,
          }),
        ]

        const meshes: any[] = []

        // Create multiple floating objects
        for (let i = 0; i < 15; i++) {
          const geometry = geometries[Math.floor(Math.random() * geometries.length)]
          const material = materials[Math.floor(Math.random() * materials.length)]
          const mesh = new THREE.Mesh(geometry, material)

          // Random positioning
          mesh.position.x = (Math.random() - 0.5) * 20
          mesh.position.y = (Math.random() - 0.5) * 20
          mesh.position.z = (Math.random() - 0.5) * 20

          // Random rotation
          mesh.rotation.x = Math.random() * Math.PI
          mesh.rotation.y = Math.random() * Math.PI
          mesh.rotation.z = Math.random() * Math.PI

          // Random scale
          const scale = Math.random() * 0.5 + 0.5
          mesh.scale.setScalar(scale)

          scene.add(mesh)
          meshes.push({
            mesh,
            rotationSpeed: {
              x: (Math.random() - 0.5) * 0.02,
              y: (Math.random() - 0.5) * 0.02,
              z: (Math.random() - 0.5) * 0.02,
            },
            floatSpeed: Math.random() * 0.01 + 0.005,
            floatRange: Math.random() * 2 + 1,
            initialY: mesh.position.y,
          })
        }

        // Particle system
        const particleGeometry = new THREE.BufferGeometry()
        const particleCount = 100
        const positions = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 50
        }

        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

        const particleMaterial = new THREE.PointsMaterial({
          color: 0x3b82f6,
          size: 0.1,
          transparent: true,
          opacity: 0.6,
        })

        const particles = new THREE.Points(particleGeometry, particleMaterial)
        scene.add(particles)

        camera.position.z = 10

        // Animation loop
        let animationId: number
        const animate = () => {
          animationId = requestAnimationFrame(animate)

          // Animate meshes
          meshes.forEach((item, index) => {
            const { mesh, rotationSpeed, floatSpeed, floatRange, initialY } = item

            // Rotation
            mesh.rotation.x += rotationSpeed.x
            mesh.rotation.y += rotationSpeed.y
            mesh.rotation.z += rotationSpeed.z

            // Floating motion
            mesh.position.y = initialY + Math.sin(Date.now() * floatSpeed + index) * floatRange
          })

          // Animate particles
          particles.rotation.y += 0.001
          particles.rotation.x += 0.0005

          // Camera gentle movement
          camera.position.x = Math.sin(Date.now() * 0.0005) * 2
          camera.position.y = Math.cos(Date.now() * 0.0003) * 1

          renderer.render(scene, camera)
        }

        animate()
        sceneRef.current = { scene, camera, renderer, animationId }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Welcome back! 🎉",
          description: "Login successful. Redirecting to dashboard...",
        })
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1000)
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Three.js Background */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <Image
                src="/Baps_logo.svg"
                alt="BAPS Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">BAPS Attendance</h1>
            <p className="text-blue-200">Smart Management System</p>
          </div>

          {/* Login Card */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl animate-slide-up">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-blue-200">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-blue-400 transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-blue-400 transition-all duration-300 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
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
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white/90 font-medium mb-2 text-sm">Demo Credentials:</p>
                <div className="space-y-1 text-xs">
                  <p className="text-blue-200">
                    <span className="font-medium">Admin:</span> admin@school.com / admin123
                  </p>
                  <p className="text-blue-200">
                    <span className="font-medium">Teacher:</span> teacher1@school.com / admin123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-white/60 text-sm">
            <p>© 2024 BAPS Attendance. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
