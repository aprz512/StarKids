"use client"

import { NotificationList } from "@/components/notifications/NotificationBell"
import { PageTransition } from "@/components/ui/PageTransition"

export default function KidsNotificationsPage() {
  return (
    <PageTransition className="p-5 space-y-5 md:p-8">
      <h1 className="font-kids text-2xl text-warm-800 pt-4">🔔 消息通知</h1>
      <NotificationList />
    </PageTransition>
  )
}
