# 自动化流水线

自动化流水线会把 CineRename 的主要操作串起来：**重命名、可选字幕、移动/整理**。它适合减少重复操作，但仍然保持谨慎：大型批处理建议先 dry-run，默认不覆盖，低置信度匹配会留给你检查。

## 流水线

当您选择**自动**时，CineRename 会针对每个文件执行以下步骤：

1. **识别**：静默查询 TheTVDB / TVmaze。如果文件太难识别，则跳过它而不是犯错。
2. **重命名**：应用默认的预设（例如 Plex）将其置于规范形式。
3. **字幕（可选）**：如果启用了该选项，将向 OpenSubtitles 查询请求的语言。哈希匹配优先，但仍建议预览重要文件。
4. **移动（可选）**：如果配置了目标库，文件及其附带的 `.srt` 将被移动或复制到最终位置（例如 `/Plex/Series`）。
5. **清理**：如果所有操作都成功，且原始文件夹中只剩下不需要的文件（`.nfo`, `.txt`, `.url`），并且配置了清理选项，则会删除该文件夹。

## 触发自动化流水线

### 1. 从界面触发

只需将文件拖放到主界面，然后选择 **自动处理此文件夹**，而不是打开 Studio。

您还可以通过 CLI：
```bash
cinerename auto /path/to/downloads --to /media/Plex --subs fr,en
```

### 2. 通过监控文件夹或下载客户端

如果您配置了监控文件夹（[参见监控文件夹](/zh/watch-folders)）或下载客户端导入（qBittorrent、Transmission、JDownloader），CineRename 可以导入完成的文件并按设置运行流水线。

## 处理冲突

如果在移动时目标位置已存在同名文件，自动化流水线会根据您的设置做出反应：

- **跳过（Skip）**：保留目标位置的文件，当前文件保留在原处。
- **覆盖（Overwrite）**：新的文件将覆盖旧的（当您获得更好画质的版本时很有用）。
- **保留两者（Both）**：将重命名新文件（例如加上 `(1)`）并在[重复项模块](/zh/duplicates)中触发一个提示，以便您稍后手动解决。

默认设置为**跳过**以确保安全。

## 典型用例

### 场景 1 — 简单的 NAS

1. 传输工具（Transmission）将内容下载到 `/mnt/nas/incoming/`
2. CineRename 监控 `/mnt/nas/incoming/`
3. 自动流水线：
   - 重命名
   - 下载 FR（法语）字幕
   - 移动到 `/mnt/nas/Plex/Films` 或 `/mnt/nas/Plex/Séries`
4. Plex 扫描 `/mnt/nas/Plex/` → 干净命名让内容更容易被识别

### 场景 2 — Sonarr 的后处理 (Post-process)

1. Sonarr 下载了一集
2. 结束时，Sonarr 调用脚本 `post-process.sh`
3. 该脚本运行 `cinerename auto $sonarr_episodefile_path --to /Plex/Séries --subs fr`
4. 无需手动操作

### 场景 3 — 家庭 Mac

1. 一位家庭成员将文件夹拖入 `~/Movies/Inbox`
2. 后台运行的 Mac 版 CineRename 监控该文件夹
3. 自动流水线将其移动到干净的 `~/Movies/Plex/...`

## 日志与支持

流水线及所有后台事件都会记录在 CineRename 标准应用日志中：

| 操作系统 / 模式 | 日志目录 |
| --- | --- |
| Windows (桌面版) | `%LOCALAPPDATA%\com.cinerename.desktop\logs\` |
| macOS (桌面版) | `~/Library/Logs/com.cinerename.desktop/` |
| Linux (桌面版) | `~/.local/share/com.cinerename.desktop/logs/` |
| Headless / NAS (Linux) | 标准输出 / 命令行重定向 (例如 `>> /var/log/cinerename.log 2>&1`) |

在桌面应用中，您可以通过 **偏好设置 → 支持 → 复制日志** 或 **显示日志文件夹** 快速查看或导出诊断信息。CLI/headless 用法则可通过标准重定向持久化日志。
