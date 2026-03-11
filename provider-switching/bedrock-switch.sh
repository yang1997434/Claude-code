#!/bin/bash
# Claude Code: Switch between Subscription and AWS Bedrock
# Usage: source ~/.claude/bedrock-switch.sh [on|off|status]
#
# Install:
#   cp bedrock-switch.sh ~/.claude/
#   chmod +x ~/.claude/bedrock-switch.sh
#
# Add to ~/.zshrc or ~/.bashrc:
#   alias cc='claude --dangerously-skip-permissions'
#   alias ccb='source ~/.claude/bedrock-switch.sh on && cc'
#   alias ccs='source ~/.claude/bedrock-switch.sh off'
#   alias ccw='source ~/.claude/bedrock-switch.sh status'

ACTION="${1:-status}"

case "$ACTION" in
  on|bedrock)
    export CLAUDE_CODE_USE_BEDROCK=1
    export AWS_REGION="${AWS_REGION:-us-east-1}"
    # ── Authentication (choose one) ──
    # Option 1: Bearer Token (recommended)
    export AWS_BEARER_TOKEN_BEDROCK="${AWS_BEARER_TOKEN_BEDROCK:-your-bearer-token-here}"
    # Option 2: IAM Access Keys (uncomment below, comment out Bearer Token)
    # export AWS_ACCESS_KEY_ID="your-access-key"
    # export AWS_SECRET_ACCESS_KEY="your-secret-key"
    # Option 3: AWS Profile (uncomment below)
    # export AWS_PROFILE="your-profile-name"

    # ── Model IDs ──
    export ANTHROPIC_DEFAULT_OPUS_MODEL="us.anthropic.claude-opus-4-6-v1"
    export ANTHROPIC_DEFAULT_SONNET_MODEL="us.anthropic.claude-sonnet-4-20250514-v1:0"
    export ANTHROPIC_DEFAULT_HAIKU_MODEL="us.anthropic.claude-haiku-4-5-20251001-v1:0"

    echo "✓ Switched to AWS Bedrock"
    echo "  Region: ${AWS_REGION}"
    echo "  Opus: ${ANTHROPIC_DEFAULT_OPUS_MODEL}"
    echo "  Sonnet: ${ANTHROPIC_DEFAULT_SONNET_MODEL}"
    echo "  Haiku: ${ANTHROPIC_DEFAULT_HAIKU_MODEL}"
    echo "  Run 'claude' to start with Bedrock"
    ;;
  off|sub)
    unset CLAUDE_CODE_USE_BEDROCK
    unset AWS_REGION
    unset AWS_BEARER_TOKEN_BEDROCK
    unset AWS_ACCESS_KEY_ID
    unset AWS_SECRET_ACCESS_KEY
    unset AWS_PROFILE
    unset ANTHROPIC_DEFAULT_OPUS_MODEL
    unset ANTHROPIC_DEFAULT_SONNET_MODEL
    unset ANTHROPIC_DEFAULT_HAIKU_MODEL
    echo "✓ Switched back to Claude Subscription"
    echo "  Run 'claude' to start with Subscription"
    ;;
  status)
    if [ -n "$CLAUDE_CODE_USE_BEDROCK" ]; then
      echo "Current: AWS Bedrock (Region: ${AWS_REGION})"
    else
      echo "Current: Claude Subscription"
    fi
    ;;
  *)
    echo "Usage: source ~/.claude/bedrock-switch.sh [on|off|status]"
    echo "  on/bedrock  - Switch to AWS Bedrock"
    echo "  off/sub     - Switch to Claude Subscription"
    echo "  status      - Show current provider"
    ;;
esac
