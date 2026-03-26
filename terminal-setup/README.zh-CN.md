[English](README.md) | [中文](README.zh-CN.md)

# Terminal Setup

Ghostty + Starship + Zsh 终端配置，Catppuccin Mocha 主题，Powerline 箭头风格提示符。

## 文件结构

```
terminal-setup/
├── ghostty/config          # Ghostty 终端配置
├── starship/starship.toml  # Starship 提示符配置（箭头分隔 + 圆角胶囊）
├── .zshrc                  # Zsh 配置（插件、别名、历史记录）
├── setup.sh                # 一键部署脚本
└── README.md
```

## 提示符样式

胶囊形 Powerline 提示符，Catppuccin Mocha 配色：

```
 user .../path  branch  base  00:07
❯
```

- 左右圆角端（U+E0B6 / U+E0B4）
- 段间箭头分隔符（U+E0B0）
- 段：系统 + 用户 | 目录 | Git | 语言 | Conda | 时间

## 前置依赖

- [Ghostty](https://ghostty.org/) 终端
- [Maple Mono NF CN](https://github.com/subframe7536/maple-font/releases) 字体
- [Homebrew](https://brew.sh/)

## 快速部署

```bash
git clone https://github.com/yang1997434/Claude-code.git
cd Claude-code/terminal-setup
chmod +x setup.sh
./setup.sh
```

## Zsh 插件

通过 Homebrew 安装：
- `zsh-autosuggestions` — 类 Fish 自动建议
- `zsh-syntax-highlighting` — 命令语法高亮
- `zsh-completions` — 额外补全

## 常用别名

| 别名 | 说明 |
|------|------|
| `cc` | 启动 Claude Code |
| `cct` | 在 tmux 中启动 Claude Code |
| `y` | Yazi 文件管理器（退出自动 cd） |
| `ss` | 剪贴板截图保存到 /tmp |
