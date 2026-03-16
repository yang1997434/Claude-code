# Claude Code Skills & MCP 配置清单

> 最后更新：2026-03-16

---

## MCP Servers

### 全局 MCP（~/.claude.json）

| 名称 | 用途 | 命令 |
|------|------|------|
| **context7** | 编程库文档实时查询 | `npx -y @upstash/context7-mcp` |
| **smart-search** | 多引擎聚合搜索（Kagi + Tavily） | `node ~/.mcp-servers/smart-search/index.js` |

### 项目级 MCP

| 名称 | 项目路径 | 用途 |
|------|----------|------|
| **grep_app_mcp** | `/Users/yangpeng/data` | 跨公开仓库代码搜索（grep.app API） |
| **codex-cli** | `/Users/yangpeng/data/Claude` | Codex CLI 集成 |

---

## 已启用插件（15 个）

| # | 插件 | 来源 | 用途 |
|---|------|------|------|
| 1 | document-skills | anthropic-agent-skills | 文档处理（PDF/DOCX/PPTX/XLSX 等） |
| 2 | superpowers | claude-plugins-official | 头脑风暴、计划、TDD、调试等工作流 |
| 3 | planning-with-files | planning-with-files | 基于文件的任务规划（Manus 风格） |
| 4 | frontend-design | claude-plugins-official | 前端界面设计 |
| 5 | claude-mem | thedotmack | 跨会话记忆、计划执行、代码探索 |
| 6 | pyright | claude-code-lsps | Python 类型检查（LSP） |
| 7 | vtsls | claude-code-lsps | TypeScript/JS 语言服务 |
| 8 | yaml-language-server | claude-code-lsps | YAML 语言服务 |
| 9 | pyright-lsp | claude-plugins-official | Python LSP 补充 |
| 10 | code-review | claude-plugins-official | 代码审查 |
| 11 | pr-review-toolkit | claude-plugins-official | PR 审查工具集 |
| 12 | review-loop | hamel-review | 实现→审查→修复循环 |
| 13 | actionbook | actionbook-marketplace | 浏览器自动化、网页抓取 |
| 14 | context7 | claude-plugins-official | 编程文档查询 |
| 15 | pua | pua-skills | 高能动性问题解决 |

---

## Skills 详细分类

### 开发工作流

| Skill | 来源 | 触发场景 |
|-------|------|----------|
| `brainstorming` | superpowers | 任何创意工作前的需求探索 |
| `writing-plans` | superpowers | 有规格/需求时，写代码前制定计划 |
| `executing-plans` | superpowers | 执行已有实施计划 |
| `test-driven-development` | superpowers | 实现功能或修复 bug 前 |
| `systematic-debugging` | superpowers | 遇到 bug、测试失败时 |
| `verification-before-completion` | superpowers | 声称完成前必须验证 |
| `requesting-code-review` | superpowers | 完成任务或合并前 |
| `receiving-code-review` | superpowers | 收到代码审查反馈时 |
| `finishing-a-development-branch` | superpowers | 实现完成，决定合并方式 |
| `dispatching-parallel-agents` | superpowers | 2+ 个独立任务可并行 |
| `using-git-worktrees` | superpowers | 需要隔离工作空间时 |
| `subagent-driven-development` | superpowers | 用子代理并行执行独立任务 |
| `writing-skills` | superpowers | 创建/编辑 skill |

### 计划与记忆

| Skill | 来源 | 触发场景 |
|-------|------|----------|
| `planning-with-files` | planning-with-files | 复杂多步任务（创建 task_plan.md 等） |
| `make-plan` | claude-mem | 创建分阶段实施计划 |
| `do` | claude-mem | 执行已创建的计划 |
| `mem-search` | claude-mem | 搜索跨会话记忆 |
| `smart-explore` | claude-mem | 基于 AST 的高效代码探索 |

### UI/设计 — Impeccable 套件（18 个）

| Skill | 用途 |
|-------|------|
| `frontend-design` | 创建高质量前端界面 |
| `audit` | 审计无障碍、性能、响应式 |
| `polish` | 对齐、间距、细节一致性打磨 |
| `critique` | UX 视角评估设计 |
| `normalize` | 统一设计系统标准 |
| `optimize` | 加载速度、渲染、包体积优化 |
| `adapt` | 多屏幕/设备适配 |
| `harden` | 错误处理和边界加固 |
| `animate` | 有意义的动画和微交互 |
| `clarify` | UX 文案、错误信息优化 |
| `onboard` | 首次用户体验和空状态 |
| `colorize` | 为单调界面添加色彩 |
| `bolder` | 放大视觉冲击力 |
| `quieter` | 降低视觉强度 |
| `delight` | 添加惊喜和个性细节 |
| `distill` | 去除不必要复杂性 |
| `extract` | 提取可复用组件和 token |
| `teach-impeccable` | 建立项目设计规范（一次性） |

### 文档处理 — Anthropic Document Skills（16 个）

