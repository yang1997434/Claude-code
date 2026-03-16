# Claude Code 订阅 / AWS Bedrock 切换指南

## 快捷命令

| 命令 | 作用 |
|------|------|
| `cc` | 使用 **订阅额度** 启动 Claude Code |
| `ccb` | 切换到 **AWS Bedrock** 并启动 Claude Code |
| `ccw` | 查看当前使用的 provider |
| `ccs` | 切回订阅模式（仅切换，不启动） |

## 日常用法

```bash
# 正常工作，用订阅额度
cc

# 订阅额度快到了 → 退出当前会话 → 用 Bedrock 继续
# 先 Ctrl+C 或 /exit 退出当前 Claude Code，然后：
ccb

# 不确定当前用的是哪个？
ccw
# 输出: Current: Claude Subscription
# 或:   Current: AWS Bedrock (Region: us-east-1)

# Bedrock 用完想切回订阅
ccs
cc
```

## Bedrock 可用模型

| 模型 | Bedrock Model ID | 说明 |
|------|-------------------|------|
| Opus 4.6 | `us.anthropic.claude-opus-4-6-v1` | 最强，复杂任务 |
| Sonnet 4 | `us.anthropic.claude-sonnet-4-20250514-v1:0` | 日常开发 |
| Haiku 4.5 | `us.anthropic.claude-haiku-4-5-20251001-v1:0` | 快速简单任务 |

> Sonnet 4.6 暂未在此 Bedrock 账户开通，自动使用 Sonnet 4 替代。

## 注意事项

- **不能热切换**：必须先退出 Claude Code，再用 `ccb` 或 `cc` 重新启动
- **Bedrock 按量计费**：用多少付多少，无硬性限速，但注意成本
- **新终端窗口**：别名已写入 `~/.zshrc`，新 tab 自动生效
- **配置文件位置**：`~/.claude/bedrock-switch.sh`

## 费用对比

| 方式 | 计费 | 限速 |
|------|------|------|
| 订阅 | 月费固定 | 有额度上限 |
| Bedrock | 按 token 计费 | 基本无限制 |

建议：日常用订阅额度，额度紧张时切 Bedrock 应急。
