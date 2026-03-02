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

```
Opus 4.6 │ ━━━───── 36% 72k/200k │ $1.15 ↑12k ↓8k │ ⏳ 5h ━━─── 42% ↻56m 7d ━──── 13% S ───── 3% │ 19m7s │ +189 -48 │ 🔧 9/26 plugins · 1 MCP
```

| 段落 | 说明 |
|------|------|
| **模型** | 当前模型名称，按类型着色（Opus=紫色, Sonnet=青色, Haiku=绿色） |
| **上下文** | 上下文窗口使用进度条 + 百分比 + token 数 |
| **费用** | 会话费用 + 累计输入/输出 token 数 |
| **配额** | 5小时滚动 / 7天周度 / Sonnet / Opus 使用量（含迷你进度条） |
| **时长** | 会话运行时间 |
| **行数** | 新增/删除行数 |
| **插件** | 已启用/已安装插件数 + MCP 服务器数 |

## 颜色指示

| 使用率 | 颜色 |
|--------|------|
| < 50% | 绿色 |
| 50–74% | 黄色 |
| 75–89% | 亮黄色 |
| ≥ 90% | 红色（上下文还会显示 ⚠ 警告） |

## 工作原理

- **上下文、费用、token、时长、行数** — 从 Claude Code statusLine 的 stdin JSON 读取
- **订阅配额（5h/7d/Sonnet/Opus）** — 通过 Anthropic OAuth API 获取，本地缓存 60 秒
- **插件/MCP 数量** — 从 `~/.claude/settings.json` 和已安装插件读取
- **凭据** — macOS 优先读取 Keychain，其他平台读取凭据文件，支持自动刷新 token

## 系统要求

- Claude Code（最新版）
- Node.js >= 18
- Claude Max 订阅（用于配额显示）

## 跨平台支持

- **macOS**：优先从 Keychain 读取凭据，回退到 `.credentials.json`
- **Linux/Windows**：从 `~/.claude/.credentials.json` 读取凭据
