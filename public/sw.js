// StarKids PWA Service Worker
// 策略:
// - _next/static/* (哈希文件名) → cache-first, 缓存永不失效
// - 导航/页面 → network-first (保证 SSR 内容新鲜, 离线时退回缓存首页)
// - /api/* 和 Server Action → 永不缓存 (数据新鲜性优先)
const STATIC_CACHE = "starkids-static-v1"
const PAGE_CACHE = "starkids-pages-v1"

self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((k) => k !== STATIC_CACHE && k !== PAGE_CACHE).map((k) => caches.delete(k))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== "GET" || url.origin !== self.location.origin) return

  // API / Server Action: 不缓存
  if (url.pathname.startsWith("/api/") || request.headers.has("next-action")) return

  // 静态资源 (哈希文件名): cache-first
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request)
        if (cached) return cached
        const res = await fetch(request)
        if (res.ok) {
          const clone = res.clone()
          const cache = await caches.open(STATIC_CACHE)
          cache.put(request, clone)
        }
        return res
      })()
    )
    return
  }

  // 导航请求: network-first, 失败回退缓存
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request)
          if (res.ok) {
            const clone = res.clone()
            const cache = await caches.open(PAGE_CACHE)
            cache.put(request, clone)
          }
          return res
        } catch {
          const cached = await caches.match(request)
          if (cached) return cached
          const home = await caches.match("/kids")
          if (home) return home
          throw new Error("offline")
        }
      })()
    )
  }
})
