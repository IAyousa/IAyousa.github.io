---
status: accepted
---

# 永久链接采用 hexo-abbrlink

每篇文章生成形如 `/posts/cd3f1a2b/` 的短随机 ID 作为 URL，标题和日期随后怎么改 URL 都不变，且纯 ASCII 干净对 SEO 友好。

**Considered Options**：日期式 `:year/:month/:day/:title/`（Hexo 默认，中文标题会百分号编码且 URL 长）、标题式 `posts/:title/`（改标题即改 URL，二者都违背"永久"）。

**Consequences**： permalink 格式是最难事后更改的决策——一旦有外部链接指向旧 URL，改格式即全部断裂。abbrlink ID 写死在文章 front-matter 里，删除插件不会让已有 ID 变化。
