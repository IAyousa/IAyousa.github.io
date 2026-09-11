# 开发日志 08 · 上线向导脚本

**日期**：2026-09-11　**对应共识**：#4 Giscus、#5 免费域名、#9 仓库结构、#11 公开仓库（ADR-0002 落地的人工侧）

## 是什么

`scripts/github-setup-wizard.sh`——交互式 bash 向导，引导完成本地无法代办的全部 GitHub 侧人工步骤。由 `/wizard` 技能生成：`STAGES` 标记以上是公共函数库（stage 进度、open_url 跨平台开浏览器、ask/write_env 幂等记录、confirm 门），以下 8 个阶段为本项目定制。

## 八个阶段（依赖序）

| # | 阶段 | 人工动作 | 捕获值 → 去处 |
|---|---|---|---|
| 1 | 确认用户名 | 回车确认（默认取 git 身份 IAyousa） | `GITHUB_USERNAME` → `.env` + sed 替换 `_config.yml` 的 url |
| 2 | 建仓 | github.com/new 建空 public 仓 `<用户名>.github.io` | — |
| 3 | Pages 发布源 | Settings→Pages→Source 选 GitHub Actions | — |
| 4 | 首次 push | 浏览器完成凭据授权 | — |
| 5 | 验证部署 | Actions 页确认双 job 全绿（红则 Re-run） | — |
| 6 | Discussions + giscus app | 勾 Discussions、装 app 并授权到本仓库 | — |
| 7 | giscus 参数 | giscus.app 复制 data-repo-id / data-category-id | 两个 ID → `.env` + awk 回填 `_config.butterfly.yml`，`comments.use` 改 giscus，并跑一次构建验证 |
| 8 | 提交上线 | confirm 后自动 commit+push，打开站点终验清单 | — |

## 关键实现决策

- **区段感知回填（awk）**：`_config.butterfly.yml` 里 `repo:` 在 gitalk/utterances/giscus 三处同名、`use:` 在五个区块同名——awk 按最近顶层键限定替换范围，只动 giscus: 块三项和 comments: 块的 use。这是不能简单 sed 的原因。
- **幂等可重跑**：`.env` 记录已捕获值，中断后重跑各 ask 以旧值为默认；sed/awk 替换天然幂等；origin 存在则跳过 remote add。
- **`.env` 不入库**：向导开场就把 `.env` 追加进 .gitignore（值本来就落在被提交的配置文件里，`.env` 只是向导记忆）。
- **无 CI secret**：deploy-pages 用内置 token，流水线零密钥——所以本向导没有 set_secret 环节。
- **Stage 8 的 confirm 门**：commit+push 是外发动作，脚本不擅自推送。

## 验证

- `bash -n` 语法通过；shellcheck 本机未安装（跳过，已记录）
- 静态走查：8 个 stage 与 TOTAL_STAGES 一致、所有捕获值落位、`set -e` 下 `&&` 短路均在豁免位、awk 区段边界（顶层键、注释行不误匹配）核对无误
- 端到端只能由用户真实执行（开浏览器、阻塞人工输入），按技能约定不由代理代跑

## 使用

```bash
bash scripts/github-setup-wizard.sh    # 仓库根目录，随时 Ctrl-C，重跑会续上
```

上线成功后本脚本留着：giscus 重配、换仓库名等场景可重跑对应阶段。
