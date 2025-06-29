import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import MinimalLogin from "@/components/minimal-login"

export default async function LoginPage() {
  const session = await getServerSession()

  if (session) {
    redirect("/")
  }

  return <MinimalLogin />
}
