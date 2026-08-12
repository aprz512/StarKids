"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const adminNavItems = [
  {
    section: "总览",
    items: [
      { href: "/admin", label: "管理仪表盘", icon: "📊" },
      { href: "/admin/notifications", label: "通知消息", icon: "🔔" },
    ],
  },
  {
    section: "管理",
    items: [
      { href: "/admin/family", label: "家庭成员", icon: "👨‍👩‍👧‍👦" },
      { href: "/admin/tasks", label: "任务管理", icon: "📋" },
      { href: "/admin/points", label: "积分规则", icon: "⭐" },
      { href: "/admin/shop", label: "积分商城", icon: "🛒" },
    ],
  },
  {
    section: "数据",
    items: [
      { href: "/admin/achievements", label: "成就系统", icon: "🏆" },
      { href: "/admin/pets", label: "宠物管理", icon: "🐱" },
      { href: "/admin/analytics", label: "统计分析", icon: "📈" },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <>
      {/* 汉堡按钮 (md 以下显示) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="打开菜单"
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-soft border border-warm-200 text-warm-700 hover:bg-warm-50 transition-colors"
      >
        <span className="text-lg leading-none">☰</span>
      </button>

      {/* 移动端遮罩 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen glass border-r border-warm-200/60 flex flex-col transition-transform duration-300",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-warm-200/60">
          <Link href="/admin" onClick={close} className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-lg shadow-card">
              🌟
            </span>
            <span className="font-kids text-xl gradient-text">StarKids</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {adminNavItems.map((section) => (
            <div key={section.section}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-card"
                            : "text-warm-600 hover:bg-warm-100"
                        )}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-warm-200 p-4 space-y-2">
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-2 text-sm text-warm-400 hover:text-warm-600 transition-colors"
          >
            <span>←</span>
            <span>返回首页</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 text-sm text-warm-400 hover:text-candy-red transition-colors w-full"
          >
            <span>🚪</span>
            <span>退出登录</span>
          </button>
        </div>
      </aside>
    </>
  )
}
