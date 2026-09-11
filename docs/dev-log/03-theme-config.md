# 开发日志 03 · Butterfly 主题配置

**日期**：2026-09-11　**对应共识**：#7 Butterfly、#4 Giscus 占位、#16 不蒜子、#18 CC 版权、#20b 关于页

## 做了什么

把 `node_modules/hexo-theme-butterfly/_config.yml`（5.7.0 原版，1132 行）拷贝为根目录 `_config.butterfly.yml`——这是 Butterfly 官方推荐的"独立主题配置文件"模式：主题本体留在依赖里升级（共识 #8），我们的定制全部落在覆盖文件里。

## 修改清单（共 7 处，其余全部保持默认）

| 位置 | 改动 | 依据 |
|---|---|---|
| `menu` | 首页 / 分类 / 标签 / 关于 四项中文导航 | #20b + 标准博客结构 |
| `footer.owner.since` | 2025 → **2026** | 建站年份 |
| `aside.card_author.button` | 关闭（默认指向 github.com/xxxxxx 假链接） | #13 身份占位 |
| `aside.card_announcement.content` | 中文化"欢迎来到我的博客" | #3 |
| `search.use` | → `local_search`，placeholder 中文化 | #15 |
| `share.use` | sharejs → **关** | 共识未涉及，去第三方脚本噪声 |
| `giscus` 块 | 三项参数留空 + 回填指引注释 | #4，等向导步骤 |

## 零改动即满足共识的默认值（记录以防将来误"修"）

- `post_copyright: enable: true, license: CC BY-NC-SA 4.0` ← 共识 #18 就是主题默认值
- `busuanzi: site_uv/site_pv/page_pv: true` ← 共识 #16 同样是默认值
- `related_post / toc / darkmode / readmode` 等阅读体验项均默认合理

## 关键机制说明

- **评论当前是关闭状态**：`comments.use` 为空。等仓库 public + 开 Discussions + 装 giscus app 后，从 giscus.app 拿到 `repo/repo_id/category_id` 回填，再把 `use` 改为 `giscus`——两分钟生效。
- **第三方脚本 CDN**：默认 jsdelivr，国内可用性一般但可接受；若日后加载慢，改 `CDN.third_party_provider` 即可，无需动其他配置。

## 验证

留待 Step 5 统一构建验证（主题配置错误会在 `hexo generate` 时直接报错）。
