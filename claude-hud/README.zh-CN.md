# claude-hud

[English](README.md) | [中文](README.zh-CN.md)

Claude Code 自定义 HUD 状态栏插件。

## 安装

```bash
# 添加 marketplace
claude /plugin marketplace add https://github.com/yang1997434/Claude-code

# 安装插件
claude /plugin install claude-hud@Claude-code
```

重启 Claude Code 即可生效。首次启动时 SessionStart hook 会自动完成配置。

## 显示内容

4 行网格布局，●○ 圆点进度条，RGB 真彩色，`|` 垂直对齐：

```
Opus 4.6  72k / 200k       | 36% used 72,000             | 64% remain 128,000
current: ●●●○○○○○ 32%      | weekly: ●○○○○○○○ 16%        | sonnet: ○○○○○○○○ 5%
resets 6pm                  | resets mar 7, 3pm            | resets mar 7, 4pm
thinking: Off               | cost: $11.05 ↑120k ↓85k     | 🔧 12/29 plugins · 1 MCP
```

| 行 | 说明 |
|----|------|
| **第 1 行** | 模型（着色）+ token 比例 + 已用% + 剩余% |
| **第 2 行** | 订阅配额 ●○ 圆点条（current / weekly / sonnet / opus） |
| **第 3 行** | 重置时间（本地时间），与配额列对齐 |
| **第 4 行** | 思考模式 + 会话费用 + 插件/MCP 数量 |

所有行共享列宽 — `|` 分隔符在 4 行间垂直对齐。

## 颜色指示

●○ 圆点条和百分比根据使用率变色（RGB 真彩色）：

| 使用率 | 颜色 |
|--------|------|
| < 50% | 绿色 |
| 50–74% | 黄色 |
| 75–89% | 橙色 |
| ≥ 90% | 红色（上下文还会显示 ⚠ 警告） |

## 工作原理

- **上下文、费用、token** — 从 Claude Code statusLine 的 stdin JSON 读取
- **订阅配额（current/weekly/sonnet/opus）** — 通过 Anthropic OAuth API 获取，本地缓存 60 秒
- **重置时间** — 显示为本地时间（如 `6pm`、`mar 7, 3:30pm`）
- **思考状态** — 从 `~/.claude/settings.json` 读取（`alwaysThinkingEnabled`）
- **插件/MCP 数量** — 从 `~/.claude/settings.json` 和已安装插件读取
- **凭据** — `CLAUDE_CODE_OAUTH_TOKEN` 环境变量（优先）→ macOS Keychain → 凭据文件，支持自动刷新 token

## 系统要求

- Claude Code（最新版）
- Node.js >= 18
- Claude Max 订阅（用于配额显示）

## 跨平台支持

- **macOS**：优先从 Keychain 读取凭据，回退到 `.credentials.json`
- **Linux/Windows**：从 `~/.claude/.credentials.json` 读取凭据
