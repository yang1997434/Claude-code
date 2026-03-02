#!/usr/bin/env node
/**
 * Claude Code HUD - Custom Statusline
 * Displays: model | context bar | cost + tokens | usage quota | duration | lines | plugins/MCP
 * Reads stdin JSON from Claude Code and outputs formatted statusline.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { homedir, platform } from 'node:os';
import { join } from 'node:path';

const VERSION = '1.0.0';

// ── Colors ──────────────────────────────────────────
const C = {
  reset:   '\x1b[0m',
  dim:     '\x1b[2m',
  bold:    '\x1b[1m',
  italic:  '\x1b[3m',
  black:   '\x1b[30m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  white:   '\x1b[37m',
  bCyan:   '\x1b[96m',
  bGreen:  '\x1b[92m',
  bYellow: '\x1b[93m',
  bRed:    '\x1b[91m',
  bMagenta:'\x1b[95m',
  bBlue:   '\x1b[94m',
  bWhite:  '\x1b[97m',
  fg: (n) => `\x1b[38;5;${n}m`,
};

const HOME = homedir();
const CACHE_PATH = join(HOME, '.claude', 'hud', '.usage-cache.json');
const CACHE_TTL = 60_000;       // 60s for successful data
const CACHE_TTL_ERR = 30_000;   // 30s for error state
const OAUTH_CLIENT_ID = '9d1c250a-e61b-44d9-88ed-5944d1962f5e';

// ── Stdin ───────────────────────────────────────────
async function readStdin() {
  if (process.stdin.isTTY) return null;
  const chunks = [];
  try {
    process.stdin.setEncoding('utf8');
    for await (const chunk of process.stdin) chunks.push(chunk);
    const raw = chunks.join('');
    if (!raw.trim()) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

// ── Helpers ─────────────────────────────────────────
function fmtTokens(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
}

function fmtCost(usd) {
  if (usd == null) return null;
  if (usd < 0.01) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}

function fmtDuration(ms) {
  if (ms == null) return null;
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  if (min < 60) return rem > 0 ? `${min}m${rem}s` : `${min}m`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  return `${hr}h${remMin}m`;
}

function fmtResetTime(isoStr) {
  if (!isoStr) return null;
  const reset = new Date(isoStr);
  const now = Date.now();
  const diffMs = reset.getTime() - now;
  if (diffMs <= 0) return null;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remM = mins % 60;
  if (hrs < 24) return remM > 0 ? `${hrs}h${remM}m` : `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function usageColor(pct) {
  if (pct >= 90) return C.bRed;
  if (pct >= 75) return C.bYellow;
  if (pct >= 50) return C.yellow;
  return C.bGreen;
}

// ── Credentials ─────────────────────────────────────
function getCredentials() {
  // macOS: try Keychain first
  if (platform() === 'darwin') {
    try {
      const raw = execSync(
        '/usr/bin/security find-generic-password -s "Claude Code-credentials" -w',
        { encoding: 'utf8', timeout: 2000, stdio: ['pipe', 'pipe', 'pipe'] }
      ).trim();
      const parsed = JSON.parse(raw);
      return parsed.claudeAiOauth || parsed;
    } catch { /* fall through to file-based */ }
  }

  // All platforms: credentials file fallback
  try {
    const raw = readFileSync(join(HOME, '.claude', '.credentials.json'), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.claudeAiOauth || parsed;
  } catch { return null; }
}

