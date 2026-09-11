# Yao 的博客

中文个人博客：记录生活、学习、技术三类内容。

- 生成器：[Hexo](https://hexo.io) 8.x　主题：[Butterfly](https://butterfly.js.org) 5.7（npm 依赖安装）
- 托管：GitHub Pages，push 到 `main` 后由 Actions 自动构建发布
- 文章 URL：`/posts/<abbrlink>/`，标题改了 URL 也不变

## 本地写作

```bash
npm install        # 首次
npx hexo new "文章标题"   # 在 source/_posts/ 生成草稿文件
npm run server     # 预览 http://localhost:4000
```

写完 front-matter 里的 `categories`（生活/学习/技术）和 `tags`，配图放 `source/images/`、正文用 `/images/文件名` 引用。满意后：

```bash
git add -A && git commit -m "新文章：xxx" && git push
```

一两分钟后线上更新。

## 仓库结构

```
source/            文章与页面（唯一的"内容"目录）
  _posts/          文章（front-matter 里的 abbrlink 是永久 ID，勿手改）
  images/          配图集中目录
_config.yml        Hexo 站点配置
_config.butterfly.yml  主题覆盖配置（导航/搜索/统计/版权/评论）
.github/workflows/deploy.yml  CI：push → 构建 → 发布
docs/adr/          架构决策记录（为什么这么搭）
docs/dev-log/      开发日志（怎么搭起来的，供复盘）
CONTEXT.md         项目词汇表
```

`public/`、`node_modules/`、`db.json` 是构建产物与依赖，不入库（.gitignore 已排除）。

## 日常维护

- 主题升级：`npm update hexo-theme-butterfly` 后本地跑一次 `npm run server` 全站过目再 push
- 站名/头像/关于页：改 `_config.yml`、`_config.butterfly.yml`、`source/about/index.md`，随时可改不影响文章
- 想魔改主题模板时：先读 `docs/adr/0001` 与 `CONTEXT.md` 里"vendor 主题"词条——那是预留的将来动作

## 待办（建仓时）

1. `_config.yml` 的 `url` 把 `yourusername` 替换为真实 GitHub 用户名
2. 仓库 Settings → Pages → Source 选 "GitHub Actions"
3. 开 Discussions、装 [giscus app](https://github.com/apps/giscus)，回填 `_config.butterfly.yml` 的 `giscus:` 三项并把 `comments.use` 改为 `giscus`
