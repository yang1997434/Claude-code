# Claude Code Configuration

[English](README.md) | [中文](README.zh-CN.md)

My Claude Code plugins, MCP servers, custom HUD statusline, and settings configuration.

## Quick Install

```bash
git clone https://github.com/yang1997434/Claude-code.git
cd Claude-code
bash install.sh
```

Or manually install each component (see below).

---

## Custom HUD Statusline

A lightweight statusline displayed at the bottom of Claude Code, showing real-time session info at a glance.

### Plugin Install (Recommended)

```bash
# Add this repo as a marketplace
claude /plugin marketplace add https://github.com/yang1997434/Claude-code

# Install HUD plugin — auto-configures everything on first session
claude /plugin install claude-hud@Claude-code
```

### Screenshot

3-line layout with RGB true color, provider detection, git status, and vertical `|` alignment:

```
Opus 4.6  85k / 200k       | 43% used 85,124             | 57% remain 114,876
provider: AWS Bedrock       | ~/data/Claude/catbus/web     | git: main ~39
thinking: On                | cost: $5.76                  | 🔧 14/32 plugins · 1 MCP
```

### HUD Layout (3 Lines)

| Line | Content | Description |
|------|---------|-------------|
| **Line 1** | `Opus 4.6  85k / 200k \| 43% used 85,124 \| 57% remain 114,876` | Model (color-coded) + token ratio + used% + remain% |
| **Line 2** | `provider: AWS Bedrock \| ~/data/Claude/catbus/web \| git: main ~39` | API provider (auto-detected) + working directory + git branch & status |
| **Line 3** | `thinking: On \| cost: $5.76 \| 🔧 14/32 plugins · 1 MCP` | Thinking mode + session cost + plugin/MCP counts |

All lines share column widths — `|` separators are vertically aligned across all 3 lines.

### Color Indicators

Percentages and model names change color (RGB true color) based on context:

| Usage | Color |
|-------|-------|
| < 50% | Green |
| 50-74% | Yellow |
| 75-89% | Orange |
| >= 90% | Red |

Model family: Opus = magenta, Sonnet = cyan, Haiku = green. Git status: clean = green, dirty = yellow.

### How It Works

- **Context, cost, tokens** — read from Claude Code's statusLine stdin JSON
- **Provider** — auto-detected from model ID patterns (Bedrock ARN/region prefix, Vertex, API key, OAuth)
- **Git status** — `git rev-parse` + `git status --porcelain` with 1.5s timeout
- **Thinking status** — read from `~/.claude/settings.json` (`alwaysThinkingEnabled`)
- **Plugin/MCP counts** — read from `~/.claude/settings.json` and `~/.claude/plugins/installed_plugins.json`

### Manual Install (HUD Only)

```bash
# Copy HUD script
mkdir -p ~/.claude/hud
cp hud/custom-hud.mjs ~/.claude/hud/

# Add statusLine to settings.json (or merge manually)
# Ensure settings.json contains:
#   "statusLine": {
#     "type": "command",
#     "command": "node ~/.claude/hud/custom-hud.mjs"
#   }
```

Restart Claude Code to activate.

---

## Plugins

### Core Plugins (Enabled)

| Plugin | Marketplace | Description |
|--------|-------------|-------------|
| `document-skills` | `anthropic-agent-skills` | Create/edit docs, slides (PPTX), spreadsheets (XLSX), PDFs, algorithmic art, MCP builders |
| `superpowers` | `claude-plugins-official` | Enhanced agent capabilities, custom agents, hooks |
| `frontend-design` | `claude-plugins-official` | Production-grade frontend UI design and web components |
| `planning-with-files` | `planning-with-files` | Manus-style file-based planning with task_plan.md, findings.md, progress.md |
| `claude-mem` | `thedotmack` | Cross-session persistent memory with semantic search (MCP-based) |

### Code Review Plugins

| Plugin | Marketplace | Description |
|--------|-------------|-------------|
| `code-review` | `claude-plugins-official` | Automated PR review — 5 parallel Sonnet agents with confidence scoring |
| `pr-review-toolkit` | `claude-plugins-official` | Multi-aspect review: code, tests, errors, types, comments, simplify (Opus reviewer) |
| `review-loop` | `hamel-review` | Codex cross-review — independent AI review on task completion |

Install:
```bash
claude /plugin install code-review@claude-plugins-official
claude /plugin install pr-review-toolkit@claude-plugins-official
claude /plugin marketplace add https://github.com/hamelsmu/claude-review-loop
claude /plugin install review-loop@hamel-review
```

### LSP Plugins (Code Intelligence)

| Plugin | Language |
|--------|----------|
| `pyright` | Python type checking |
| `pyright-lsp` | Python language server |
| `vtsls` | TypeScript/JavaScript |
| `yaml-language-server` | YAML |

Install:
```bash
claude /plugin install pyright@claude-code-lsps
claude /plugin install vtsls@claude-code-lsps
claude /plugin install yaml-language-server@claude-code-lsps
claude /plugin install pyright-lsp@claude-plugins-official
```

Optional LSPs for other languages:
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

## MCP Servers

All MCP servers are auto-configured by their plugins. No manual `.mcp.json` editing needed.

