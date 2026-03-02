#!/bin/bash
# Claude HUD Plugin - Auto Setup Script
# Runs on SessionStart to install/update HUD statusline

set -e

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
HUD_SRC="$PLUGIN_ROOT/hud/custom-hud.mjs"
HUD_DST="$HOME/.claude/hud/custom-hud.mjs"
SETTINGS="$HOME/.claude/settings.json"

# Extract version from plugin HUD
PLUGIN_VERSION=$(grep -o "const VERSION = '[^']*'" "$HUD_SRC" 2>/dev/null | head -1 | sed "s/const VERSION = '//;s/'//")
PLUGIN_VERSION="${PLUGIN_VERSION:-1.0.0}"

# Check installed version
INSTALLED_VERSION=""
if [ -f "$HUD_DST" ]; then
    INSTALLED_VERSION=$(grep -o "const VERSION = '[^']*'" "$HUD_DST" 2>/dev/null | head -1 | sed "s/const VERSION = '//;s/'//")
fi

# Install or update HUD script
if [ ! -f "$HUD_DST" ] || [ "$INSTALLED_VERSION" != "$PLUGIN_VERSION" ]; then
    mkdir -p "$HOME/.claude/hud"
    cp "$HUD_SRC" "$HUD_DST"
    echo "claude-hud: Installed HUD v${PLUGIN_VERSION}"
else
    # Already up to date, exit silently
    exit 0
fi

# Configure statusLine in settings.json if not already set
if [ ! -f "$SETTINGS" ]; then
    # Create minimal settings with statusLine
    cat > "$SETTINGS" <<'SETTINGSEOF'
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/hud/custom-hud.mjs"
  }
}
SETTINGSEOF
    echo "claude-hud: Created settings.json with statusLine config"
else
    # Check if statusLine is already configured
    HAS_STATUSLINE=$(node -e "
try {
  const s = JSON.parse(require('fs').readFileSync('$SETTINGS', 'utf8'));
  console.log(s.statusLine ? 'yes' : 'no');
} catch { console.log('no'); }
" 2>/dev/null || echo "no")

    if [ "$HAS_STATUSLINE" = "no" ]; then
        # Merge statusLine into existing settings without overwriting
        node -e "
const fs = require('fs');
try {
  const settings = JSON.parse(fs.readFileSync('$SETTINGS', 'utf8'));
  settings.statusLine = {
    type: 'command',
    command: 'node ~/.claude/hud/custom-hud.mjs'
  };
  fs.writeFileSync('$SETTINGS', JSON.stringify(settings, null, 2) + '\n');
  console.log('claude-hud: Added statusLine config to settings.json');
} catch (e) {
  console.error('claude-hud: Warning - could not update settings.json:', e.message);
}
" 2>&1
    fi
fi
