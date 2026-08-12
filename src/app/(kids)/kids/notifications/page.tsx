"use client"

import { NotificationList } from "@/components/notifications/NotificationBell"
import { Bell } from "lucide-react"
import { PageTransition } from "@/components/ui/PageTransition"

export default function KidsNotificationsPage() {
  return (
    <PageTransition className="p-5 space-y-5 md:p-8">
      <h1 className="flex items-center gap-2 font-kids text-2xl text-warm-800 pt-4"><Bell className="w-6 h-6 text-brand-500" />消息通知</h1>
      <NotificationList />
    </PageTransition>
  )
}
