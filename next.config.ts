import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  // 关闭 dev 模式顶部进度条/右下角指示器 (生产环境不受影响)
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["nodemailer"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
}

export default nextConfig
