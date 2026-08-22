import type { Metadata, Viewport } from "next"
import { ZCOOL_KuaiLe, Noto_Sans_SC } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/ToastProvider"
import { SiteFooter } from "@/components/SiteFooter"
import { RegisterSW } from "@/components/RegisterSW"

const zcoolKuaiLe = ZCOOL_KuaiLe({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kids",
  display: "swap",
})

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-parent",
  display: "swap",
})

export const metadata: Metadata = {
  title: "StarKids - 小朋友奖励乐园",
  description: "用游戏化的方式，让好习惯自然生长",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "StarKids",
    statusBarStyle: "default",
  },
  themeColor: "#3F51B5",
}

export const viewport: Viewport = {
  themeColor: "#3F51B5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${zcoolKuaiLe.variable} ${notoSansSC.variable}`}>
      <body className="font-parent text-warm-700 bg-warm-50 antialiased">
        <ToastProvider>
          {children}
          <SiteFooter />
        </ToastProvider>
        <RegisterSW />
      </body>
    </html>
  )
}
