import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import NeonLogin from "@/components/neon-login"

export default async function LoginPage() {
  const session = await getServerSession()

  if (session) {
    redirect("/")
  }

  return <NeonLogin />
}
