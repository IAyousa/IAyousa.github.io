---
status: accepted
---

# GitHub Pages：main 只放源码，Actions 构建发布

仓库命名为 `<用户名>.github.io`（public），`main` 分支只放源码，GitHub Actions 监听 push 后构建并通过官方 `deploy-pages` 发布构建产物。这与经典 Hexo 教程的"双分支 + `hexo deploy` 推 gh-pages"相反，为的是：网页端改 Markdown 也能触发自动发布，且仓库不含任何生成物。

**Considered Options**：双分支 + gh-pages 产物分支（网页端编辑不会触发发布，与"本地为主、网页端为辅"的目标矛盾）；Cloudflare Pages 托管（国内访问更好，留作二期，届时同一仓库零改造接入）。

**Consequences**：仓库名决定了站点挂在根路径而非子路径，文章 URL 从第一天起不带 `/blog/` 前缀，将来换托管或上自定义域名时 URL 无损——这正是本决策难逆转的部分。
