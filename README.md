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

```
Opus 4.6 │ ━━━───── 36% 72k/200k │ $1.15 ↑12k ↓8k │ ⏳ 5h ━━─── 42% ↻56m 7d ━──── 13% S ───── 3% │ 19m7s │ +189 -48 │ 🔧 9/26 plugins · 1 MCP
```

### HUD Segments (Left → Right)

| Segment | Example | Description |
|---------|---------|-------------|
| **Model** | `Opus 4.6` | Current model name, color-coded (Opus=purple, Sonnet=cyan, Haiku=green) |
| **Context** | `━━━───── 36% 72k/200k` | Context window usage — thin progress bar + percentage + tokens used/total. Red warning ⚠ at 90%+ |
| **Cost + Tokens** | `$1.15 ↑12k ↓8k` | Session cost + cumulative input(↑)/output(↓) tokens |
| **5h Quota** | `5h ━━─── 42% ↻56m` | 5-hour rolling session limit — progress bar + usage% + reset countdown |
| **7d Quota** | `7d ━──── 13%` | 7-day weekly limit (all models combined) |
| **Sonnet Quota** | `S ───── 3%` | 7-day Sonnet-specific weekly limit |
| **Duration** | `19m7s` | Session running time |
| **Lines** | `+189 -48` | Lines added (green) / removed (red) in this session |
| **Plugins** | `🔧 9/26 plugins · 1 MCP` | Enabled / installed plugins + active MCP server count |

### Color Indicators

Progress bars and percentages change color based on usage level:

| Usage | Color |
|-------|-------|
| < 50% | Green |
| 50–74% | Yellow |
| 75–89% | Bright Yellow |
| ≥ 90% | Red (+ ⚠ warning for context) |

### How It Works

- **Context, cost, tokens, duration, lines** — read from Claude Code's statusLine stdin JSON
- **Subscription quotas (5h/7d/Sonnet)** — fetched from Anthropic OAuth API (`/api/oauth/usage`), cached locally for 60s
- **Plugin/MCP counts** — read from `~/.claude/settings.json` and `~/.claude/plugins/installed_plugins.json`
- **Credentials** — read from macOS Keychain (`Claude Code-credentials`) with file fallback, auto token refresh

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

## Settings

### `settings.json`

Copy to `~/.claude/settings.json`:

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

Key settings:
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`: Enables multi-agent team coordination (TeamCreate, SendMessage, etc.)
- `statusLine`: Custom HUD command — runs `custom-hud.mjs` to render the statusline
- `enabledPlugins`: Plugins that are active in every session

---

## Plugin Marketplaces

| Marketplace | GitHub Repo | Content |
|-------------|-------------|---------|
| `anthropic-agent-skills` | [anthropics/skills](https://github.com/anthropics/skills) | Document skills (PPTX, XLSX, PDF, etc.) |
| `claude-plugins-official` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Superpowers, frontend-design, external MCP integrations |
| `planning-with-files` | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | File-based task planning |
| `thedotmack` | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Persistent cross-session memory |
| `claude-code-lsps` | [boostvolt/claude-code-lsps](https://github.com/boostvolt/claude-code-lsps) | Language server plugins (20+ languages) |

Add all marketplaces:
```bash
claude /plugin marketplace add https://github.com/anthropics/skills
claude /plugin marketplace add https://github.com/anthropics/claude-plugins-official
claude /plugin marketplace add https://github.com/OthmanAdi/planning-with-files
claude /plugin marketplace add https://github.com/thedotmack/claude-mem
claude /plugin marketplace add https://github.com/boostvolt/claude-code-lsps
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
