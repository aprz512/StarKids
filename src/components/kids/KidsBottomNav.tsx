"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ClipboardList, ShoppingCart, PawPrint, Trophy, type LucideIcon } from "lucide-react"

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/kids", label: "首页", icon: Home },
  { href: "/kids/tasks", label: "任务", icon: ClipboardList },
  { href: "/kids/shop", label: "商城", icon: ShoppingCart },
  { href: "/kids/pet", label: "宠物", icon: PawPrint },
  { href: "/kids/achievements", label: "成就", icon: Trophy },
]

export function KidsBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-warm-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto md:max-w-3xl px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-12 rounded-full transition-all duration-200",
                isActive
                  ? "text-brand-600 bg-brand-50"
                  : "text-warm-400 hover:text-warm-600 hover:bg-warm-100"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "text-brand-600")} />
              <span className={cn(
                "text-xs font-semibold",
                isActive && "font-kids"
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
