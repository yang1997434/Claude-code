[English](README.md) | [中文](README.zh-CN.md)

# Claude Code 供应商切换指南

**日期**: 2026-03-11

通过 Shell 别名快速切换 Claude 订阅（Anthropic API）和 AWS Bedrock。无需重启 — 只需打开新终端标签页。

---

## 为什么要切换供应商？

| 供应商 | 优势 | 劣势 |
|--------|------|------|
| **Claude 订阅**（Max/Pro） | 设置简单，内置 OAuth | 有速率限制和配额上限 |
| **AWS Bedrock** | 无配额限制，按量计费，企业级 | 需要 AWS 账户，配置 Bearer Token |

**策略**：默认使用订阅处理轻量任务。遇到持续高强度使用（长时间编码、并行 Agent）或触及订阅限制时切换到 Bedrock。

---

## 安装

### 1. 安装切换脚本

```bash
mkdir -p ~/.claude
curl -o ~/.claude/bedrock-switch.sh https://raw.githubusercontent.com/yang1997434/Claude-code/main/provider-switching/bedrock-switch.sh
chmod +x ~/.claude/bedrock-switch.sh
```

### 2. 添加 Shell 别名

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
# Claude Code 别名
alias cc='claude --dangerously-skip-permissions'          # 快速启动
alias ccb='source ~/.claude/bedrock-switch.sh on && cc'   # 用 Bedrock 启动
alias ccs='source ~/.claude/bedrock-switch.sh off'        # 切回订阅
alias ccw='source ~/.claude/bedrock-switch.sh status'     # 查看当前供应商
```

然后重载：

```bash
source ~/.zshrc
```

### 3. 配置 Bedrock 凭据

编辑 `~/.claude/bedrock-switch.sh`，替换占位符：

```bash
export AWS_REGION="us-east-1"                              # 你的 Bedrock 区域
export AWS_BEARER_TOKEN_BEDROCK="your-bearer-token-here"   # 你的 Bedrock Token
```

**认证方式**（选择其一）：

| 方式 | 环境变量 |
|------|---------|
| Bearer Token（推荐） | `AWS_BEARER_TOKEN_BEDROCK` |
| IAM 访问密钥 | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` |
| AWS Profile | `AWS_PROFILE`（使用 `~/.aws/credentials`） |

---

## 使用方法

### 快捷命令

```bash
# 查看当前使用哪个供应商
ccw
# → Current: Claude Subscription
# → Current: AWS Bedrock (Region: us-east-1)

# 用 Bedrock 启动 Claude Code
ccb
# → ✓ Switched to AWS Bedrock
# → （启动 Claude Code）

# 切回订阅（下次会话生效）
ccs
# → ✓ Switched back to Claude Subscription

# 用默认供应商启动 Claude Code
cc
```

### 工作中切换

无法在活跃会话中切换供应商。替代方案：

1. 打开一个**新终端标签页**
2. 运行 `ccb`（Bedrock）或 `cc`（订阅）
3. 在新会话中继续工作

### 模型选择

Claude Code 默认模型（Bedrock）：

| 模型 | Bedrock 模型 ID |
|------|-----------------|
| Opus 4.6 | `us.anthropic.claude-opus-4-6-v1` |
| Sonnet 4.6 | `us.anthropic.claude-sonnet-4-20250514-v1:0` |
| Haiku 4.5 | `us.anthropic.claude-haiku-4-5-20251001-v1:0` |

在 Claude Code 内用 `/model` 切换模型：
- `/model opus` — Opus 4.6（最强大）
- `/model sonnet` — Sonnet 4.6（快速，均衡）
- `/model haiku` — Haiku 4.5（最快，最便宜）

---

## 设置集成

`~/.claude/settings.json` 中以下设置适用于任何供应商：

```json
{
  "model": "opus",
  "alwaysThinkingEnabled": true,
  "effortLevel": "medium"
}
```

| 设置 | 效果 |
|------|------|
| `model` | 启动时的默认模型 |
| `alwaysThinkingEnabled` | 扩展思考（推荐 Opus 开启） |
| `effortLevel` | `low` / `medium` / `high` — 控制推理深度 |

---

## HUD 供应商显示

如果安装了 [claude-hud](../claude-hud/)，第 2 行会自动显示当前供应商：

```
provider: AWS Bedrock       | ~/my-project     | git: main ~3
provider: Anthropic         | ~/my-project     | git: main ✓
```

检测逻辑：
- 模型 ID 以 `us.` / `eu.` / `ap.` 开头或包含 `arn:` → **AWS Bedrock**
- 模型 ID 包含 `vertex` → **Google Vertex**
- 设置了 `ANTHROPIC_API_KEY` → **Anthropic API**
- 默认（OAuth）→ **Anthropic**（订阅）

---

## 可用 Bedrock 区域

| 区域 | ID | 备注 |
|------|----|------|
| 美东（弗吉尼亚） | `us-east-1` | 模型最全 |
| 美西（俄勒冈） | `us-west-2` | 备选 |
| 欧洲（法兰克福） | `eu-central-1` | 欧洲数据合规 |
| 亚太（东京） | `ap-northeast-1` | 亚太地区 |

在 `bedrock-switch.sh` 中修改区域，或临时覆盖：

```bash
AWS_REGION=us-west-2 ccb
```

---

## 故障排查

| 问题 | 解决方案 |
|------|---------|
| `Bedrock: Access denied` | 检查 `AWS_BEARER_TOKEN_BEDROCK` 或 IAM 权限 |
| `Model not found` | 确认模型 ID 和区域是否支持该模型 |
| HUD 显示错误的供应商 | 切换后打开新会话 |
| `/model` 显示订阅模型 | 启动前必须设置 `CLAUDE_CODE_USE_BEDROCK=1` |
