# Claude Code 配置

[English](README.md) | [中文](README.zh-CN.md)

我的 Claude Code 插件、MCP 服务器、自定义 HUD 状态栏和设置配置。

## 快速安装

```bash
git clone https://github.com/yang1997434/Claude-code.git
cd Claude-code
bash install.sh
```

或手动安装各组件（见下方）。

---

## 自定义 HUD 状态栏

轻量级状态栏，显示在 Claude Code 底部，实时展示会话信息。

### 插件安装（推荐）

```bash
# 添加此仓库为 marketplace
claude /plugin marketplace add https://github.com/yang1997434/Claude-code

# 安装 HUD 插件 — 首次启动时自动完成配置
claude /plugin install claude-hud@Claude-code
```

### 效果预览

3 行布局，RGB 真彩色，自动检测 Provider，显示 Git 状态，`|` 垂直对齐：

```
Opus 4.6  85k / 200k       | 43% used 85,124             | 57% remain 114,876
provider: AWS Bedrock       | ~/data/Claude/catbus/web     | git: main ~39
thinking: On                | cost: $5.76                  | 🔧 14/32 plugins · 1 MCP
```

### HUD 布局（3 行）

| 行 | 内容 | 说明 |
|----|------|------|
| **第 1 行** | `Opus 4.6  85k / 200k \| 43% used 85,124 \| 57% remain 114,876` | 模型（着色）+ token 比例 + 已用% + 剩余% |
| **第 2 行** | `provider: AWS Bedrock \| ~/data/Claude/catbus/web \| git: main ~39` | API Provider（自动检测）+ 工作目录 + Git 分支和状态 |
| **第 3 行** | `thinking: On \| cost: $5.76 \| 🔧 14/32 plugins · 1 MCP` | 思考模式 + 会话费用 + 插件/MCP 数量 |

所有行共享列宽 — `|` 分隔符在 3 行间垂直对齐。

### 颜色指示

百分比和模型名称根据上下文变色（RGB 真彩色）：

| 使用率 | 颜色 |
|--------|------|
| < 50% | 绿色 |
| 50-74% | 黄色 |
| 75-89% | 橙色 |
| >= 90% | 红色 |

模型系列：Opus = 品红, Sonnet = 青色, Haiku = 绿色。Git 状态：干净 = 绿色, 有修改 = 黄色。

### 工作原理

- **上下文、费用、token** — 从 Claude Code 的 statusLine stdin JSON 读取
- **Provider** — 从模型 ID 模式自动检测（Bedrock ARN/区域前缀、Vertex、API Key、OAuth）
- **Git 状态** — `git rev-parse` + `git status --porcelain`，1.5 秒超时
- **思考状态** — 从 `~/.claude/settings.json` 读取（`alwaysThinkingEnabled`）
- **插件/MCP 数量** — 从 `~/.claude/settings.json` 和 `~/.claude/plugins/installed_plugins.json` 读取

### 手动安装（仅 HUD）

```bash
# 复制 HUD 脚本
mkdir -p ~/.claude/hud
cp hud/custom-hud.mjs ~/.claude/hud/

# 在 settings.json 中添加 statusLine（或手动合并）
# 确保 settings.json 包含：
#   "statusLine": {
#     "type": "command",
#     "command": "node ~/.claude/hud/custom-hud.mjs"
#   }
```

重启 Claude Code 即可生效。

---

## 插件

### 核心插件（已启用）

| 插件 | Marketplace | 说明 |
|------|-------------|------|
| `document-skills` | `anthropic-agent-skills` | 创建/编辑文档、幻灯片(PPTX)、表格(XLSX)、PDF、算法艺术、MCP 构建器 |
| `superpowers` | `claude-plugins-official` | 增强 Agent 能力、自定义 Agent、Hooks |
| `frontend-design` | `claude-plugins-official` | 生产级前端 UI 设计和 Web 组件 |
| `planning-with-files` | `planning-with-files` | Manus 风格文件规划（task_plan.md、findings.md、progress.md） |
| `claude-mem` | `thedotmack` | 跨会话持久记忆 + 语义搜索（基于 MCP） |

