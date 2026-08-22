"use client"

import { useEffect } from "react"

// 注册 PWA Service Worker (仅生产环境; dev 下 SW 会干扰 Fast Refresh)
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return
    navigator.serviceWorker.register("/sw.js").catch((e) => {
      console.error("SW registration failed:", e)
    })
  }, [])
  return null
}
