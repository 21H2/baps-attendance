import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import AuthForm from "@/components/auth-form"

export default async function LoginPage() {
  const session = await getServerSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account or create a new one</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
