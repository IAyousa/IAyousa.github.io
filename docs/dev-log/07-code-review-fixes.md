# 开发日志 07 · 双轴代码审查与修复

**日期**：2026-09-11　**审查对象**：全部改动（基线 = git 空树，26 文件）

## 审查方式

按 `/code-review` 流程派两个并行子代理：**Standards 轴**（对照仓库自身文档：CONTEXT.md 词汇表、README 结构声明、4 条 ADR、开发日志约定 + Fowler 坏味道基线）与 **Spec 轴**（逐项核对 20 项设计共识）。两轴独立汇报、不合并不排序。

## 审查结论

- **Standards 轴**：无硬违规；2 处术语软违规 + 1 处可接受的防御性条目
- **Spec 轴**：20 项共识无缺失、无 scope creep；1 处文档缺口 + 2 处提请确认项

## 已修复（4 项）

| # | 发现 | 来源轴 | 修复 |
|---|---|---|---|
| 1 | README 把 `hexo new` 产物叫"草稿文件"，与 CONTEXT.md「草稿」词条冲突（post ≠ draft） | 双轴同中 | 改为"文章文件"，并补全真正的草稿工作流命令（`new draft` / `server --draft` / `publish`）——顺带补上共识 #20c 此前缺失的操作说明 |
| 2 | hello-world.md 用了禁用词"留言"（「评论」词条 _Avoid_） | Standards | 改为"评论" |
| 3 | `hexo-renderer-pug` 仅作为 Butterfly 的传递依赖存在；它是全部主题模板的渲染关键件，主题若调整依赖清单即断 | Spec | 显式声明进 package.json（^3.0.0），CI 的 `npm ci` 不再隐式依赖主题内部依赖 |
| 4 | `feed.content_limit: 140` 使 RSS 只输出 140 字截断摘要，与订阅读者预期不符 | Spec（提请确认） | 改为全文输出（删截断参数），atom.xml 已验证含正文全文 |

## 审查后保留（3 项，记录理由）

- `.gitignore` 里的 `.deploy_git/`：为弃用的 `hexo deploy` 留防御性排除，万一误用不会把产物提交进仓库——判断性意见，保留
- `deploy.yml` 的 `workflow_dispatch`：有开发日志 06 记录的用途（手动重发），非投机性配置
- 占位文三篇的模板式重复：开发日志 04 明确认可的"占位文即模板"设计

## 验证

修复后 `hexo clean && hexo generate` 通过（31 文件），标题/RSS 全文正常。
