[English](README.md) | [中文](README.zh-CN.md)

# Claude Code Provider Switching Guide

**Date**: 2026-03-11

Quick-switch between Claude Subscription (Anthropic API) and AWS Bedrock with shell aliases. No restart needed — just open a new terminal tab.

---

## Why Switch Providers?

| Provider | Pros | Cons |
|----------|------|------|
| **Claude Subscription** (Max/Pro) | Simple setup, built-in OAuth | Rate limits, quota caps |
| **AWS Bedrock** | No quota limits, pay-per-use, enterprise-grade | Requires AWS account, Bearer Token setup |

**Strategy**: Use Subscription as default for light tasks. Switch to Bedrock when you need sustained heavy usage (long coding sessions, parallel agents) or hit subscription limits.

---

## Setup

### 1. Install the Switch Script

```bash
mkdir -p ~/.claude
curl -o ~/.claude/bedrock-switch.sh https://raw.githubusercontent.com/yang1997434/Claude-code/main/provider-switching/bedrock-switch.sh
chmod +x ~/.claude/bedrock-switch.sh
```

### 2. Add Shell Aliases

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# Claude Code aliases
alias cc='claude --dangerously-skip-permissions'          # Quick start
alias ccb='source ~/.claude/bedrock-switch.sh on && cc'   # Start with Bedrock
alias ccs='source ~/.claude/bedrock-switch.sh off'        # Switch back to Subscription
alias ccw='source ~/.claude/bedrock-switch.sh status'     # Check current provider
```

Then reload:

```bash
source ~/.zshrc
```

### 3. Configure Your Bedrock Credentials

Edit `~/.claude/bedrock-switch.sh` and replace the placeholder values:

```bash
export AWS_REGION="us-east-1"                              # Your Bedrock region
export AWS_BEARER_TOKEN_BEDROCK="your-bearer-token-here"   # Your Bedrock token
```

**Authentication options** (choose one):

| Method | Env Vars |
|--------|----------|
| Bearer Token (recommended) | `AWS_BEARER_TOKEN_BEDROCK` |
| IAM Access Keys | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` |
| AWS Profile | `AWS_PROFILE` (uses `~/.aws/credentials`) |

---

## Usage

### Quick Commands

```bash
# Check which provider is active
ccw
# → Current: Claude Subscription
# → Current: AWS Bedrock (Region: us-east-1)

# Start Claude Code with Bedrock
ccb
# → ✓ Switched to AWS Bedrock
# → (launches Claude Code)

# Switch back to Subscription (for next session)
ccs
# → ✓ Switched back to Claude Subscription

# Start Claude Code with default provider
cc
```

### Switching Mid-Work

You can't switch providers in an active session. Instead:

1. Open a **new terminal tab**
2. Run `ccb` (Bedrock) or `cc` (Subscription)
3. Continue working in the new session

### Model Override

Claude Code defaults (Bedrock):

| Model | Bedrock Model ID |
|-------|-----------------|
| Opus 4.6 | `us.anthropic.claude-opus-4-6-v1` |
| Sonnet 4.6 | `us.anthropic.claude-sonnet-4-20250514-v1:0` |
| Haiku 4.5 | `us.anthropic.claude-haiku-4-5-20251001-v1:0` |

Switch models inside Claude Code with `/model`:
- `/model opus` — Opus 4.6 (most capable)
- `/model sonnet` — Sonnet 4.6 (fast, balanced)
- `/model haiku` — Haiku 4.5 (fastest, cheapest)

---

## Settings Integration

These settings in `~/.claude/settings.json` work with any provider:

```json
{
  "model": "opus",
  "alwaysThinkingEnabled": true,
  "effortLevel": "medium"
}
```

| Setting | Effect |
|---------|--------|
| `model` | Default model when starting Claude Code |
| `alwaysThinkingEnabled` | Extended thinking (recommended for Opus) |
| `effortLevel` | `low` / `medium` / `high` — controls reasoning depth |

---

## HUD Provider Display

If you have [claude-hud](../claude-hud/) installed, Line 2 automatically shows the active provider:

```
provider: AWS Bedrock       | ~/my-project     | git: main ~3
provider: Anthropic         | ~/my-project     | git: main ✓
```

Detection logic:
- Model ID starts with `us.` / `eu.` / `ap.` or `arn:` → **AWS Bedrock**
- Model ID contains `vertex` → **Google Vertex**
- `ANTHROPIC_API_KEY` is set → **Anthropic API**
- Default (OAuth) → **Anthropic** (Subscription)

---

## Available Bedrock Regions

| Region | ID | Notes |
|--------|----|-------|
| US East (Virginia) | `us-east-1` | Most models available |
| US West (Oregon) | `us-west-2` | Good alternative |
| EU (Frankfurt) | `eu-central-1` | For EU data residency |
| AP (Tokyo) | `ap-northeast-1` | For APAC |

Change region in `bedrock-switch.sh` or override:

```bash
AWS_REGION=us-west-2 ccb
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Bedrock: Access denied` | Check `AWS_BEARER_TOKEN_BEDROCK` or IAM permissions |
| `Model not found` | Verify model ID and region support the model |
| HUD shows wrong provider | Open new session after switching |
| `/model` shows subscription models | `CLAUDE_CODE_USE_BEDROCK=1` must be set before launch |
