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

```
Opus 4.6 │ ━━━───── 36% 72k/200k │ $1.15 ↑12k ↓8k │ ⏳ 5h ━━─── 42% ↻56m 7d ━──── 13% S ───── 3% │ 19m7s │ +189 -48 │ 🔧 9/26 plugins · 1 MCP
```

### HUD 各段说明（从左到右）

| 段落 | 示例 | 说明 |
|------|------|------|
| **模型** | `Opus 4.6` | 当前模型名称，按类型着色（Opus=紫, Sonnet=青, Haiku=绿） |
| **上下文** | `━━━───── 36% 72k/200k` | 上下文窗口使用量 — 进度条 + 百分比 + 已用/总量 token |
| **费用 + Token** | `$1.15 ↑12k ↓8k` | 会话费用 + 累计输入(↑)/输出(↓) token |
| **5h 配额** | `5h ━━─── 42% ↻56m` | 5小时滚动限额 — 进度条 + 使用率 + 重置倒计时 |
| **7d 配额** | `7d ━──── 13%` | 7天周度限额（所有模型合计） |
| **Sonnet 配额** | `S ───── 3%` | 7天 Sonnet 专属周度限额 |
| **时长** | `19m7s` | 会话运行时间 |
| **行数** | `+189 -48` | 本次会话新增（绿）/ 删除（红）行数 |
| **插件** | `🔧 9/26 plugins · 1 MCP` | 已启用 / 已安装插件数 + MCP 服务器数 |

### 颜色指示

进度条和百分比根据使用率变色：

| 使用率 | 颜色 |
|--------|------|
| < 50% | 绿色 |
| 50–74% | 黄色 |
| 75–89% | 亮黄色 |
| ≥ 90% | 红色（上下文还会显示 ⚠ 警告） |

### 工作原理

- **上下文、费用、token、时长、行数** — 从 Claude Code 的 statusLine stdin JSON 读取
- **订阅配额（5h/7d/Sonnet）** — 通过 Anthropic OAuth API（`/api/oauth/usage`）获取，本地缓存 60 秒
- **插件/MCP 数量** — 从 `~/.claude/settings.json` 和 `~/.claude/plugins/installed_plugins.json` 读取
- **凭据** — macOS 优先从 Keychain 读取（`Claude Code-credentials`），回退到文件，支持自动刷新 token

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

## 设置

### `settings.json`

复制到 `~/.claude/settings.json`：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/hud/custom-hud.mjs"
  },
  "enabledPlugins": {
    "document-skills@anthropic-agent-skills": true,
    "superpowers@claude-plugins-official": true,
    "planning-with-files@planning-with-files": true,
    "frontend-design@claude-plugins-official": true,
    "claude-mem@thedotmack": true,
    "pyright@claude-code-lsps": true,
    "vtsls@claude-code-lsps": true,
    "yaml-language-server@claude-code-lsps": true,
    "pyright-lsp@claude-plugins-official": true
  }
}
```

关键设置说明：
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`：启用多 Agent 团队协作（TeamCreate、SendMessage 等）
- `statusLine`：自定义 HUD 命令 — 运行 `custom-hud.mjs` 渲染状态栏
- `enabledPlugins`：每次会话自动启用的插件

---

## 插件市场

| Marketplace | GitHub 仓库 | 内容 |
|-------------|-------------|------|
| `anthropic-agent-skills` | [anthropics/skills](https://github.com/anthropics/skills) | 文档技能（PPTX、XLSX、PDF 等） |
| `claude-plugins-official` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Superpowers、frontend-design、外部 MCP 集成 |
| `planning-with-files` | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | 文件规划 |
| `thedotmack` | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | 持久跨会话记忆 |
| `claude-code-lsps` | [boostvolt/claude-code-lsps](https://github.com/boostvolt/claude-code-lsps) | 语言服务器插件（20+ 语言） |

添加所有 marketplace：
```bash
claude /plugin marketplace add https://github.com/anthropics/skills
claude /plugin marketplace add https://github.com/anthropics/claude-plugins-official
claude /plugin marketplace add https://github.com/OthmanAdi/planning-with-files
claude /plugin marketplace add https://github.com/thedotmack/claude-mem
claude /plugin marketplace add https://github.com/boostvolt/claude-code-lsps
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
