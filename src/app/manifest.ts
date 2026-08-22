import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StarKids 小朋友乐园",
    short_name: "StarKids",
    description: "用游戏化的方式，让好习惯自然生长",
    start_url: "/kids",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F9FC",
    theme_color: "#3F51B5",
    lang: "zh-CN",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
