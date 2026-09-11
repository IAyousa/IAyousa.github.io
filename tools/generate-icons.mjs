// favicon 资产生成器：从下方的"沙漏图形源"一次性产出全套图标。
//
// 用法：
//   npm i --no-save sharp
//   node tools/generate-icons.mjs --draft                    # 三版草稿 → docs/assets/favicon-drafts/
//   node tools/generate-icons.mjs --variant=classic|meter|minimal   # 量产全套到 source/
//
// 产物（量产模式）：
//   source/images/favicon.svg            圆形徽章矢量版（inject 注入）
//   source/images/favicon-16/32.png      圆形位图（inject 注入）
//   source/images/favicon.ico            16/32/48 三尺寸（favicon: 配置指向）
//   source/favicon.ico                   站点根路径副本（/favicon.ico 惯例）
//   source/images/apple-touch-icon.png   180×180 全出血方形（iOS 自动裁圆角）
import sharp from 'sharp'
import { mkdir, writeFile, copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// ---- 品牌色板：命运石之门辉光管（炭黑面板 + 灰白沙漏 + 琥珀辉光）----
const C = {
  bg: '#1C1C1E',    // 深炭黑面板
  glass: '#C9C9CE', // 沙漏骨架（灰白）
  amber: '#F59E0B', // 辉光沙（唯一亮色）
  bezel: '#4A4A50', // 面板边框圈
}

// ---- 沙漏图形源（512×512 画布，三版构图）----
const GLYPHS = {
  // V1 经典：骨架横梁 + 描边玻璃 + 流沙
  classic: `
    <rect x="150" y="104" width="212" height="24" rx="12" fill="${C.glass}"/>
    <rect x="150" y="384" width="212" height="24" rx="12" fill="${C.glass}"/>
    <polygon points="172,140 340,140 256,250" fill="none" stroke="${C.glass}" stroke-width="18" stroke-linejoin="round"/>
    <polygon points="256,262 172,372 340,372" fill="none" stroke="${C.glass}" stroke-width="18" stroke-linejoin="round"/>
    <polygon points="218,186 294,186 256,234" fill="${C.amber}"/>
    <rect x="250" y="228" width="12" height="70" fill="${C.amber}"/>
    <polygon points="256,292 198,368 314,368" fill="${C.amber}"/>`,
  // V2 探测仪面板：外圈表盘 + 两侧辉光点
  meter: `
    <circle cx="256" cy="256" r="222" fill="none" stroke="${C.bezel}" stroke-width="10"/>
    <circle cx="106" cy="256" r="14" fill="${C.amber}"/>
    <circle cx="406" cy="256" r="14" fill="${C.amber}"/>
    <rect x="176" y="126" width="160" height="20" rx="10" fill="${C.glass}"/>
    <rect x="176" y="366" width="160" height="20" rx="10" fill="${C.glass}"/>
    <polygon points="196,158 316,158 256,242" fill="none" stroke="${C.glass}" stroke-width="14" stroke-linejoin="round"/>
    <polygon points="256,254 196,354 316,354" fill="none" stroke="${C.glass}" stroke-width="14" stroke-linejoin="round"/>
    <polygon points="224,194 288,194 256,230" fill="${C.amber}"/>
    <rect x="250" y="224" width="12" height="56" fill="${C.amber}"/>
    <polygon points="256,272 212,350 300,350" fill="${C.amber}"/>`,
  // V3 极简：实心双三角，上灰下琥珀（沙已落尽 = 抵达命运石之门）
  minimal: `
    <polygon points="182,148 330,148 256,246" fill="${C.glass}" stroke="${C.glass}" stroke-width="26" stroke-linejoin="round"/>
    <polygon points="256,266 182,364 330,364" fill="${C.amber}" stroke="${C.amber}" stroke-width="26" stroke-linejoin="round"/>`,
}

const badgeRound = `<circle cx="256" cy="256" r="256" fill="${C.bg}"/>`
const badgeSquare = `<rect width="512" height="512" fill="${C.bg}"/>`

const svgIcon = (variant, badge) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${badge}${GLYPHS[variant]}</svg>`

const renderPng = (svg, size) =>
  sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer()

// PNG 裸数据拼装 ICO 容器（Vista+ 格式，无需额外依赖）
function buildIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = 6 + 16 * pngs.length
  const entries = pngs.map(({ size, buffer }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size, 0)
    e.writeUInt8(size, 1)
    e.writeUInt16LE(1, 4) // planes
    e.writeUInt16LE(32, 6) // bit count
    e.writeUInt32LE(buffer.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += buffer.length
    return e
  })
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buffer)])
}

async function draft() {
  const outDir = join(ROOT, 'docs/assets/favicon-drafts')
  await mkdir(outDir, { recursive: true })
  const sizes = [256, 64, 32, 16]
  for (const v of Object.keys(GLYPHS)) {
    await writeFile(join(outDir, `v-${v}.svg`), svgIcon(v, badgeRound))
    for (const s of sizes) {
      await writeFile(join(outDir, `v-${v}-${s}.png`), await renderPng(svgIcon(v, badgeRound), s))
    }
  }
  const cell = (v, s) =>
    `<td><img src="v-${v}-${s}.png" width="${s}" height="${s}" alt="${v} ${s}px"></td>`
  const row = (v) =>
    `<tr><th>v-${v}</th>${sizes.map((s) => cell(v, s)).join('')}</tr>`
  await writeFile(
    join(outDir, 'preview.html'),
    `<!doctype html><meta charset="utf-8">
<title>favicon 草稿预览</title>
<style>
  body{font-family:system-ui;margin:24px}
  section{padding:24px;border-radius:8px;margin-bottom:16px}
  .light{background:#f5f5f5;color:#222}
  .dark{background:#111;color:#eee}
  table{border-collapse:collapse}
  th,td{padding:8px 16px;text-align:center}
  p{margin:4px 0 20px}
</style>
<h1>命运石之门沙漏 favicon —— 三版草稿</h1>
<p>每版分别渲染 256 / 64 / 32 / 16 像素，浅色与深色背景各一张表。16px 一列是浏览器标签页的真实战场。</p>
<section class="light"><h2>浅色标签栏</h2><table>${Object.keys(GLYPHS).map(row).join('')}</table></section>
<section class="dark"><h2>深色标签栏</h2><table>${Object.keys(GLYPHS).map(row).join('')}</table></section>`
  )
  console.log(`drafts → ${outDir}`)
}

async function produce(variant) {
  const img = join(ROOT, 'source/images')
  await mkdir(img, { recursive: true })
  const round = svgIcon(variant, badgeRound)
  const square = svgIcon(variant, badgeSquare)
  await writeFile(join(img, 'favicon.svg'), round)
  await writeFile(join(img, 'favicon-16.png'), await renderPng(round, 16))
  await writeFile(join(img, 'favicon-32.png'), await renderPng(round, 32))
  const ico = buildIco(await Promise.all(
    [16, 32, 48].map(async (s) => ({ size: s, buffer: await renderPng(round, s) }))
  ))
  await writeFile(join(img, 'favicon.ico'), ico)
  await copyFile(join(img, 'favicon.ico'), join(ROOT, 'source/favicon.ico'))
  await writeFile(join(img, 'apple-touch-icon.png'), await renderPng(square, 180))
  console.log(`produced (${variant}) → source/images/ + source/favicon.ico`)
}

const args = process.argv.slice(2)
if (args.includes('--draft')) {
  await draft()
} else {
  const variant = args.find((a) => a.startsWith('--variant='))?.split('=')[1]
  if (!variant || !GLYPHS[variant]) {
    console.error('用法：--draft 或 --variant=classic|meter|minimal')
    process.exit(1)
  }
  await produce(variant)
}
