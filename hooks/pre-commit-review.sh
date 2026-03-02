#!/bin/bash
# Pre-commit review gate: blocks git commit unless review passed
# Uses marker file to track review status

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Only intercept git commit commands
if ! echo "$COMMAND" | grep -qE '^\s*git\s+commit'; then
  exit 0
fi

# Skip amend commits (already reviewed)
if echo "$COMMAND" | grep -q '\-\-amend'; then
  exit 0
fi

MARKER="$HOME/.claude/hooks/.review-passed"

# Check if review was done recently (within 30 minutes)
if [ -f "$MARKER" ]; then
  MARKER_AGE=$(( $(date +%s) - $(stat -f %m "$MARKER" 2>/dev/null || echo 0) ))
  if [ "$MARKER_AGE" -lt 1800 ]; then
    # Review passed, allow commit and clean up marker
    rm -f "$MARKER"
    exit 0
  fi
fi

# No recent review — block commit and request review
cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Code review required before commit",
    "additionalContext": "BLOCKED: You must run a code review before committing. Please:\n1. Run the code-reviewer agent (from pr-review-toolkit) on the staged changes\n2. Fix any critical/important issues found\n3. After review passes, run: touch ~/.claude/hooks/.review-passed\n4. Then retry the git commit\n\nTo review, use the Agent tool to launch the 'code-reviewer' subagent on the current git diff."
  }
}
EOF
exit 0
