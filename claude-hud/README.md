# claude-hud

[English](README.md) | [中文](README.zh-CN.md)

Custom HUD statusline plugin for Claude Code.

## Install

```bash
# Add marketplace
claude /plugin marketplace add https://github.com/yang1997434/Claude-code

# Install plugin
claude /plugin install claude-hud@Claude-code
```

Restart Claude Code to activate. The HUD auto-installs on first session via SessionStart hook.

## What It Shows

```
Opus 4.6 │ ━━━───── 36% 72k/200k │ $1.15 ↑12k ↓8k │ ⏳ 5h ━━─── 42% ↻56m 7d ━──── 13% S ───── 3% │ 19m7s │ +189 -48 │ 🔧 9/26 plugins · 1 MCP
```

| Segment | Description |
|---------|-------------|
| **Model** | Current model, color-coded (Opus=purple, Sonnet=cyan, Haiku=green) |
| **Context** | Context window usage bar + percentage + tokens |
| **Cost** | Session cost + cumulative input/output tokens |
| **Quotas** | 5h session / 7d weekly / Sonnet / Opus usage with mini bars |
| **Duration** | Session running time |
| **Lines** | Lines added/removed |
| **Plugins** | Enabled/installed plugins + MCP server count |

## Color Indicators

| Usage | Color |
|-------|-------|
| < 50% | Green |
| 50–74% | Yellow |
| 75–89% | Bright Yellow |
| ≥ 90% | Red (+ ⚠ warning for context) |

## How It Works

- **Context, cost, tokens, duration, lines** — read from Claude Code's statusLine stdin JSON
- **Subscription quotas (5h/7d/Sonnet/Opus)** — fetched from Anthropic OAuth API, cached locally for 60s
- **Plugin/MCP counts** — read from `~/.claude/settings.json` and installed plugins
- **Credentials** — macOS Keychain with file fallback, auto token refresh

## Requirements

- Claude Code (latest)
- Node.js >= 18
- Claude Max subscription (for quota display)

## Cross-Platform

- **macOS**: Reads credentials from Keychain, falls back to `.credentials.json`
- **Linux/Windows**: Reads credentials from `~/.claude/.credentials.json`
