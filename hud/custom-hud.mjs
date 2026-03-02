#!/usr/bin/env node
/**
 * Claude Code HUD v2.1.0 — Custom Statusline
 * 4-line grid layout with ●○ dot bars, RGB true color, vertical | alignment.
 *
 * Line 1: Opus 4.6  72k / 200k    | 36% used 72,000         | 64% remain 128,000
 * Line 2: current: ●●○○○○○○ 32%   | weekly: ●○○○○○○○ 16%    | sonnet: ○○○○○○○○ 5%
 * Line 3: resets 6pm               | resets mar 7, 3pm        | resets mar 7, 4pm
 * Line 4: thinking: Off            | cost: $11.05 ↑120k ↓85k | 🔧 12/29 plugins · 1 MCP
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { homedir, platform } from 'node:os';
import { join } from 'node:path';

const VERSION = '2.1.0';

// ── RGB True Colors ────────────────────────────────
const rgb = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;

const C = {
  reset:   '\x1b[0m',
  dim:     '\x1b[2m',
  bold:    '\x1b[1m',
  blue:    rgb(0, 153, 255),
  orange:  rgb(255, 176, 85),
  green:   rgb(0, 160, 0),
  cyan:    rgb(46, 149, 153),
  red:     rgb(255, 85, 85),
  yellow:  rgb(230, 200, 0),
  magenta: rgb(200, 100, 255),
  white:   rgb(220, 220, 220),
  gray:    rgb(128, 128, 128),
  dimGray: rgb(80, 80, 80),
  bGreen:  rgb(0, 200, 0),
  bYellow: rgb(255, 220, 0),
  bRed:    rgb(255, 70, 70),
  bOrange: rgb(255, 160, 60),
};

const HOME = homedir();
const CACHE_PATH = join(HOME, '.claude', 'hud', '.usage-cache.json');
const CACHE_TTL = 60_000;
const CACHE_TTL_ERR = 30_000;
const OAUTH_CLIENT_ID = '9d1c250a-e61b-44d9-88ed-5944d1962f5e';
const SEP = ` ${C.dim}|${C.reset} `;

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
function visLen(str) {
  const stripped = str.replace(/\x1b\[[0-9;]*m/g, '');
  let w = 0;
  for (const ch of stripped) {
    w += ch.codePointAt(0) > 0xFFFF ? 2 : 1;
  }
  return w;
}

function padVis(str, width) {
  const diff = width - visLen(str);
  return diff > 0 ? str + ' '.repeat(diff) : str;
}

function fmtTokens(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return `${n}`;
}

function fmtComma(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function fmtCost(usd) {
  if (usd == null) return null;
  if (usd < 0.01) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}


function fmtResetFull(isoStr) {
  if (!isoStr) return null;
  const reset = new Date(isoStr);
  if (isNaN(reset.getTime())) return null;
  if (reset.getTime() - Date.now() <= 0) return null;

  let h = reset.getHours();
  const m = reset.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  const timeStr = m > 0 ? `${h}:${String(m).padStart(2, '0')}${ampm}` : `${h}${ampm}`;

  const now = new Date();
  if (reset.toDateString() === now.toDateString()) {
    return timeStr;
  }

  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  return `${months[reset.getMonth()]} ${reset.getDate()}, ${timeStr}`;
}

function barColor(pct) {
  if (pct >= 90) return C.bRed;
  if (pct >= 75) return C.bOrange;
  if (pct >= 50) return C.bYellow;
  return C.bGreen;
}

function dotBar(pct, width = 8) {
  const clamped = Math.min(100, Math.max(0, pct));
  const full = Math.round((clamped / 100) * width);
  const empty = width - full;
  const clr = barColor(clamped);
  return `${clr}${'●'.repeat(full)}${C.dimGray}${'○'.repeat(empty)}${C.reset}`;
}

// ── Credentials ─────────────────────────────────────
function getCredentials() {
  const envToken = process.env.CLAUDE_CODE_OAUTH_TOKEN;
  if (envToken) return { accessToken: envToken };

  if (platform() === 'darwin') {
    try {
      const raw = execSync(
        '/usr/bin/security find-generic-password -s "Claude Code-credentials" -w',
        { encoding: 'utf8', timeout: 2000, stdio: ['pipe', 'pipe', 'pipe'] }
      ).trim();
      const parsed = JSON.parse(raw);
      return parsed.claudeAiOauth || parsed;
    } catch { /* fall through */ }
  }

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
      return cache.data;
    }

    let token = creds.accessToken;

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
    return cache.data;
  }
}

