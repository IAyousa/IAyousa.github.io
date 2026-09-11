# 开发日志 09 · Favicon 体系与品牌色：命运石之门沙漏

**日期**：2026-09-11　**对应共识**：图标设计访谈三轮定稿（母题=命运石之门致敬 / 交付=标准全套 / 配色=黑白灰+琥珀亮色）

## 设计共识（访谈定稿，此处即规格）

- **母题**：原创几何沙漏，致敬《命运石之门》的时间意象；**不描官方 logo**，致敬式原创。
- **构图**：三版草稿（classic 经典流沙 / meter 探测仪面板 / minimal 极简双三角）多尺寸预览比稿，**V2「探测仪面板」胜出**——外圈表盘 + 两侧辉光点，梗密度与小尺寸可读性兼得。
- **配色**：`#1C1C1E` 深炭黑面板 + `#C9C9CE` 灰白沙漏骨架 + `#F59E0B` 辉光琥珀（唯一亮色，源自世界线变动率探测仪的辉光数字管）。扁平无渐变，16px 可读性优先。
- **彩蛋**：站点只接纯图形版；带 **1.048596** 辉光数字管的封面版单独存 `docs/assets/divergence-meter-cover.svg`，不接入站点。数字进网页内容的想法记入 `docs/TODO.md`。

## 落地结构

**单一图形源**：`tools/generate-icons.mjs` 内嵌三版 SVG 图形源与色板，一条命令产出全套（草稿模式 `--draft` 出比稿预览，量产模式 `--variant=meter`）：

| 产物 | 用途 |
|---|---|
| `source/images/favicon.svg` | 矢量版，现代浏览器优先采用（inject 注入） |
| `source/images/favicon-16/32.png` | 位图兜底（inject 注入） |
| `source/images/favicon.ico` | 16/32/48 三合一，`favicon:` 配置指向它 |
| `source/favicon.ico` | 站点根路径副本——照顾 `/favicon.ico` 老惯例，ADR-0004 的登记例外 |
| `source/images/apple-touch-icon.png` | 180×180 全出血方形，iOS 自动裁圆角 |

**接入方式**：`favicon: /images/favicon.ico`（主题 `favicon_tag` 只产出一条 `shortcut icon`），其余四条多尺寸 `<link>` 走 `inject.head`——不动主题模板，升级无冲突。

**品牌色**：`theme_color` 块解锁，全站高亮换成琥珀系（`main #D97706`，暗色 meta `#1C1C1E` 与图标面板同源）。

## 验证结果（`npx hexo clean && npx hexo generate`）

- 构建成功、退出码 0 ✅　`public/` 下图标文件齐全（favicon.svg / 16 / 32 / ico / apple-touch-icon.png + 根路径 favicon.ico）✅
- `public/index.html` head 内 5 条图标 `<link>`（shortcut icon + svg + png×2 + apple-touch-icon）✅
- `meta name="theme-color"` 输出 `#ffffff` ✅——主题按 `display_mode` 输出**静态**值（head.pug L18-20）：本站 `display_mode: light` 取浅色值；暗色模式用 `meta_theme_color_dark`（已设 `#1C1C1E`），不会随用户切换实时变色，这是主题行为

## 复盘重点

### 坑一：`theme_color` 解锁后的"隐性蓝色残留"

**根因**：`var.styl` 里每个色键的逻辑都是"配置了用配置，没配置回退主题默认"——默认全是蓝色系（`#49B1F5` / `$strong-cyan`）。只设 `main` 的话，分页器、引用块、目录、滚动条仍是蓝的。
**修复**：用到的键全部显式写值（blockquote 背景色不设，自动从 padding 色派生 10% 透明度）。
**教训**：这类"部分覆盖"配置，解锁后要对着变量表的回退值逐键核对，而不是只改主色了事。

### 坑二：`scripts/` 目录是 Hexo 的插件加载区，不能放普通工具脚本

**现象**：把 `generate-icons.mjs` 放进 `scripts/` 后，`hexo generate` 报 `ERROR Script load failed`——Hexo 会把该目录下**每个文件**当插件用 `require()` 加载执行。构建虽不中断，但每次刷错误日志。
**修复**：工具脚本移到 `tools/generate-icons.mjs`（Hexo 不碰这个目录），全仓引用同步更新。
**连带发现**：`scripts/github-setup-wizard.sh`（开发日志 08 的产物）一直报同样的错——属前一轮遗留问题，与本轮无关，待后续处理（挪目录或加 Hexo 忽略约定）。
**教训**：Hexo 约定目录是有语义的：`scripts/` = 插件、`source/` = 站点资产；纯构建工具放 `tools/`。

### 坑三（规避）：栅格化依赖污染依赖清单

**处置**：sharp 以 `npm i --no-save` 安装，只进 `node_modules`，`package.json` 保持纯净；重生成命令已写进 tutorial-customization 第 1 节。
**教训**：一次性构建工具链用 `--no-save` + 文档化命令，比塞进 devDependencies 更符合本仓库"轻依赖"的取向。

## 遗留

- 网页内容彩蛋（辉光数字进页面）→ `docs/TODO.md`
- 旧的头像缩放版 `favicon.png`（64×64 约定）已删除，教程文档对应段落已更新
