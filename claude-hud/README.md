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

4-line grid layout with ●○ dot progress bars, RGB true color, and vertical `|` alignment:

```
Opus 4.6  72k / 200k       | 36% used 72,000             | 64% remain 128,000
current: ●●●○○○○○ 32%      | weekly: ●○○○○○○○ 16%        | sonnet: ○○○○○○○○ 5%
resets 6pm                  | resets mar 7, 3pm            | resets mar 7, 4pm
thinking: Off               | cost: $11.05 ↑120k ↓85k     | 🔧 12/29 plugins · 1 MCP
```

| Line | Description |
|------|-------------|
| **Line 1** | Model (color-coded) + token ratio + used% + remain% |
| **Line 2** | Subscription quota ●○ dot bars (current / weekly / sonnet / opus) |
| **Line 3** | Reset times in local time, column-aligned under quotas |
| **Line 4** | Thinking mode + session cost + plugin/MCP counts |

All lines share column widths — `|` separators are vertically aligned.

## Color Indicators

●○ dot bars and percentages change color (RGB true color) based on usage:

| Usage | Color |
|-------|-------|
| < 50% | Green |
| 50–74% | Yellow |
| 75–89% | Orange |
| ≥ 90% | Red (+ ⚠ warning for context) |

## How It Works

- **Context, cost, tokens** — read from Claude Code's statusLine stdin JSON
- **Subscription quotas (current/weekly/sonnet/opus)** — fetched from Anthropic OAuth API, cached locally for 60s
- **Reset times** — displayed as local time (e.g. `6pm`, `mar 7, 3:30pm`)
- **Thinking status** — read from `~/.claude/settings.json` (`alwaysThinkingEnabled`)
- **Plugin/MCP counts** — read from `~/.claude/settings.json` and installed plugins
- **Credentials** — `CLAUDE_CODE_OAUTH_TOKEN` env (priority) → macOS Keychain → credentials file, with auto token refresh

## Requirements

- Claude Code (latest)
- Node.js >= 18
- Claude Max subscription (for quota display)

## Cross-Platform

- **macOS**: Reads credentials from Keychain, falls back to `.credentials.json`
- **Linux/Windows**: Reads credentials from `~/.claude/.credentials.json`
