
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/yangpeng/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/yangpeng/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/yangpeng/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/yangpeng/miniconda3/bin:$PATH"
    fi
fi
alias ll='ls -l'
alias la='ls -la'
alias cc_use='npx claude-code-costs'
export CLICOLOR=1
export LSCOLORS=ExGxFxdaCxDaDahbadeche
unset __conda_setup
# <<< conda initialize <<<
alias rna='conda activate rnaseq'
alias sc='conda activate scrna'
alias q='conda deactivate'
alias notebook='jupyter notebook'
alias cursor_ssh='~/data/jupyter/update-cursor-node'
alias wf='cd /Users/yangpeng/data/'
alias cc='claude --dangerously-skip-permissions'
alias cct='tmux new-session -A -s claude \; send-keys "claude --dangerously-skip-permissions" Enter'
alias ccb='source ~/.claude/bedrock-switch.sh on && claude --dangerously-skip-permissions'
alias ccs='source ~/.claude/bedrock-switch.sh off'
alias ccw='source ~/.claude/bedrock-switch.sh status'
alias macmini='open vnc://100.117.136.22'
# >>> Starship Prompt >>>
eval "$(starship init zsh)"
# <<< Starship Prompt <<<

# >>> Zsh Plugins >>>
# Completions (must be before compinit)
if type brew &>/dev/null; then
  FPATH=$(brew --prefix)/share/zsh-completions:$FPATH
  autoload -Uz compinit
  compinit
fi

# Autosuggestions
[[ -f /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh ]] && \
  source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=8'
ZSH_AUTOSUGGEST_STRATEGY=(history completion)

# Syntax Highlighting (must be last)
[[ -f /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ]] && \
  source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
# <<< Zsh Plugins <<<

# >>> History >>>
HISTSIZE=50000
SAVEHIST=50000
HISTFILE=~/.zsh_history
setopt EXTENDED_HISTORY
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE
setopt SHARE_HISTORY
setopt INC_APPEND_HISTORY
# <<< History <<<
export LANG=zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8


export PATH="$HOME/.local/bin:$PATH"

# bun completions
[ -s "/Users/yangpeng/.bun/_bun" ] && source "/Users/yangpeng/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

alias claude-mem='bun "/Users/yangpeng/.claude/plugins/cache/thedotmack/claude-mem/10.5.2/scripts/worker-service.cjs"'
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"


eval "$(zoxide init zsh)"

# 截图剪贴板 → 文件，用于 Claude Code 读图
function ss() {
	local file="/tmp/screenshot-$(date +%Y%m%d-%H%M%S).png"
	if pngpaste "$file" 2>/dev/null; then
		echo "$file"
	else
		echo "剪贴板里没有图片"
	fi
}

# Yazi shell wrapper — 退出时自动 cd 到浏览目录
function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	command yazi "$@" --cwd-file="$tmp"
	IFS= read -r -d '' cwd < "$tmp"
	[ "$cwd" != "$PWD" ] && [ -d "$cwd" ] && builtin cd -- "$cwd"
	rm -f -- "$tmp"
}

# Auto-launch Claude Code when triggered by Raycast cc script
if [ -f /tmp/.ghostty-launch-cc ]; then
  rm -f /tmp/.ghostty-launch-cc
  claude --dangerously-skip-permissions
fi
