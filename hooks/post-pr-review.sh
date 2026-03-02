#!/bin/bash
# Post-PR creation: auto-trigger /code-review on the new PR

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Only intercept gh pr create
if ! echo "$COMMAND" | grep -qE '^\s*gh\s+pr\s+create'; then
  exit 0
fi

# Check if PR was actually created (tool succeeded)
STDOUT=$(echo "$INPUT" | jq -r '.tool_output.stdout // empty' 2>/dev/null)
if [ -z "$STDOUT" ]; then
  exit 0
fi

cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "PR created successfully. Now automatically running code review on this PR. Please use the /code-review skill to review the PR that was just created."
  }
}
EOF
exit 0
