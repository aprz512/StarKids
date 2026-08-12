import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SessionProvider } from "@/components/auth/SessionProvider"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userRole = session.user?.role

  if (userRole === "KID") {
    redirect("/forbidden?reason=kid_to_admin")
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-admin-bg">
        <AdminSidebar />
        <main className="md:ml-64 min-h-screen p-4 pt-16 md:p-8 md:pt-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
