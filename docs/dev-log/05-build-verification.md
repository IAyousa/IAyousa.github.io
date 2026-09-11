# 开发日志 05 · 构建验证

**日期**：2026-09-11　**对应共识**：全部本地可验证项

## 验证方法与结果

### 1. 静态构建（`npx hexo clean && npx hexo generate`）

- 31 个文件，~2s 构建成功，无警告无报错 ✅
- 文章 URL 四篇全部为 `/posts/<8位十六进制>/`（如 `/posts/acf5da54/`）——ADR-0003 生效 ✅
- `public/atom.xml`（7.2KB）生成 ✅　`public/search.json`（3.5KB）生成 ✅
- `public/categories/` 下出现 生活/学习/技术 三个子目录 ✅

### 2. 本地服务器探活（`npx hexo server -p 4321` + curl）

| 路径 | 状态 |
|---|---|
| `/`、`/posts/acf5da54/`、`/atom.xml`、`/search.json`、`/about/`、`/categories/`、`/tags/` | 全部 200 ✅ |

页面 `<title>` = "Yao 的博客 - 记录生活、学习与技术"、`lang="zh-CN"` ✅
（Git Bash 终端里中文显示为乱码是控制台 GBK 编码问题，页面字节本身是正确的 UTF-8，浏览器无恙。）

## 验证环节发现并修复的两个问题（复盘重点）

### 问题一：`hexo server` 命令不存在

**现象**：CLI 打印帮助而非启动服务器。
**根因**：`server` 命令由独立包 `hexo-server` 提供，`hexo init` 的官方 starter 模板包含它，但本仓库是手动搭建依赖（开发日志 01），清单里漏了。
**修复**：`npm install hexo-server`（仅本地预览需要；CI 只跑 `generate`，不需要它）。
**教训**：手动复刻官方模板时，应以 hexo-starter 的 package.json 为基准逐项核对，而不是凭记忆。

### 问题二：站点身份配置全部失效（标题回退为 "Hexo"）

**现象**：首页 `<title>` 是 "Hexo" 而非 "Yao 的博客"。
**根因**：`_config.yml` 里 title/subtitle/author/language/timezone 被写成了 Jekyll 风格的 `site:` 嵌套；**Hexo 要求它们是顶层键**，未知键被静默忽略。
**修复**：取消嵌套，改为顶层键（已在 `_config.yml` 里留注释警示）。
**教训**：Hexo 对未知配置键**不报错**——"构建成功"不等于"配置生效"，验证必须看渲染产物（这正是本轮验证的价值）。

## 结论

本地构建链路全部打通，产物结构与共识一致。剩余待验证项（线上部署、Actions 流水线、Giscus 评论）依赖 GitHub 侧人工步骤，见开发日志 06/07。
