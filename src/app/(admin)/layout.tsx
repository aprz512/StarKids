import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
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
      <div className="min-h-screen app-bg">
        <AdminSidebar />
        <main className="md:ml-64 min-h-screen">
          <AdminHeader />
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </SessionProvider>
  )
}
