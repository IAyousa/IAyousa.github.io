# 开发日志 02 · 站点配置

**日期**：2026-09-11　**对应共识**：#3 中文单站、#13 身份占位、#14 abbrlink、#15 搜索、#20a RSS

## 做了什么

写 `_config.yml`（Hexo 站点配置）与 `.gitignore`。

## 关键决策与理由

1. **`permalink: posts/:abbrlink/`** + `abbrlink: alg: crc32, rep: hex` → 文章 URL 形如 `/posts/3f2a9c1d/`。ID 由标题+日期哈希**确定性**生成：本地首次构建回写进 front-matter、随源码提交后，CI 重建结果一致——这是 abbrlink 能与 Actions 流水线共存的关键（CI 无需写权限）。
2. **`post_asset_folder: false`**：配图走仓库集中目录 `source/images/`（ADR-0004），文章里用根绝对路径 `/images/xxx.png` 引用；根路径站点（ADR-0002 仓库名决策）保证该引用在本地预览与生产环境行为一致。
3. **`url` 留占位符** `yourusername`：站点 URL 影响 RSS 里的绝对链接，建仓后由向导步骤统一替换（`_config.yml` 一处即可）。
4. **`search:` 块生成 search.json**（searchdb 插件读站点配置），主题侧只负责开关与 UI——插件配置在站点层、展示在主题层，两层各管各的。
5. **`.gitignore` 排除 `public/`、`db.json`、`node_modules/`**：ADR-0002 的"main 只放源码"在版本控制层的落点。

## 验证

留待 Step 5 统一构建验证（此时还没有文章，构建无对象）。

## 复盘要点

- 换域名/换托管时只改 `url` 一行；文章 URL 因 abbrlink 与域名解耦，不受影响（ADR-0003 的设计意图）。
