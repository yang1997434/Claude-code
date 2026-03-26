[English](README.md) | [中文](README.zh-CN.md)

# Terminal Setup

Ghostty + Starship + Zsh configuration with Catppuccin Mocha theme and powerline-style prompt.

## What's Included

```
terminal-setup/
├── ghostty/config          # Ghostty terminal config
├── starship/starship.toml  # Starship prompt config (powerline arrows + rounded caps)
├── .zshrc                  # Zsh config with plugins, aliases, history
├── setup.sh                # One-click deploy script
└── README.md
```

## Prompt Style

Pill-shaped powerline prompt with Catppuccin Mocha colors:

```
 user .../path  branch  base  00:07
❯
```

- Rounded left/right caps (U+E0B6 / U+E0B4)
- Arrow separators between segments (U+E0B0)
- Segments: OS + user | directory | git | language | conda | time

## Prerequisites

- [Ghostty](https://ghostty.org/) terminal
- [Maple Mono NF CN](https://github.com/subframe7536/maple-font/releases) font
- [Homebrew](https://brew.sh/)

## Quick Start

```bash
git clone https://github.com/yang1997434/Claude-code.git
cd Claude-code/terminal-setup
chmod +x setup.sh
./setup.sh
```

## Zsh Plugins

Installed via Homebrew:
- `zsh-autosuggestions` - Fish-like autosuggestions
- `zsh-syntax-highlighting` - Command syntax highlighting
- `zsh-completions` - Additional completions

## Key Aliases

| Alias | Command |
|-------|---------|
| `cc` | Launch Claude Code |
| `cct` | Launch Claude Code in tmux |
| `y` | Yazi file manager (auto cd on exit) |
| `ss` | Save clipboard screenshot to /tmp |
