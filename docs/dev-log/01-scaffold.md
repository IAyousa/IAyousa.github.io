# 开发日志 01 · 项目骨架

**日期**：2026-09-11　**对应共识**：#2 Hexo、#7 Butterfly、#8 npm 安装、#14/15/20 插件

## 做了什么

1. 手写 `package.json`（name: blog, private: true, scripts: build/clean/server → hexo 命令）。
2. 一条 `npm install` 装齐全部依赖（核心 + 渲染器 + 生成器 + 主题 + 三个功能插件），生成 `package-lock.json`（CI 里 `npm ci` 的可复现性来源）。

## 为什么不用 `hexo init`

`hexo init` 只能在**空目录**执行，而本目录已有 CONTEXT.md 与 docs/adr/（设计期产物，必须保留）。手动搭建等价于 hexo-starter 模板 + 我们的选择性依赖，且版本完全受控。

## 实际版本（npm 官方源解析结果）

| 包 | 版本 | 用途 |
|---|---|---|
| hexo | 8.1.2 | 核心（比设计期假设的 7.x 新一代，配置语法兼容） |
| hexo-theme-butterfly | **5.7.0** | 主题（设计期按 4.x 讨论的，配置结构以实际文件为准） |
| hexo-abbrlink | 2.2.1 | 永久链接 ID（ADR-0003） |
| hexo-generator-searchdb | 1.5.0 | 本地搜索索引（共识 #15） |
| hexo-generator-feed | 4.0.0 | RSS（共识 #20a） |
| hexo-renderer-marked / ejs / stylus | 7.0.1 / 2.0.0 / 3.0.1 | 渲染管线 |
| hexo-generator-index/archive/category/tag | — | Hexo 标准页面生成器 |

## 验证

- `npx hexo version` 输出 `hexo: 8.1.2, hexo-cli: 4.3.2, os: win32` ✅
- `npm ls` 树无 missing / invalid ✅

## 复盘要点

- **Butterfly 装到了 5.x**：日后查主题文档时注意版本线，4.x 教程里的配置项位置可能已变；本仓库主题配置以 `_config.butterfly.yml` 实际内容为准。
- 依赖用 `^` 浮动范围 + lockfile 锁死：CI 与本机构建完全一致（`npm ci`），但本地手动 `npm update` 前要跑一次完整构建验证。
