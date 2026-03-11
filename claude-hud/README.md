[English](README.md) | [中文](README.zh-CN.md)

# claude-hud

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

3-line grid layout with RGB true color, provider detection, git status, and vertical `|` alignment:

```
Opus 4.6  85k / 200k       | 43% used 85,124             | 57% remain 114,876
provider: AWS Bedrock       | ~/data/Claude/catbus/web     | git: main ~39
thinking: On                | cost: $5.76                  | 🔧 14/32 plugins · 1 MCP
```

| Line | Description |
|------|-------------|
| **Line 1** | Model (color-coded by family) + token usage ratio + used% + remain% |
| **Line 2** | API provider (auto-detected) + working directory + git branch & status |
| **Line 3** | Thinking mode + session cost (with I/O token breakdown) + plugin/MCP counts |

All lines share column widths — `|` separators are vertically aligned across all 3 lines.

## Color Indicators

Percentages and model names change color (RGB true color) based on context:

**Context usage:**

| Usage | Color |
|-------|-------|
| < 50% | Green |
| 50-74% | Yellow |
| 75-89% | Orange |
| >= 90% | Red |

**Model family:** Opus = magenta, Sonnet = cyan, Haiku = green

**Git status:** Clean = green with checkmark, Dirty = yellow with change count

## Features

- **Provider auto-detection** — Anthropic API / AWS Bedrock / Google Vertex / OAuth subscription
- **Git integration** — branch name + dirty file count, color-coded
- **Working directory** — with `~` home shorthand
- **Thinking mode** — green when on, gray when off
- **Session cost** — with input/output token breakdown (↑/↓)
- **Plugin/MCP counts** — reads from settings and installed plugins
- **Column alignment** — all `|` separators perfectly aligned across rows

## How It Works

- **Context, cost, tokens** — read from Claude Code's statusLine stdin JSON
- **Provider** — auto-detected from model ID patterns (Bedrock ARN/region prefix, Vertex, API key, OAuth)
- **Git status** — `git rev-parse` + `git status --porcelain` with 1.5s timeout
- **Thinking status** — read from `~/.claude/settings.json` (`alwaysThinkingEnabled`)
- **Plugin/MCP counts** — read from `~/.claude/settings.json` and `~/.claude/plugins/installed_plugins.json`

## Requirements

- Claude Code (latest)
- Node.js >= 18

## Cross-Platform

- **macOS**: Reads credentials from Keychain, falls back to `.credentials.json`
- **Linux/Windows**: Reads credentials from `~/.claude/.credentials.json`
