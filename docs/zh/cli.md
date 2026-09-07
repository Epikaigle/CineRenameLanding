# 命令行与 Headless 用法

CineRename 包含适用于 NAS、Docker、服务器脚本和谨慎自动化的命令行工具。

## 安装

CineRename 有两个 CLI 入口：

- **Desktop CLI**：随桌面应用二进制文件提供。支持核心工作流：`preview`、`rename`、`organize`、`auto` 和 `schedule`。
- **Headless/NAS CLI**：随 NAS/headless 归档提供。支持核心工作流，并额外支持服务器工具：`audit`、`nfo`、`subtitles`、`download-client`、`pre-arr`、`web` 和 `tui`。

如果下面的命令标记为 **headless**，请使用 NAS/headless 归档，而不是桌面应用二进制文件。

NAS 发布格式：

| 架构 | 工件 |
| :--- | :--- |
| Intel / AMD 64-bit | Linux x64 NAS 归档 |
| ARM 64-bit | Linux arm64 NAS 归档 |

解压归档后，从解压目录运行命令。

## 帮助

```bash
cinerename --help
cinerename preview --help
cinerename auto --help
```

## 主要命令

| 命令 | 可用位置 | 操作 |
| --- | --- | --- |
| `cinerename preview <路径>` | Desktop + headless | 显示修改前/修改后预览，不更改文件 |
| `cinerename rename <路径>` | Desktop + headless | 就地重命名文件 |
| `cinerename organize <路径> --to <媒体库>` | Desktop + headless | 重命名并移动文件到媒体库 |
| `cinerename auto <路径> --to <媒体库> [--subs zh]` | Desktop + headless | 运行谨慎流水线：重命名、整理、可选字幕 |
| `cinerename schedule <路径> --every 15m --to <媒体库>` | Desktop + headless | 按间隔重复工作流 |
| `cinerename history list` | Headless | 列出最近的重命名批次 |
| `cinerename history undo-last` | Headless | 撤销最新可恢复批次 |
| `cinerename history undo <batch-id>` | Headless | 撤销指定批次 |
| `cinerename history export --output <路径>` | Headless | 导出历史记录到 CSV、JSON 或 Markdown |
| `cinerename audit <路径> --profile plex` | Headless | 审计 Plex/Jellyfin/Kodi 风格媒体库 |
| `cinerename nfo <路径> --profile kodi --write` | Headless | 显式生成 NFO 元数据 |
| `cinerename subtitles convert <文件> --to srt` | Headless | 转换字幕格式 |
| `cinerename subtitles shift <文件> --ms 750` | Headless | 对字幕应用固定偏移 |
| `cinerename subtitles drift <文件> --first-ms 0 --last-ms 1250` | Headless | 应用简单线性 drift 修正 |
| `cinerename download-client test qbittorrent --url <url>` | Headless | 测试下载客户端端点 |
| `cinerename download-client import <客户端> --url <url>` | Headless | 模拟或执行下载客户端导入 |
| `cinerename pre-arr preview <路径> --profile sonarr` | Headless | 准备 Sonarr/Radarr staging 预览 |
| `cinerename pre-arr apply <路径> --to <staging>` | Headless | 将安全匹配的媒体移动到 staging 目录 |
| `cinerename benchmark large-import --files 2000` | Headless | 运行受控本地假导入 benchmark |
| `cinerename web --host 127.0.0.1 --port 8787 --allowed-root <dir>` | Headless | 启动本地 WebUI |
| `cinerename tui <路径>` | Headless | 启动终端 UI |

全局标志：
- `--json`：输出结构化 JSON（调度器模式下输出 JSON Lines）
- `--config-dir <dir>`：覆盖 CineRename 配置目录（Headless）
- `--cache-dir <dir>`：覆盖 CineRename 缓存目录（Headless）

## Desktop 与 Headless 示例

```bash
# 预览而不修改文件
cinerename preview /path/to/video.mkv

# 导出 dry-run 报告
cinerename preview /path/to/folder --export dry-run.csv

# 就地重命名
cinerename rename /path/to/folder

# 重命名并整理到媒体库
cinerename organize /path/to/downloads --to /media/Library

# 重命名、整理并搜索字幕
cinerename auto /path/to/downloads --to /media/Library --subs zh

# 在 NAS 上每 15 分钟运行一次
cinerename schedule /path/to/downloads --every 15m --to /media/Library --subs zh
```

## Headless 示例

这些命令需要 NAS/headless build。

```bash
# 撤销最新可恢复批次
cinerename history undo-last

# 审计媒体库
cinerename audit /media/Library --profile plex --export audit.md --format markdown
```

## Headless：Sonarr / Radarr Pre-Arr

Pre-Arr 是保守的 staging 模式。它只会自动 staging CineRename 认为安全且 ready 的文件。

```bash
cinerename pre-arr preview /path/to/downloads --profile sonarr --json
cinerename pre-arr apply /path/to/downloads --profile radarr --to /path/to/staging
```

请先使用 preview。只有当计划正确时才 apply。

## Headless：字幕工具

```bash
cinerename subtitles convert episode.ass --to srt --output episode.srt
cinerename subtitles shift movie.zh.srt --ms 750 --output movie.zh.shifted.srt
cinerename subtitles drift movie.zh.srt --first-ms 0 --last-ms 1250 --output movie.zh.fixed.srt
```

这些命令只在本地调整字幕文件。它们不保证无需预览即可获得完美音频同步。

## Headless：WebUI 配置与安全

WebUI API 始终受 token 保护，并且必须通过 `--allowed-root <DIR>` 限制文件系统访问范围（至少指定一个）。

在本地环回接口 (`127.0.0.1`) 上，如果未配置 token，CineRename 会自动生成一个随机 token 并输出到 stderr（绝不会出现在 URL 或 JSON 输出中）。

WebUI 仅使用纯 HTTP。如果绑定到非本地环回地址 (`0.0.0.0`)，必须显式传递 `--insecure-http`（且应置于 HTTPS 反向代理之后），并由管理员提供至少 32 字节的 token（通过 `--token-file`、`--token` 或 `CINERENAME_WEB_TOKEN` 环境变量）：

```bash
# 本地 localhost WebUI
cinerename web --host 127.0.0.1 --port 8787 --allowed-root /media/Library

# 非环回地址（置于 HTTPS 反向代理后）
openssl rand -hex 32 > /secure/cinerename-web.token
chmod 600 /secure/cinerename-web.token
cinerename web --host 0.0.0.0 --port 8787 --insecure-http \
  --allowed-root /media/Library \
  --token-file /secure/cinerename-web.token
```

请妥善保管此 token。

## NAS Scheduler 示例

```txt
*/15 * * * * /volume1/@appstore/cinerename/cinerename auto /volume1/video/Inbox --to /volume1/video/Library --subs zh --json >> /var/log/cinerename.log 2>&1
```

对于长期运行的 Docker 容器，请使用 `schedule` 或 `web`，而不是 cron。

## 故障排除

- 在大型自动运行前先使用 `preview`。
- 如果 provider 不可用，请稍后重新 preview，或在桌面应用中手动选择结果。
- 如果 NAS 路径失败，请检查文件所有权和挂载权限。
- 需要支持时，请从 Support 页面复制日志，或在邮件中附上 CLI 输出。