### 代码审查插件

| 插件 | Marketplace | 说明 |
|------|-------------|------|
| `code-review` | `claude-plugins-official` | 自动 PR 审查 — 5 个并行 Sonnet agent + 置信度评分 |
| `pr-review-toolkit` | `claude-plugins-official` | 多维度审查：代码/测试/错误/类型/注释/简化（Opus 审查员） |
| `review-loop` | `hamel-review` | Codex 交叉审查 — 任务完成后独立 AI 审查 |

安装命令：
```bash
claude /plugin install code-review@claude-plugins-official
claude /plugin install pr-review-toolkit@claude-plugins-official
claude /plugin marketplace add https://github.com/hamelsmu/claude-review-loop
claude /plugin install review-loop@hamel-review
```

### LSP 插件（代码智能）

| 插件 | 语言 |
|------|------|
| `pyright` | Python 类型检查 |
| `pyright-lsp` | Python 语言服务器 |
| `vtsls` | TypeScript/JavaScript |
| `yaml-language-server` | YAML |

安装命令：
```bash
claude /plugin install pyright@claude-code-lsps
claude /plugin install vtsls@claude-code-lsps
claude /plugin install yaml-language-server@claude-code-lsps
claude /plugin install pyright-lsp@claude-plugins-official
```

其他语言的 LSP（可选）：
```bash
claude /plugin install gopls@claude-code-lsps          # Go
claude /plugin install rust-analyzer@claude-code-lsps   # Rust
claude /plugin install jdtls@claude-code-lsps           # Java
claude /plugin install clangd@claude-code-lsps          # C/C++
claude /plugin install omnisharp@claude-code-lsps       # C#
claude /plugin install sourcekit-lsp@claude-code-lsps   # Swift
claude /plugin install kotlin-lsp@claude-plugins-official # Kotlin
claude /plugin install solargraph@claude-code-lsps      # Ruby
claude /plugin install elixir-ls@claude-code-lsps       # Elixir
claude /plugin install lua-language-server@claude-code-lsps # Lua
claude /plugin install terraform-ls@claude-code-lsps    # Terraform
claude /plugin install gleam@claude-code-lsps           # Gleam
claude /plugin install zls@claude-code-lsps             # Zig
claude /plugin install dart-analyzer@claude-code-lsps   # Dart
claude /plugin install clojure-lsp@claude-code-lsps     # Clojure
claude /plugin install bash-language-server@claude-code-lsps # Bash
claude /plugin install intelephense@claude-code-lsps    # PHP
```

---

## MCP 服务器

所有 MCP 服务器由插件自动配置，无需手动编辑 `.mcp.json`。

| MCP 服务器 | 来源插件 | 提供的工具 |
|------------|----------|-----------|
| `mcp-search` | `claude-mem` | `search`、`timeline`、`get_observations`、`smart_search`、`smart_unfold`、`smart_outline` |
| `context7` | `superpowers`（外部） | `resolve-library-id`、`query-docs`（实时库文档） |
| `smart-search` | `superpowers` | `web_search`（多引擎：Kagi + Tavily） |

### context7

获取任意库的最新文档。在 Claude Code 中直接使用：

```
# 自动可用 — 直接提问即可
"React hooks 怎么用？" -> context7 获取最新 React 文档
```

### claude-mem（持久记忆）

跨会话记忆 + 语义搜索：

```
# 搜索过去的工作
/mem-search "上次我们是怎么实现认证的？"

# 智能代码探索
/smart-explore "查找认证相关函数"
```

### smart-search（多引擎网络搜索）

同时查询 Kagi FastGPT + Teclis + TinyGem + Tavily。需要在 superpowers 插件设置中配置 Kagi API key。

---

## 自动审查 Hooks

通过 Claude Code hooks 实现自动代码审查门控：

| Hook | 事件 | 触发条件 | 行为 |
|------|------|---------|------|
| `pre-commit-review.sh` | PreToolUse (Bash) | `git commit` | 阻止提交，直到通过代码审查（30分钟标记） |
| `post-pr-review.sh` | PostToolUse (Bash) | `gh pr create` | PR 创建后自动触发 `/code-review` |

