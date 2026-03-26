#!/bin/bash
# Terminal Setup Script for macOS
# Deploys Ghostty + Starship + Zsh configuration
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Terminal Setup ==="

# 1. Install dependencies via Homebrew
echo "[1/5] Checking Homebrew..."
if ! command -v brew &>/dev/null; then
  echo "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

echo "[2/5] Installing packages..."
brew install starship zoxide zsh-autosuggestions zsh-syntax-highlighting zsh-completions pngpaste yazi

# 2. Install font (Maple Mono NF CN)
echo "[3/5] Checking font..."
if ! fc-list 2>/dev/null | grep -qi "Maple Mono NF CN"; then
  echo "Please install 'Maple Mono NF CN' manually from: https://github.com/subframe7536/maple-font/releases"
  echo "Press Enter after installing the font..."
  read -r
fi

# 3. Deploy configs
echo "[4/5] Deploying configurations..."

# Starship
mkdir -p ~/.config
cp "$SCRIPT_DIR/starship/starship.toml" ~/.config/starship.toml
echo "  -> starship.toml"

# Ghostty
mkdir -p ~/.config/ghostty
cp "$SCRIPT_DIR/ghostty/config" ~/.config/ghostty/config
echo "  -> ghostty/config"

# Zsh - backup existing then copy
if [ -f ~/.zshrc ]; then
  cp ~/.zshrc ~/.zshrc.bak.$(date +%Y%m%d%H%M%S)
  echo "  -> .zshrc (backed up existing)"
fi
cp "$SCRIPT_DIR/.zshrc" ~/.zshrc
echo "  -> .zshrc"

# 4. Reminder
echo "[5/5] Done!"
echo ""
echo "Notes:"
echo "  - .zshrc contains hardcoded /Users/yangpeng paths (conda, bun, etc.)"
echo "    Update them to match your Mac Mini username if different."
echo "  - Restart Ghostty or run: source ~/.zshrc"
