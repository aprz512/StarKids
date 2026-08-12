"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/kids", label: "首页", icon: "🏠" },
  { href: "/kids/tasks", label: "任务", icon: "📋" },
  { href: "/kids/shop", label: "商城", icon: "🛒" },
  { href: "/kids/pet", label: "宠物", icon: "🐱" },
  { href: "/kids/achievements", label: "成就", icon: "🏆" },
]

export function KidsBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-warm-200/60 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto md:max-w-3xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                isActive
                  ? "text-brand-500"
                  : "text-warm-400 hover:text-warm-600"
              )}
            >
              <span className={cn("text-2xl", isActive && "drop-shadow-[0_2px_6px_rgba(99,102,241,0.4)]")}>{item.icon}</span>
              <span className={cn(
                "text-xs font-semibold",
                isActive && "font-kids gradient-text"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
