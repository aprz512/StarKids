// 生成 PWA 图标: 品牌色圆角方块 + 白色气球 🎈 (Noto Color Emoji)
// 用法: node scripts/gen-icons.mjs
import sharp from "sharp"
import { mkdirSync } from "node:fs"

const FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"

function svg(size, padding) {
  const r = size * 0.22 // 圆角
  const emojiSize = size - padding * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5C6BC0"/>
      <stop offset="1" stop-color="#3F51B5"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <text x="50%" y="50%" font-size="${emojiSize}" text-anchor="middle" dominant-baseline="central">🎈</text>
</svg>`
}

mkdirSync("public/icons", { recursive: true })

// 标准图标
for (const size of [192, 512]) {
  await sharp(Buffer.from(svg(size, size * 0.18)))
    .png()
    .toFile(`public/icons/icon-${size}.png`)
  console.log(`icon-${size}.png done`)
}

// maskable: 内容收缩到安全区 (80%), 背景铺满
const m = 512
await sharp(Buffer.from(svg(m, m * 0.34)))
  .png()
  .toFile("public/icons/icon-maskable-512.png")
console.log("icon-maskable-512.png done")

// apple-touch-icon 180
await sharp(Buffer.from(svg(180, 180 * 0.18)))
  .png()
  .toFile("public/icons/apple-touch-icon.png")
console.log("apple-touch-icon.png done")
