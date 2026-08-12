"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type SkeletonProps = {
  className?: string
}

/**
 * 延迟 200ms 显示:
 * 数据在 200ms 内到达时不渲染任何占位(避免切换页面时骨架/容器闪烁),
 * 超过 200ms 才显示骨架(慢网络下的合理体验)
 */
function useSkeletonDelay(ms = 200) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), ms)
    return () => clearTimeout(t)
  }, [ms])

  return show
}

export function Skeleton({ className }: SkeletonProps) {
  const show = useSkeletonDelay()
  if (!show) return null
  return (
    <div className={cn("bg-warm-200 animate-pulse rounded-lg", className)} />
  )
}

export function CardSkeleton() {
  const show = useSkeletonDelay()
  if (!show) return null
  return (
    <div className="bg-white rounded-xl shadow-card p-5 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  )
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  const show = useSkeletonDelay()
  if (!show) return null
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-card p-4 flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
  const show = useSkeletonDelay()
  if (!show) return null
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-card p-4 space-y-3">
          <Skeleton className="w-12 h-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-3 w-1/2 mx-auto" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}

export function ProfileSkeleton() {
  const show = useSkeletonDelay()
  if (!show) return null
  return (
    <div className="bg-white rounded-xl shadow-card p-5 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
    </div>
  )
}
