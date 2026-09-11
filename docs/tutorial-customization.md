# Butterfly 主题配置教程 —— 从读懂到动手改

> 写给本博客的主人（以及任何想自己动手改 Butterfly 的人）。本仓库里所有"为什么"都记录在 `docs/adr/` 和 `docs/dev-log/`，这篇只讲**怎么改**：配置文件怎么组织、每类效果改哪里、改完怎么安全地上线。

---

## 0. 三分钟理解配置体系

Hexo + Butterfly 一共两个配置文件，职责严格分开：

| 文件 | 管什么 | 例子 |
|---|---|---|
| `_config.yml`（站点配置） | **站点级**的事：站名、作者、URL、永久链接、插件开关 | 站名、RSS、搜索索引 |
| `_config.butterfly.yml`（主题覆盖配置） | **长得怎么样**：导航、侧栏、配色、特效、评论 | 头像、菜单、暗色模式 |

**为什么叫"覆盖配置"**：Butterfly 的完整默认配置在 `node_modules/hexo-theme-butterfly/_config.yml`（1132 行）。我们的 `_config.butterfly.yml` 是它的全量拷贝，改的是自己这份拷贝——主题升级时你的定制不丢（这就是决策 #8"npm 装主题"能成立的原因）。

**修改的黄金回路**（所有改动都走这四步）：

```bash
npm run server    # 1. 起本地预览 http://localhost:4000
# 2. 改配置文件，保存 —— hexo server 会自动重建，刷新浏览器即可看效果
# 3. 满意就 Ctrl-C 停掉预览
git add -A && git commit -m "改了什么" && git push    # 4. 一分钟后线上生效
```

⚠️ 偶尔 push 会报 `Connection was reset`——网络抖动，重试一两次就好（上线当天遇到过，第三次成功）。

两个配置文件里几乎每个设置项上都有官方注释，**先读注释再改**。改坏了也别慌：`git checkout -- 文件名` 一键还原。

---

## 1. 站点身份（`_config.yml` 顶部 + 主题配置的图像区）

这次上线改了什么（照着学）：

| 想改什么 | 文件 | 位置 |
|---|---|---|
| 站名/副标题/作者/站点描述（SEO） | `_config.yml` | 顶部 `title / subtitle / description / author`——**顶层键，千万别嵌套** |
| 头像 | `_config.butterfly.yml` | `avatar: img:` → `/images/avatar.jpg` |
| 浏览器标签页图标（favicon） | 同上 | `favicon: /images/favicon.ico` + `inject.head` 多尺寸标签（见下方实操） |
| 侧栏作者卡简介 | 同上 | `aside.card_author.description` |
| 侧栏 GitHub 按钮 | 同上 | `aside.card_author.button`（enable/text/link） |
| 导航栏社交图标 | 同上 | `social:` 一行一个：`图标: 链接 \|\| 名称 \|\| 颜色` |
| 公告卡 | 同上 | `aside.card_announcement.content` |
| 页脚建站年份 | 同上 | `footer.owner.since` |

**头像与 favicon 实操**：把图片放进 `source/images/`（本仓库配图集中地的既定约定，ADR-0004），文章/配置里用 `/images/文件名` 引用（站点在根路径，绝对路径本地和生产行为一致）。

favicon 现在是一套"命运石之门沙漏"图标体系，由 `tools/generate-icons.mjs` 从同一份图形源一键生成：`favicon.svg`（矢量版，现代浏览器优先用）+ `favicon-16/32.png` + `favicon.ico`（16/32/48 三合一，`favicon:` 指向它）+ `apple-touch-icon.png`（180×180 全出血方形，iOS 加主屏时自动裁圆角），多尺寸 `<link>` 标签由 `inject.head` 注入；另在 `source/favicon.ico` 放了一份站点根路径副本（照顾 `/favicon.ico` 的老惯例，是 ADR-0004"图片进 images/"的一个登记在案的例外）。想换图标：改脚本里的图形源后重跑

```bash
npm i --no-save sharp                          # 栅格化依赖，--no-save 不动 package.json
node tools/generate-icons.mjs --variant=meter # 可选 classic / meter / minimal
```

设计过程与配色依据见 dev-log 09。