async function refreshAccessToken(refreshToken) {
  const res = await fetch('https://platform.claude.com/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=${OAUTH_CLIENT_ID}`,
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

// ── Usage API ───────────────────────────────────────
function readCache() {
  try {
    const cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
    const age = Date.now() - (cache.timestamp || 0);
    const ttl = cache.error ? CACHE_TTL_ERR : CACHE_TTL;
    return { data: cache.data, fresh: age < ttl };
  } catch {
    return { data: null, fresh: false };
  }
}

function writeCache(data, error = false) {
  try {
    writeFileSync(CACHE_PATH, JSON.stringify({
      timestamp: Date.now(),
      data,
      error,
      source: 'anthropic',
    }));
  } catch { /* ignore */ }
}

async function fetchUsage() {
  const cache = readCache();
  if (cache.fresh && cache.data) return cache.data;

  try {
    const creds = getCredentials();
    if (!creds?.accessToken) {
      writeCache(null, true);
      return cache.data; // return stale data
    }

    let token = creds.accessToken;

    // Refresh if expired
    if (creds.expiresAt && Date.now() > creds.expiresAt && creds.refreshToken) {
      const newToken = await refreshAccessToken(creds.refreshToken);
      if (newToken) token = newToken;
    }

    const res = await fetch('https://api.anthropic.com/api/oauth/usage', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'anthropic-beta': 'oauth-2025-04-20',
      },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      writeCache(null, true);
      return cache.data;
    }

    const data = await res.json();
    writeCache(data);
    return data;
  } catch {
    writeCache(null, true);
    return cache.data; // return stale on error
  }
}

// ── Render: Model ───────────────────────────────────
function renderModel(stdin) {
  const id = stdin.model?.id ?? '';
  const display = stdin.model?.display_name ?? '';
  const name = display || id.replace('claude-', '').replace(/-\d{8}$/, '');
  if (!name) return null;

  let color = C.bCyan;
  if (/opus/i.test(id)) color = C.bMagenta;
  else if (/sonnet/i.test(id)) color = C.bCyan;
  else if (/haiku/i.test(id)) color = C.bGreen;

  return `${color}${C.bold}${name}${C.reset}`;
}

// ── Render: Context Bar ─────────────────────────────
function renderContext(stdin) {
  const cw = stdin.context_window;
  if (!cw) return null;

  const usage = cw.current_usage || {};
  const inputTokens = (usage.input_tokens ?? 0)
    + (usage.cache_creation_input_tokens ?? 0)
    + (usage.cache_read_input_tokens ?? 0);

  const total = cw.context_window_size ?? 0;
  const percent = typeof cw.used_percentage === 'number'
    ? Math.min(100, Math.max(0, Math.round(cw.used_percentage)))
    : (total > 0 ? Math.min(100, Math.round((inputTokens / total) * 100)) : 0);

  let barColor, pctColor;
  if (percent >= 90) { barColor = C.bRed; pctColor = C.bRed; }
  else if (percent >= 75) { barColor = C.bYellow; pctColor = C.bYellow; }
  else if (percent >= 50) { barColor = C.yellow; pctColor = C.yellow; }
  else { barColor = C.bGreen; pctColor = C.bGreen; }

  const barWidth = 8;
  const full = Math.round((percent / 100) * barWidth);
  const empty = barWidth - full;

  const bar = `${barColor}${'━'.repeat(full)}${C.dim}${C.fg(240)}${'─'.repeat(empty)}${C.reset}`;
  const tokenStr = total > 0
    ? `${C.dim}${fmtTokens(inputTokens)}/${fmtTokens(total)}${C.reset}`
    : `${C.dim}${fmtTokens(inputTokens)}${C.reset}`;
  const warn = percent >= 90 ? ` ${C.bRed}⚠${C.reset}` : '';

  return `${bar} ${pctColor}${percent}%${C.reset} ${tokenStr}${warn}`;
}

// ── Render: Cost + Cumulative Tokens ────────────────
function renderCost(stdin) {
  const cost = stdin.cost;
  if (!cost) return null;

  const parts = [];
  const usd = fmtCost(cost.total_cost_usd);
  if (usd) parts.push(`${C.bYellow}${usd}${C.reset}`);

  const inTok = cost.total_input_tokens;
  const outTok = cost.total_output_tokens;
  if (inTok > 0 || outTok > 0) {
    const tokParts = [];
    if (inTok > 0) tokParts.push(`${C.dim}↑${fmtTokens(inTok)}${C.reset}`);
    if (outTok > 0) tokParts.push(`${C.dim}↓${fmtTokens(outTok)}${C.reset}`);
    parts.push(tokParts.join(' '));
  }

  return parts.length > 0 ? parts.join(' ') : null;
}

// ── Render: Mini Bar ────────────────────────────────
function miniBar(pct, width = 5) {
  const clr = usageColor(pct);
  const full = Math.round((pct / 100) * width);
  const empty = width - full;
  return `${clr}${'━'.repeat(full)}${C.dim}${C.fg(240)}${'─'.repeat(empty)}${C.reset}`;
}

// ── Render: Subscription Usage ──────────────────────
function renderUsage(usage) {
  if (!usage) return null;

  const parts = [];

  // 5-hour session limit (with mini bar)
  if (usage.five_hour) {
    const pct = usage.five_hour.utilization ?? 0;
    const clr = usageColor(pct);
    const bar = miniBar(pct, 5);
    const reset = fmtResetTime(usage.five_hour.resets_at);
    parts.push(`${clr}5h${C.reset} ${bar} ${clr}${pct}%${C.reset}${reset ? ` ${C.dim}↻${reset}${C.reset}` : ''}`);
  }

  // 7-day all models
  if (usage.seven_day) {
    const pct = usage.seven_day.utilization ?? 0;
    const clr = usageColor(pct);
    const bar = miniBar(pct, 5);
    parts.push(`${clr}7d${C.reset} ${bar} ${clr}${pct}%${C.reset}`);
  }

  // Sonnet weekly
  if (usage.seven_day_sonnet) {
    const pct = usage.seven_day_sonnet.utilization ?? 0;
    const clr = usageColor(pct);
    const bar = miniBar(pct, 5);
    parts.push(`${clr}S${C.reset} ${bar} ${clr}${pct}%${C.reset}`);
  }

  // Opus weekly (if present)
  if (usage.seven_day_opus) {
    const pct = usage.seven_day_opus.utilization ?? 0;
    const clr = usageColor(pct);
    const bar = miniBar(pct, 5);
    parts.push(`${clr}O${C.reset} ${bar} ${clr}${pct}%${C.reset}`);
  }

  if (parts.length === 0) return null;
  return `⏳ ${parts.join(' ')}`;
}

// ── Render: Duration ────────────────────────────────
function renderDuration(stdin) {
  const ms = stdin.cost?.total_duration_ms;
  const dur = fmtDuration(ms);
  if (!dur) return null;
  return `${C.dim}${dur}${C.reset}`;
}

// ── Render: Lines Changed ───────────────────────────
function renderLines(stdin) {
  const cost = stdin.cost;
  if (!cost) return null;
  const added = cost.total_lines_added ?? 0;
  const removed = cost.total_lines_removed ?? 0;
  if (added === 0 && removed === 0) return null;

  const parts = [];
  if (added > 0) parts.push(`${C.green}+${added}${C.reset}`);
  if (removed > 0) parts.push(`${C.red}-${removed}${C.reset}`);
  return parts.join(' ');
}

// ── Render: Plugins / MCP ───────────────────────────
function renderPlugins(stdin) {
  let enabled = 0, installed = 0, mcpCount = 0;

  try {
    const settings = JSON.parse(readFileSync(join(HOME, '.claude', 'settings.json'), 'utf8'));
    const ep = settings.enabledPlugins;
    if (ep && typeof ep === 'object') enabled = Object.values(ep).filter(Boolean).length;
  } catch { /* ignore */ }

  try {
    const data = JSON.parse(readFileSync(join(HOME, '.claude', 'plugins', 'installed_plugins.json'), 'utf8'));
    if (data.plugins && typeof data.plugins === 'object') installed = Object.keys(data.plugins).length;
  } catch { /* ignore */ }

  // MCP servers from stdin or filesystem
  const mcpSrc = stdin.mcp_servers ?? stdin.mcpServers;
  if (mcpSrc) {
    mcpCount = Array.isArray(mcpSrc) ? mcpSrc.length : Object.keys(mcpSrc).length;
  } else {
    try {
      const data = JSON.parse(readFileSync(join(HOME, '.claude', 'plugins', 'installed_plugins.json'), 'utf8'));
      const settings = JSON.parse(readFileSync(join(HOME, '.claude', 'settings.json'), 'utf8'));
      const enabledKeys = Object.keys(settings.enabledPlugins || {}).filter(k => settings.enabledPlugins[k]);
      const mcpNames = new Set();
      for (const key of enabledKeys) {
        const entries = data.plugins?.[key];
        if (!entries?.length) continue;
        const installPath = entries[0].installPath;
        if (!installPath) continue;
        try {
          const mcp = JSON.parse(readFileSync(join(installPath, '.mcp.json'), 'utf8'));
          if (mcp.mcpServers) for (const name of Object.keys(mcp.mcpServers)) mcpNames.add(name);
        } catch { /* no .mcp.json */ }
      }
      mcpCount = mcpNames.size;
    } catch { /* ignore */ }
  }

  const parts = [];
  if (installed > 0) parts.push(`${enabled}/${installed} plugins`);
  if (mcpCount > 0) parts.push(`${mcpCount} MCP`);

  if (parts.length === 0) return null;
  return `${C.fg(245)}🔧 ${parts.join(' · ')}${C.reset}`;
}

// ── Main ────────────────────────────────────────────
async function main() {
  const stdin = await readStdin();
  if (!stdin) process.exit(0);

  // Fetch usage concurrently with rendering prep
  const usagePromise = fetchUsage();
  const usage = await usagePromise;

  const SEP = `${C.dim} │ ${C.reset}`;
  const sections = [
    renderModel(stdin),
    renderContext(stdin),
    renderCost(stdin),
    renderUsage(usage),
    renderDuration(stdin),
    renderLines(stdin),
    renderPlugins(stdin),
  ].filter(Boolean);

  if (sections.length === 0) process.exit(0);

  const line = sections.join(SEP);
  console.log(line.replace(/ /g, '\u00A0'));
}

main();