**流程：**
```
写代码 → git commit → 被阻止（未审查）
                ↓
    code-reviewer (Opus) → 修复问题 → 标记通过 → git commit 成功
                                                    ↓
                                               gh pr create
                                                    ↓
                                            /code-review (5x Sonnet)
```

手动安装：
```bash
mkdir -p ~/.claude/hooks
cp hooks/pre-commit-review.sh ~/.claude/hooks/
cp hooks/post-pr-review.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.sh
```

---

## 设置

### `settings.json`

复制到 `~/.claude/settings.json`（包含 hooks、HUD 和所有插件配置）：

```bash
cp settings.json ~/.claude/settings.json
```

关键设置说明：
- `hooks`：自动审查门控（PreToolUse 阻止 commit，PostToolUse 触发 PR 审查）
- `statusLine`：自定义 HUD 命令 — 运行 `custom-hud.mjs` 渲染状态栏
- `enabledPlugins`：每次会话自动启用的插件
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`：启用多 Agent 团队协作

---

## 插件市场

| Marketplace | GitHub 仓库 | 内容 |
|-------------|-------------|------|
| `anthropic-agent-skills` | [anthropics/skills](https://github.com/anthropics/skills) | 文档技能（PPTX、XLSX、PDF 等） |
| `claude-plugins-official` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Superpowers、frontend-design、外部 MCP 集成 |
| `planning-with-files` | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | 文件规划 |
| `thedotmack` | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | 持久跨会话记忆 |
| `claude-code-lsps` | [boostvolt/claude-code-lsps](https://github.com/boostvolt/claude-code-lsps) | 语言服务器插件（20+ 语言） |
| `hamel-review` | [hamelsmu/claude-review-loop](https://github.com/hamelsmu/claude-review-loop) | Codex 交叉审查循环 |

添加所有 marketplace：
```bash
claude /plugin marketplace add https://github.com/anthropics/skills
claude /plugin marketplace add https://github.com/anthropics/claude-plugins-official
claude /plugin marketplace add https://github.com/OthmanAdi/planning-with-files
claude /plugin marketplace add https://github.com/thedotmack/claude-mem
claude /plugin marketplace add https://github.com/boostvolt/claude-code-lsps
claude /plugin marketplace add https://github.com/hamelsmu/claude-review-loop
```

---

## 可用技能

安装后可使用以下技能（斜杠命令）：

| 技能 | 插件 | 说明 |
|------|------|------|
| `/planning-with-files` | planning-with-files | 启动文件规划 |
| `/planning-with-files:status` | planning-with-files | 查看规划进度 |
| `/mem-search` | claude-mem | 搜索持久记忆 |
| `/smart-explore` | claude-mem | Token 优化的代码搜索 |
| `/make-plan` | claude-mem | 创建实施计划 |
| `/do` | claude-mem | 执行分阶段计划 |
| `/simplify` | superpowers | 审查和简化代码 |
| `/code-review` | code-review | 自动 PR 审查（5 个并行 Sonnet agent） |
| `/review-pr` | pr-review-toolkit | 多维度审查（代码/测试/错误/类型/简化） |
| `/review-loop` | review-loop | Codex 交叉审查循环 |
| `/cancel-review` | review-loop | 取消正在进行的审查循环 |
| `/frontend-design` | frontend-design | 创建生产级 UI |
| `/pptx` | document-skills | 创建/编辑演示文稿 |
| `/xlsx` | document-skills | 创建/编辑表格 |
| `/pdf` | document-skills | 创建/操作 PDF |
| `/docx` | document-skills | 创建/编辑文档 |
| `/canvas-design` | document-skills | 创建视觉设计 |
| `/skill-creator` | document-skills | 创建自定义技能 |
| `/mcp-builder` | document-skills | 构建 MCP 服务器 |
| `/webapp-testing` | document-skills | 用 Playwright 测试 Web 应用 |

---

## 前置要求

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)（最新版）
- Node.js >= 18
- Python >= 3.10（pyright LSP 需要）
- Anthropic API key 或 Claude Max 订阅