⚠️ **本仓库踩过的最大的坑**（开发日志 05）：Hexo 的站点身份必须是**顶层键**。写成

```yaml
site:
  title: xxx   # ❌ Jekyll 风格嵌套——Hexo 静默忽略，标题回退为 "Hexo"
```

构建照样成功、不报任何错，只是全部失效。**"构建通过"≠"配置生效"，改完必须看渲染产物或页面标题。**

---

## 2. 导航与页面

**导航菜单**（`_config.butterfly.yml` 的 `menu:`）：

```yaml
menu:
  首页: / || fas fa-home
  分类: /categories/ || fas fa-folder-open
  标签: /tags/ || fas fa-tags
  关于: /about/ || fas fa-user
```

格式是 `显示文字: 路径 || 图标`。想加"友链"，先建页面再挂菜单（两步）：

```bash
npx hexo new page links    # 生成 source/links/index.md
```

```yaml
menu:
  友链: /links/ || fas fa-link   # 加一行
```

然后编辑 `source/links/index.md` 的 front-matter。

**特殊页面靠 front-matter 的 `type` 驱动**——这是 Butterfly 的硬约定，路径必须和 `menu` 里一致：

| type | 页面 | 文件 |
|---|---|---|
| `about` | 关于 | `source/about/index.md` |
| `tags` | 标签墙 | `source/tags/index.md` |
| `categories` | 分类墙 | `source/categories/index.md` |

---

## 3. 写文章（日常使用频率最高）

```bash
npx hexo new "文章标题"          # 正式文章 → source/_posts/
npx hexo new draft "草稿标题"    # 草稿 → source/_drafts/（构建时不产出页面）
npx hexo server --draft          # 预览时带上草稿
npx hexo publish "草稿标题"      # 草稿转正
```

**front-matter 模板**（照抄三篇占位文之一最省事）：

```yaml
---
title: 文章标题
date: 2026-09-11 16:00:00
categories:
  - 技术          # 主坐标系，一篇一个：生活/学习/技术
tags:
  - Hexo          # 自由标注，随意多个
cover: /images/xx.jpg   # 可选：首页卡片的封面图
description: 一句话摘要   # 可选：不写则自动截取正文
top: 1                 # 可选：置顶，数字越小越靠前
---
```

⚠️ **别手写 abbrlink**。front-matter 里的 `abbrlink: xxxxxxxx` 是首次构建时插件自动写入的永久 ID（ADR-0003）——**新文章没有它没关系，本地跑一次预览/构建就有了**；已有的别动，动了就是换 URL。

**配图**：图片放 `source/images/`，正文里 `![说明](/images/文件名.png)`。**建议开图片点击放大**（第三层会讲）。图片多时按子目录整理（`source/images/2026/`），引用路径跟着变即可。

**Butterfly 的内容标签**（正文里直接写的增强语法，官方文档 butterfly.js.org 有完整列表）：

```markdown
{% note info %} 高亮提示框 {% endnote %}
{% tabs 标签名 %} ... {% endtabs %}   选项卡
```

---

## 4. 视觉定制速查表（`_config.butterfly.yml`）

按"想改什么"索引，全部是现成开关：

| 想要的效果 | 找哪个配置 | 怎么改 |
|---|---|---|
| 首页打字机副标题 | `subtitle:` | `enable: true`，`sub` 里每行一句；`source: 1` 可接一言 API |
| 主题配色 | `theme_color:` | 本站已启用（黑白配：近黑 #1C1C1E，与图标炭黑面板同源）；改色就改块内色值（十六进制，**必须带双引号**）。⚠️ 块内没写的键会回退成主题默认的蓝色系，不是"不生效" |
| 暗色模式 | `darkmode:` | 已默认开；`autoChangeMode: 1` 可跟随系统 |
| 首页卡片布局 | `index_layout:` | 1~7 七种排法，改数字刷新即见 |
| 网站背景 | `background:` | 纯色或 `/images/xx.jpg`；数组则每次随机一张 |
| 首页顶部大图 | `index_img:` | 一张图路径；留空为纯色 |
| 文章默认封面 | `cover.default_cover:` | 文章没配 `cover` 时用它，列表秒变好看 |
| 点击特效 | `fireworks:` / `click_heart:` / `clickShowText:` | 各自 `enable: true` |
| 背景动效 | `canvas_nest:`（粒子线）/ `canvas_ribbon:` / `canvas_fluttering_ribbon:` | 各自 `enable: true` |
| 页面加载动画 | `preloader:` | `enable: true` + `source: 1`（全屏）或 `2`（进度条） |
| 侧栏卡片开关 | `aside.card_xxx.enable` | 逐个 true/false 排列组合 |
| 文章字数统计 | `wordcount:` | `enable: true`（会提示装 hexo-wordcount，`npm i hexo-wordcount`） |