| Skill | 用途 |
|-------|------|
| `pdf` | PDF 提取、创建、合并、拆分、表单 |
| `docx` | Word 文档创建、编辑、批注、修订 |
| `pptx` | 演示文稿创建和编辑 |
| `xlsx` | 电子表格、公式、数据分析、可视化 |
| `frontend-design` | 生产级前端界面 |
| `canvas-design` | 视觉艺术（PNG/PDF） |
| `algorithmic-art` | p5.js 生成艺术 |
| `web-artifacts-builder` | 多组件 React 网页应用 |
| `webapp-testing` | Playwright 本地 Web 应用测试 |
| `brand-guidelines` | Anthropic 品牌风格 |
| `theme-factory` | 10 种预设主题 |
| `internal-comms` | 内部沟通文档 |
| `doc-coauthoring` | 结构化文档协作 |
| `slack-gif-creator` | Slack 动画 GIF |
| `skill-creator` | 创建新 skill |
| `mcp-builder` | 构建 MCP 服务器 |

### 代码审查

| Skill | 来源 | 用途 |
|-------|------|------|
| `code-review` | code-review | 审查 PR |
| `review-pr` | pr-review-toolkit | 多代理综合 PR 审查 |
| `review-loop` | review-loop | 实现→独立审查→修复循环 |
| `cancel-review` | review-loop | 取消进行中的审查 |

### 浏览器自动化与研究

| Skill | 来源 | 用途 |
|-------|------|------|
| `actionbook` | actionbook | 网页交互、自动化、截图、表单 |
| `extract` | actionbook | 从网站提取结构化数据 |
| `active-research` | actionbook | 深度研究，生成 HTML 报告 |

### 高能动性（PUA 套件）

| Skill | 用途 |
|-------|------|
| `pua` | 中文版 — 穷尽一切方案 |
| `pua-en` | 英文版 — 大厂 PIP 风格 |
| `pua-ja` | 日文版 — 詰め文化 |
| `high-agency` | 持续高能动性，内化标准 |

### 其他

| Skill | 用途 |
|-------|------|
| `prompt-engineering` | 编写 agent/hook/skill 提示词 |
| `claude-api` | 使用 Claude API / Anthropic SDK |
| `find-skills` | 发现和安装新 skill |
| `simplify` | 审查并简化已修改代码 |
| `loop` | 定时循环执行命令 |
| `article-extractor` | 从 URL 提取干净文章内容 |
| `csv-data-summarizer` | CSV 统计分析和可视化 |
| `changelog-generator` | 从 git 提交生成变更日志 |
| `software-architecture` | 软件架构设计指导 |
| `keybindings-help` | 自定义键盘快捷键 |
| `zoxide-install` | 安装 zoxide 目录跳转 |
| `zoxide-manage` | 管理 zoxide 目录记录 |

---

## 语言服务器（LSP）

已启用 3 个，可用 25+：

| 已启用 | 语言 |
|--------|------|
| pyright | Python |
| vtsls | TypeScript / JavaScript |
| yaml-language-server | YAML |

<details>
<summary>全部可用 LSP（点击展开）</summary>

bash-language-server, clangd, clojure-lsp, dart-analyzer, elixir-ls, gleam, gopls (Go), intelephense (PHP), jdtls (Java), kotlin-lsp, lua-language-server, nixd, ocaml-lsp, omnisharp (C#), sourcekit-lsp (Swift), terraform-ls, zls (Zig) 等

</details>

---

## PR 审查专项代理

pr-review-toolkit 提供 7 个专项子代理：

| 代理 | 职责 |
|------|------|
| code-reviewer | 代码规范和最佳实践 |
| silent-failure-hunter | 静默失败和错误处理 |
| comment-analyzer | 注释准确性和维护性 |
| pr-test-analyzer | 测试覆盖率和完整性 |
| code-simplifier | 代码简化和清晰度 |
| type-design-analyzer | 类型设计和封装 |
| pua-enforcer | 团队监督（5+ teammate 推荐） |

---

## 插件市场源

| 市场 | 来源 | 内容 |
|------|------|------|
| anthropic-agent-skills | Anthropic 官方 | 文档处理 skills |
| claude-plugins-official | Claude 官方 | 开发工具、LSP、审查 |
| claude-code-lsps | Claude 官方 | 语言服务器集合 |
| planning-with-files | ttttmr/planning-with-files | 文件规划系统 |
| thedotmack | thedotmack | 记忆和代码探索 |
| impeccable | pbakaus/impeccable | UI 设计质量套件 |
| actionbook-marketplace | actionbook/actionbook | 浏览器自动化 |
| pua-skills | tanweai/pua | 高能动性 |
| hamel-review | hamel | 审查循环 |

---

## 实验性功能

- **Agent Teams** — 多代理协作（需 tmux/iTerm2）
- **Always Thinking** — 复杂推理增强
- **Custom HUD** — 自定义状态栏（`~/.claude/hud/custom-hud.mjs`）
- **Git Hooks** — 自动备份 `~/.claude/` 到 GitHub
