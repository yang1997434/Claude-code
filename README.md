# Claude Code Configuration

My Claude Code plugins, MCP servers, and settings configuration.

## Quick Install

```bash
git clone https://github.com/yang1997434/Claude-code.git
cd Claude-code
bash install.sh
```

Or manually install each component (see below).

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

### Oh-My-ClaudeCode (HUD + Agent System)

32 specialized agents with automatic model routing, status HUD, and team coordination.

```bash
# Add marketplace
claude /plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode

# Install
claude /plugin install oh-my-claudecode@omc

# Setup (configures HUD + agents)
claude /omc-setup
```

---

## MCP Servers

All MCP servers are auto-configured by their plugins. No manual `.mcp.json` editing needed.

| MCP Server | Source Plugin | Tools Provided |
|------------|-------------|----------------|
| `mcp-search` | `claude-mem` | `search`, `timeline`, `get_observations`, `smart_search`, `smart_unfold`, `smart_outline` |
| `context7` | `superpowers` (external) | `resolve-library-id`, `query-docs` (up-to-date library documentation) |
| `smart-search` | `superpowers` | `web_search` (multi-engine: Kagi + Tavily) |
| `omc bridge` | `oh-my-claudecode` | Agent bridge + team MCP for multi-agent coordination |

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
- `enabledPlugins`: Plugins that are active in every session

### Oh-My-ClaudeCode Config

After running `/omc-setup`, the config is stored at `~/.claude/.omc-config.json`:

```json
{
  "defaultExecutionMode": "ultrawork",
  "setupVersion": "4.5.1"
}
```

---

## Plugin Marketplaces

| Marketplace | GitHub Repo | Content |
|-------------|-------------|---------|
| `anthropic-agent-skills` | [anthropics/skills](https://github.com/anthropics/skills) | Document skills (PPTX, XLSX, PDF, etc.) |
| `claude-plugins-official` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Superpowers, frontend-design, external MCP integrations |
| `planning-with-files` | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | File-based task planning |
| `thedotmack` | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Persistent cross-session memory |
| `claude-code-lsps` | [boostvolt/claude-code-lsps](https://github.com/boostvolt/claude-code-lsps) | Language server plugins (20+ languages) |
| `omc` | [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) | HUD, agents, model routing |

Add all marketplaces:
```bash
claude /plugin marketplace add https://github.com/anthropics/skills
claude /plugin marketplace add https://github.com/anthropics/claude-plugins-official
claude /plugin marketplace add https://github.com/OthmanAdi/planning-with-files
claude /plugin marketplace add https://github.com/thedotmack/claude-mem
claude /plugin marketplace add https://github.com/boostvolt/claude-code-lsps
claude /plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
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