---

## 5. 第三层：内容体验开关（建议项）

| 开关 | 配置位置 | 为什么值得开 |
|---|---|---|
| 图片点击放大 | `lightbox: fancybox` | 贴图博客刚需；不配置项是空 → 页面插图无法放大 |
| 文章过时提醒 | `noticeOutdate.enable: true`（`limit_day: 365`） | 技术文一年后自动挂"内容可能过时"横幅 |
| 复制带版权 | `copy.copyright.enable: true`（`limit_count: 150`） | 别人复制超 150 字自动附版权声明 |
| 相关文章 | `related_post`（默认已开） | 文章底部推荐同类内容 |

---

## 6. 第四层：注入与魔改（进阶）

**轻度——inject 注入**（不动主题文件，升级无冲突）：

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/custom.css">   # 文件放 source/css/custom.css
  bottom:
    - <script src="/js/custom.js"></script>            # 文件放 source/js/custom.js
```

自定义 CSS 一行就能见效，例如隐藏公告卡：

```css
#aside-content .card-announcement { display: none; }
```

（元素名不会猜——浏览器 F12 选中元素抄选择器。）

本站已有一个活例子：`source/css/custom.css` 把顶部导航条从主题硬编码的白色半透明改成黑色半透明（黑白配主题的一部分，见 dev-log 10）。

**重度——vendor 主题**（真要改模板结构时，按 CONTEXT.md"vendor 主题"词条走）：

```bash
cp -r node_modules/hexo-theme-butterfly themes/butterfly
# 然后 _config.yml 改 theme: 后主题名不变（themes/ 目录优先于 node_modules）
```

从此模板（Pug 语法，在 `themes/butterfly/layout/`）随便改，每行都在你自己的 git 历史里。代价：主题升级要手动合并（ADR-0001 记录过这是季度级投入）。

---

## 7. 上线回路与排错

```bash
npm run server              # 本地预览（改配置的黄金回路第 1 步）
npm run build               # 纯构建检查（CI 跑的就是它）
git add -A && git commit -m "..." && git push   # 上线，约 1 分钟后生效
```

| 症状 | 多半是 |
|---|---|
| 改了配置毫无变化 | 本地预览时配置文件保存失败/没保存；或键嵌套错位（见第 1 节的坑） |
| 构建报 YAML 错误 | 缩进用 Tab 了——YAML 只认空格；或冒号后没空格 |
| 页面上出现 `{% %}` 原文 | 标签插件没闭合（`{% endnote %}` 之类） |
| 图片 404 | 路径没以 `/images/` 开头，或文件名大小写不符（本地 Windows 不敏感、线上 Linux 敏感！**文件名一律小写**） |
| 线上没更新 | push 真的成功了吗？`git status -sb` 看 ahead；Actions 页看是不是全绿；强刷 Ctrl+F5 |
| push 连接重置 | 网络抖动，重试一两次（部署当天实测发生过） |

---

## 8. 推荐的动手顺序

1. **今天就能做**：第 5 节四个开关调一遍（lightbox 必开）→ 顺手 `npm run server` 看效果 → push
2. **本周**：第 4 节速查表挑 3~4 项试（打字机、theme_color、default_cover、index_layout）——每试一项刷新一次，建立"改哪儿→哪儿变"的手感
3. **第一篇真文章**：照第 3 节模板写，删掉对应占位文，push——内容才是博客的本体，视觉是它的衣裳
4. **玩 inject**：建 `source/css/custom.css` 写第一行自定义样式，体验"不动主题也能改"
5. **一个月后**：对结构有想法了，再走第 6 节的 vendor 路线——那时你才知道自己真想改什么