| MCP Server | Source Plugin | Tools Provided |
|------------|-------------|----------------|
| `mcp-search` | `claude-mem` | `search`, `timeline`, `get_observations`, `smart_search`, `smart_unfold`, `smart_outline` |
| `context7` | `superpowers` (external) | `resolve-library-id`, `query-docs` (up-to-date library documentation) |
| `smart-search` | `superpowers` | `web_search` (multi-engine: Kagi + Tavily) |

### context7

Retrieves up-to-date documentation for any library. Usage in Claude Code:

```
# Automatically available - just ask about any library
"How do I use React hooks?" -> context7 fetches latest React docs
```

### claude-mem (Persistent Memory)

Cross-session memory with semantic search:

```
# Search past work
/mem-search "how did we implement auth last time?"

# Smart code exploration
/smart-explore "find authentication functions"
```

### smart-search (Multi-Engine Web Search)

Queries Kagi FastGPT + Teclis + TinyGem + Tavily simultaneously. Requires Kagi API key configuration in superpowers plugin settings.

---

## Auto-Review Hooks

Automated code review gates using Claude Code hooks:

| Hook | Event | Trigger | Action |
|------|-------|---------|--------|
| `pre-commit-review.sh` | PreToolUse (Bash) | `git commit` | Blocks commit unless code review was run (30-min marker) |
| `post-pr-review.sh` | PostToolUse (Bash) | `gh pr create` | Auto-triggers `/code-review` on the new PR |

**Flow:**
```
Write code → git commit → BLOCKED (no review)
                ↓
    code-reviewer (Opus) → fix issues → mark passed → git commit OK
                                                        ↓
                                                   gh pr create
                                                        ↓
                                                /code-review (5x Sonnet)
```

Manual install:
```bash
mkdir -p ~/.claude/hooks
cp hooks/pre-commit-review.sh ~/.claude/hooks/
cp hooks/post-pr-review.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.sh
```

---

## Settings

### `settings.json`

Copy to `~/.claude/settings.json` (includes hooks, HUD, and all plugins):

```bash
cp settings.json ~/.claude/settings.json
```

Key settings:
- `hooks`: Auto-review gates (PreToolUse blocks commit, PostToolUse triggers PR review)
- `statusLine`: Custom HUD command — runs `custom-hud.mjs` to render the statusline
- `enabledPlugins`: Plugins that are active in every session
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`: Enables multi-agent team coordination

---

## Plugin Marketplaces

| Marketplace | GitHub Repo | Content |
|-------------|-------------|---------|
| `anthropic-agent-skills` | [anthropics/skills](https://github.com/anthropics/skills) | Document skills (PPTX, XLSX, PDF, etc.) |
| `claude-plugins-official` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Superpowers, frontend-design, external MCP integrations |
| `planning-with-files` | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | File-based task planning |
| `thedotmack` | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Persistent cross-session memory |
| `claude-code-lsps` | [boostvolt/claude-code-lsps](https://github.com/boostvolt/claude-code-lsps) | Language server plugins (20+ languages) |
| `hamel-review` | [hamelsmu/claude-review-loop](https://github.com/hamelsmu/claude-review-loop) | Codex cross-review loop |

Add all marketplaces:
```bash
claude /plugin marketplace add https://github.com/anthropics/skills
claude /plugin marketplace add https://github.com/anthropics/claude-plugins-official
claude /plugin marketplace add https://github.com/OthmanAdi/planning-with-files
claude /plugin marketplace add https://github.com/thedotmack/claude-mem
claude /plugin marketplace add https://github.com/boostvolt/claude-code-lsps
claude /plugin marketplace add https://github.com/hamelsmu/claude-review-loop
```

---

## Available Skills

After installation, the following skills (slash commands) are available:

| Skill | Plugin | Description |
|-------|--------|-------------|
| `/planning-with-files` | planning-with-files | Start file-based task planning |
| `/planning-with-files:status` | planning-with-files | Show planning progress |
| `/mem-search` | claude-mem | Search persistent memory |
| `/smart-explore` | claude-mem | Token-optimized code search |
| `/make-plan` | claude-mem | Create implementation plans |
| `/do` | claude-mem | Execute a phased plan |
| `/simplify` | superpowers | Review and simplify code |
| `/code-review` | code-review | Automated PR review with 5 parallel Sonnet agents |
| `/review-pr` | pr-review-toolkit | Multi-aspect review (code/tests/errors/types/simplify) |
| `/review-loop` | review-loop | Codex cross-review loop on task completion |
| `/cancel-review` | review-loop | Cancel an active review loop |
| `/frontend-design` | frontend-design | Create production-grade UI |
| `/pptx` | document-skills | Create/edit presentations |
| `/xlsx` | document-skills | Create/edit spreadsheets |
| `/pdf` | document-skills | Create/manipulate PDFs |
| `/docx` | document-skills | Create/edit documents |
| `/canvas-design` | document-skills | Create visual designs |
| `/skill-creator` | document-skills | Create new custom skills |
| `/mcp-builder` | document-skills | Build MCP servers |
| `/webapp-testing` | document-skills | Test web apps with Playwright |

---

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (latest version)
- Node.js >= 18
- Python >= 3.10 (for pyright LSP)
- Active Anthropic API key or Claude Max subscription
