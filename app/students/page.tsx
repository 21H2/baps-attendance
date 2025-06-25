import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import StudentsTable from "@/components/students-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AddStudentDialog from "@/components/add-student-dialog"

export default async function StudentsPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records</p>
        </div>
        <AddStudentDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </AddStudentDialog>
      </div>

      <StudentsTable />
    </div>
  )
}
