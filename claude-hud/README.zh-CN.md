[English](README.md) | [中文](README.zh-CN.md)

# claude-hud

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

3 行网格布局，RGB 真彩色，自动检测 Provider，显示 Git 状态，`|` 垂直对齐：

```
Opus 4.6  85k / 200k       | 43% used 85,124             | 57% remain 114,876
provider: AWS Bedrock       | ~/data/Claude/catbus/web     | git: main ~39
thinking: On                | cost: $5.76                  | 🔧 14/32 plugins · 1 MCP
```

| 行 | 说明 |
|----|------|
| **第 1 行** | 模型名称（按系列着色）+ token 使用比例 + 已用% + 剩余% |
| **第 2 行** | API Provider（自动检测）+ 工作目录 + Git 分支和状态 |
| **第 3 行** | 思考模式 + 会话费用（含 I/O token 明细）+ 插件/MCP 数量 |

所有行共享列宽 — `|` 分隔符在 3 行间垂直对齐。

## 颜色指示

百分比和模型名称根据上下文变色（RGB 真彩色）：

**上下文使用率：**

| 使用率 | 颜色 |
|--------|------|
| < 50% | 绿色 |
| 50-74% | 黄色 |
| 75-89% | 橙色 |
| >= 90% | 红色 |

**模型系列：** Opus = 品红, Sonnet = 青色, Haiku = 绿色

**Git 状态：** 干净 = 绿色 + 勾号, 有修改 = 黄色 + 修改数

## 功能特性

- **Provider 自动检测** — Anthropic API / AWS Bedrock / Google Vertex / OAuth 订阅
- **Git 集成** — 分支名 + 修改文件数，颜色区分
- **工作目录** — 自动用 `~` 替代 home 路径
- **思考模式** — 开启为绿色，关闭为灰色
- **会话费用** — 含输入/输出 token 明细（↑/↓）
- **插件/MCP 计数** — 从设置和已安装插件读取
- **列对齐** — 所有 `|` 分隔符在各行间完美对齐

## 工作原理

- **上下文、费用、token** — 从 Claude Code statusLine 的 stdin JSON 读取
- **Provider** — 从模型 ID 模式自动检测（Bedrock ARN/区域前缀、Vertex、API Key、OAuth）
- **Git 状态** — `git rev-parse` + `git status --porcelain`，1.5 秒超时
- **思考状态** — 从 `~/.claude/settings.json` 读取（`alwaysThinkingEnabled`）
- **插件/MCP 数量** — 从 `~/.claude/settings.json` 和 `~/.claude/plugins/installed_plugins.json` 读取

## 系统要求

- Claude Code（最新版）
- Node.js >= 18

## 跨平台支持

- **macOS**：优先从 Keychain 读取凭据，回退到 `.credentials.json`
- **Linux/Windows**：从 `~/.claude/.credentials.json` 读取凭据
