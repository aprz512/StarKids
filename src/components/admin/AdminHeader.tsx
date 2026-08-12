"use client"

import { usePathname } from "next/navigation"
import { NotificationBell } from "@/components/notifications/NotificationBell"

const TITLES: Record<string, string> = {
  "/admin": "管理仪表盘",
  "/admin/notifications": "通知消息",
  "/admin/family": "家庭成员",
  "/admin/tasks": "任务管理",
  "/admin/points": "积分规则",
  "/admin/shop": "积分商城",
  "/admin/achievements": "成就系统",
  "/admin/pets": "宠物管理",
  "/admin/analytics": "统计分析",
}

export function AdminHeader() {
  const pathname = usePathname()
  const title = TITLES[pathname] || "StarKids"

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur border-b border-warm-200 flex items-center justify-between pl-14 pr-3 md:pl-6 md:pr-4">
      <h1 className="text-base font-semibold text-warm-800 truncate">{title}</h1>
      <NotificationBell href="/admin/notifications" />
    </header>
  )
}
