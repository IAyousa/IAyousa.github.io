---
title: 你好，世界
categories:
  - 技术
tags:
  - 建站
  - Hexo
abbrlink: acf5da54
date: 2026-09-11 13:00:00
---
博客的第一篇文章。你正在看的这个站点由 [Hexo](https://hexo.io) 生成、[Butterfly](https://butterfly.js.org) 提供主题，托管在 GitHub Pages 上——源码 push 之后自动构建发布。

## 这个博客写什么

- **生活**：日常记录、见闻、想法
- **学习**：读书笔记、课程整理、学习心得
- **技术**：踩坑记录、知识总结、项目复盘

## 怎么写一篇新文章

在仓库根目录执行：

```bash
npm run server          # 本地预览 http://localhost:4000
npx hexo new "文章标题"  # 在 source/_posts/ 生成 Markdown 文件
```

文章开头的 front-matter 里写好 `categories`（三选一）和 `tags`（随意多个），正文用 Markdown 写，本地预览满意后 `git push`，一两分钟后线上就能看到。

## 关于本站

- 评论基于 GitHub Discussions（Giscus），用 GitHub 账号登录即可留言
- 文章采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议授权
- 站点搭建过程记录在仓库的 `docs/dev-log/` 目录，供日后复盘
