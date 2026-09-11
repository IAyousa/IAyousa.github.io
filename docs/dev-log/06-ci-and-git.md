# 开发日志 06 · CI 流水线与版本控制

**日期**：2026-09-11　**对应共识**：#1 GitHub Pages、#6 push 即发布、#9 仓库结构（ADR-0002）

## 做了什么

### 1. GitHub Actions 工作流（`.github/workflows/deploy.yml`）

采用 GitHub 官方 Pages 工作流模式，两个 job：

- **build**：checkout → Node 22（与本机一致）+ npm 缓存 → `npm ci`（按 lockfile 精确安装）→ `npm run build`（hexo generate）→ 打包 `public/` 为 artifact
- **deploy**：`actions/deploy-pages@v4` 从 artifact 发布

关键细节：
- `permissions` 最小化（contents:read / pages:write / id-token:write）
- `concurrency: group=pages, cancel-in-progress`：连续 push 时旧部署自动取消，不会排队堆积
- `workflow_dispatch` 手动触发入口：改配置没改文章时也能强制重发
- **CI 只跑 generate 不需要 hexo-server**（那是本地预览专用，开发日志 05）

### 2. README.md

面向"半年后的自己"：本地写作三命令、发布流程、仓库结构导览、维护操作（主题升级/身份修改/魔改入口）、建仓三步待办。

### 3. git 初始化与首次提交

- `git init -b main`（分支名即工作流监听的分支）
- 首次提交 `0b7dcb9`，25 个文件；`public/`、`node_modules/`、`db.json` 经 .gitignore 排除，无一混入
- CRLF 警告属 Windows autocrlf 正常行为：仓库内统一 LF，CI（Linux）检出无碍

## 前置条件（上线前唯一的人工设置）

**仓库 Settings → Pages → Build and deployment → Source 必须选 "GitHub Actions"**。默认值是 "Deploy from a branch"，不切换的话首次 push 后 Actions 跑完也发不出去。此步骤已列入 README 待办与向导清单。

## 验证

本地能验证的已全部验证（开发日志 05）；workflow 的真实验证发生在首次 push 后，观察 Actions 页面两个 job 变绿、站点 `https://<用户名>.github.io` 可达即闭环。
