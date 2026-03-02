#!/bin/bash
# Claude Code Plugins & HUD Setup Script
# Usage: bash install.sh

set -e

echo "=========================================="
echo " Claude Code Plugins & HUD Installer"
echo "=========================================="
echo ""

# Check claude is available
if ! command -v claude &> /dev/null; then
    echo "Error: 'claude' command not found. Install Claude Code first:"
    echo "  npm install -g @anthropic-ai/claude-code"
    exit 1
fi

echo "[1/7] Adding plugin marketplaces..."
claude /plugin marketplace add https://github.com/anthropics/skills
claude /plugin marketplace add https://github.com/anthropics/claude-plugins-official
claude /plugin marketplace add https://github.com/OthmanAdi/planning-with-files
claude /plugin marketplace add https://github.com/thedotmack/claude-mem
claude /plugin marketplace add https://github.com/boostvolt/claude-code-lsps

echo ""
echo "[2/7] Installing core plugins..."
claude /plugin install document-skills@anthropic-agent-skills
claude /plugin install superpowers@claude-plugins-official
claude /plugin install frontend-design@claude-plugins-official

echo ""
echo "[3/7] Installing planning plugin..."
claude /plugin install planning-with-files@planning-with-files

echo ""
echo "[4/7] Installing memory plugin (claude-mem with MCP search)..."
claude /plugin install claude-mem@thedotmack

echo ""
echo "[5/7] Installing LSP plugins (code intelligence)..."
claude /plugin install pyright@claude-code-lsps
claude /plugin install vtsls@claude-code-lsps
claude /plugin install yaml-language-server@claude-code-lsps
claude /plugin install pyright-lsp@claude-plugins-official

echo ""
echo "[6/7] Installing custom HUD statusline..."
mkdir -p ~/.claude/hud
cp hud/custom-hud.mjs ~/.claude/hud/
echo "  Copied hud/custom-hud.mjs -> ~/.claude/hud/"

echo ""
echo "[7/7] Applying settings..."
cp settings.json ~/.claude/settings.json
echo "  Copied settings.json -> ~/.claude/settings.json"

echo ""
echo "=========================================="
echo " Installation complete!"
echo "=========================================="
echo ""
echo "Enabled plugins:"
echo "  - document-skills    (docs, slides, spreadsheets, PDFs)"
echo "  - superpowers        (enhanced agent capabilities)"
echo "  - frontend-design    (UI/web design)"
echo "  - planning-with-files (structured task planning)"
echo "  - claude-mem         (cross-session memory + MCP search)"
echo "  - pyright + vtsls    (Python & TypeScript code intelligence)"
echo ""
echo "Custom HUD statusline:"
echo "  Model | Context bar | Cost + tokens | 5h/7d/Sonnet quotas | Duration | Lines | Plugins"
echo ""
echo "MCP servers (auto-configured by plugins):"
echo "  - claude-mem mcp-search  (persistent memory search)"
echo "  - context7              (library documentation lookup)"
echo "  - smart-search          (multi-engine web search)"
echo ""
echo "Restart Claude Code to activate the HUD."
echo ""
echo "Optional: Install additional LSPs for other languages:"
echo "  claude /plugin install gopls@claude-code-lsps"
echo "  claude /plugin install rust-analyzer@claude-code-lsps"
echo "  claude /plugin install jdtls@claude-code-lsps"
echo "  See full list: https://github.com/boostvolt/claude-code-lsps"