function readSettings() {
  try {
    return JSON.parse(readFileSync(join(HOME, '.claude', 'settings.json'), 'utf8'));
  } catch { return {}; }
}

// ── Plugin/MCP Counts ───────────────────────────────
function getPluginCounts(stdin) {
  let enabled = 0, installed = 0, mcpCount = 0;

  try {
    const settings = readSettings();
    const ep = settings.enabledPlugins;
    if (ep && typeof ep === 'object') enabled = Object.values(ep).filter(Boolean).length;
  } catch { /* ignore */ }

  try {
    const data = JSON.parse(readFileSync(join(HOME, '.claude', 'plugins', 'installed_plugins.json'), 'utf8'));
    if (data.plugins && typeof data.plugins === 'object') installed = Object.keys(data.plugins).length;
  } catch { /* ignore */ }

  const mcpSrc = stdin.mcp_servers ?? stdin.mcpServers;
  if (mcpSrc) {
    mcpCount = Array.isArray(mcpSrc) ? mcpSrc.length : Object.keys(mcpSrc).length;
  } else {
    try {
      const data = JSON.parse(readFileSync(join(HOME, '.claude', 'plugins', 'installed_plugins.json'), 'utf8'));
      const settings = readSettings();
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

  return { enabled, installed, mcpCount };
}

// ══════════════════════════════════════════════════════
// Grid Renderer — all rows share column widths for | alignment
// ══════════════════════════════════════════════════════

function renderGrid(grid) {
  // Filter out rows where all cells are empty
  const rows = grid.filter(row => row.some(c => c));
  if (rows.length === 0) return null;

  const numCols = Math.max(...rows.map(r => r.length));

  // Compute column widths across ALL rows
  const colWidths = [];
  for (let c = 0; c < numCols; c++) {
    let maxW = 0;
    for (const row of rows) {
      maxW = Math.max(maxW, visLen(row[c] || ''));
    }
    colWidths.push(maxW);
  }

  // Render each row with padding + trim trailing empty cells
  const lines = [];
  for (const row of rows) {
    // Find last non-empty cell
    let lastIdx = row.length - 1;
    while (lastIdx >= 0 && !row[lastIdx]) lastIdx--;
    if (lastIdx < 0) continue;

    const cells = [];
    for (let c = 0; c <= lastIdx; c++) {
      const cell = row[c] || '';
      // Pad all cells except the very last one in the row
      cells.push(c < lastIdx ? padVis(cell, colWidths[c]) : cell);
    }
    lines.push(cells.join(SEP));
  }

  return lines.join('\n');
}

// ══════════════════════════════════════════════════════
// Build 4-row grid
// ══════════════════════════════════════════════════════

function buildGrid(stdin, usage) {
  const settings = readSettings();

  // ── Quotas ──
  const quotaDefs = [
    { label: 'current', data: usage?.five_hour },
    { label: 'weekly',  data: usage?.seven_day },
    { label: 'sonnet',  data: usage?.seven_day_sonnet },
    { label: 'opus',    data: usage?.seven_day_opus },
  ].filter(q => q.data);

  const numCols = Math.max(3, quotaDefs.length);

  // ── Line 1: Model + tokens | X% used N | Y% remain N ──
  const line1 = new Array(numCols).fill('');
  const id = stdin.model?.id ?? '';
  const display = stdin.model?.display_name ?? '';
  const name = display || id.replace('claude-', '').replace(/-\d{8}$/, '');
  if (name) {
    let color = C.cyan;
    if (/opus/i.test(id)) color = C.magenta;
    else if (/sonnet/i.test(id)) color = C.cyan;
    else if (/haiku/i.test(id)) color = C.green;
    line1[0] = `${color}${C.bold}${name}${C.reset}`;
  }

  const cw = stdin.context_window;
  if (cw) {
    const cu = cw.current_usage || {};
    const inputTokens = (cu.input_tokens ?? 0)
      + (cu.cache_creation_input_tokens ?? 0)
      + (cu.cache_read_input_tokens ?? 0);
    const total = cw.context_window_size ?? 0;
    const pct = typeof cw.used_percentage === 'number'
      ? Math.min(100, Math.max(0, Math.round(cw.used_percentage)))
      : (total > 0 ? Math.min(100, Math.round((inputTokens / total) * 100)) : 0);
    const remain = Math.max(0, total - inputTokens);
    const remainPct = Math.max(0, 100 - pct);
    const usedClr = barColor(pct);

    line1[0] += `  ${C.white}${fmtTokens(inputTokens)} / ${fmtTokens(total)}${C.reset}`;
    line1[1] = `${usedClr}${pct}% used ${fmtComma(inputTokens)}${C.reset}`;
    line1[2] = `${C.green}${remainPct}% remain ${fmtComma(remain)}${C.reset}`;
  }

  // ── Line 2: Quota bars ──
  const line2 = new Array(numCols).fill('');
  for (let i = 0; i < quotaDefs.length; i++) {
    const q = quotaDefs[i];
    const pct = q.data.utilization ?? 0;
    const clr = barColor(pct);
    line2[i] = `${C.gray}${q.label}:${C.reset} ${dotBar(pct, 8)} ${clr}${pct}%${C.reset}`;
  }

  // ── Line 3: Reset times ──
  const line3 = new Array(numCols).fill('');
  for (let i = 0; i < quotaDefs.length; i++) {
    const resetStr = fmtResetFull(quotaDefs[i].data.resets_at);
    if (resetStr) line3[i] = `${C.gray}resets ${resetStr}${C.reset}`;
  }

  // ── Line 4: thinking | cost | plugins ──
  const line4 = new Array(numCols).fill('');

  // Col 1: thinking
  const thinkingOn = settings.alwaysThinkingEnabled === true;
  line4[0] = thinkingOn
    ? `${C.green}thinking: On${C.reset}`
    : `${C.gray}thinking: Off${C.reset}`;

  // Col 2: cost + I/O tokens
  const cost = stdin.cost;
  if (cost) {
    const usd = fmtCost(cost.total_cost_usd);
    if (usd) {
      let s = `${C.gray}cost:${C.reset} ${C.orange}${usd}${C.reset}`;
      if (cost.total_input_tokens > 0) s += ` ${C.gray}↑${fmtTokens(cost.total_input_tokens)}${C.reset}`;
      if (cost.total_output_tokens > 0) s += ` ${C.gray}↓${fmtTokens(cost.total_output_tokens)}${C.reset}`;
      line4[1] = s;
    }
  }

  // Col 3: plugins · MCP
  const { enabled, installed, mcpCount } = getPluginCounts(stdin);
  const pp = [];
  if (installed > 0) pp.push(`${enabled}/${installed} plugins`);
  if (mcpCount > 0) pp.push(`${mcpCount} MCP`);
  if (pp.length > 0) line4[2] = `${C.gray}🔧 ${pp.join(' · ')}${C.reset}`;

  // Col 4 (if exists): extra usage
  if (usage?.extra_usage?.is_enabled && numCols >= 4) {
    const eu = usage.extra_usage;
    const used = eu.used_credits ?? 0;
    const limit = eu.monthly_limit ?? 0;
    const clr = barColor(eu.utilization ?? 0);
    line4[3] = `${clr}extra $${used.toFixed(2)}/$${limit}${C.reset}`;
  }

  return [line1, line2, line3, line4];
}

// ── Main ────────────────────────────────────────────
async function main() {
  const stdin = await readStdin();
  if (!stdin) process.exit(0);

  const usage = await fetchUsage();
  const grid = buildGrid(stdin, usage);
  const output = renderGrid(grid);
  if (!output) process.exit(0);

  console.log(output.replace(/ /g, '\u00A0'));
}

main();
