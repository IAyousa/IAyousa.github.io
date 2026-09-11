# 开发日志 04 · 初始内容

**日期**：2026-09-11　**对应共识**：#17 分类体系、#19 配图目录、#20b 关于页、#12 空仓起步

## 做了什么

| 文件 | 作用 |
|---|---|
| `source/_posts/hello-world.md` | 第一篇文章：介绍站点用途、写作流程、评论与协议（归入「技术」分类） |
| `source/_posts/placeholder-life.md` | 「生活」占位文（CONTEXT.md 词汇：占位文） |
| `source/_posts/placeholder-study.md` | 「学习」占位文 |
| `source/_posts/placeholder-tech.md` | 「技术」占位文 |
| `source/about/index.md` | 「关于」页（front-matter `type: about`，Butterfly 约定） |
| `source/tags/index.md` | 标签聚合页（`type: tags`） |
| `source/categories/index.md` | 分类聚合页（`type: categories`） |
| `source/images/.gitkeep` | ADR-0004 的配图集中目录占位 |

## 设计说明

- **占位文即模板**：每篇占位文正文里写明了 front-matter 怎么抄、配图路径怎么写——第一篇真文章动笔时，照着占位文的结构改就是了。
- **页面 type 是 Butterfly 的硬约定**：`type: about/tags/categories` 分别驱动三种聚合页面布局，导航菜单里的 `/categories/`、`/tags/`、`/about/` 路径与此一一对应。
- **四篇文章的 front-matter 已含 `abbrlink` 字段**：首次构建时由插件回写（键序被插件重排为 title→categories→tags→abbrlink→date，属正常行为）。**新文章不需要手写 abbrlink**，首次本地构建自动生成。

## 验证

见开发日志 05（分类页/标签页/关于页全部 200，三分类在 `public/categories/` 下各有目录）。
