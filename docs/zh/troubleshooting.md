# 故障排除

## 应用程序无法启动

### Windows

- **SmartScreen 阻止执行**：点击 **更多信息** → **仍要运行**。应用程序将被添加到后续启动的信任列表中。
- **WebView2 错误**：请确保已安装 `Microsoft Edge WebView2 Runtime`（在 Windows 11 上预装，在较旧的 Windows 10 版本上需要手动安装）。

### macOS

- **“无法打开 CineRename，因为无法验证开发者”**：
  - **右键单击图标 → 打开**（仅需操作一次）
  - 或者：**系统偏好设置 → 隐私与安全性 → 仍要打开**

### Linux

- **AppImage 无法启动**：检查是否执行了 `chmod +x CineRename.AppImage`。如果错误提及 FUSE，请安装 `libfuse2`（在 Ubuntu 上执行 `sudo apt install libfuse2`）。
- **WebKit 错误**：在某些精简的发行版上，安装 `webkit2gtk-4.0` 或 `webkit2gtk-4.1`。

## Plex / Jellyfin 无法识别我的文件

1. 检查**文件夹结构**是否符合服务器的约定（请参阅 [Plex / Jellyfin / Emby](/zh/media-servers)）。
2. 检查**标题 + 年份**是否能被媒体服务器使用的提供商识别。如果不能，并且你的预设支持，可以显式添加 ID（例如 `{tmdb-12345}` 或 `{tvdb-12345}`）。
3. 执行**全面扫描**并强制更新元数据。
4. 如果以上都不起作用，请将文件移出媒体库，扫描，然后将文件移回，再次扫描 (Plex Dance)。

## 字幕未下载

- 在 **偏好设置 → 来源和字幕** 中检查您的 **OpenSubtitles API 密钥**。
- 对于非常罕见的文件，**视频哈希**可能找不到任何结果。此时会回退到元数据搜索 —— 请在 Studio 中检查是否已正确识别了标题 + 季数 + 集数。
- 检查**速率限制 (rate limit)**：OpenSubtitles 会根据您的计划限制每天的下载次数。

## 自动化流水线陷入循环

如果 CineRename 在每个周期都重复处理同一个文件：
- 检查**最终目标媒体库**是否不同于**源文件夹**。
- 监控程序 (watcher) 应该仅配置在源文件夹上。
- 如果您使用 `rsync` 推送文件到源文件夹，请确保在 CineRename 开始监控之前它已完成复制（建议使用一个名为 `.in-progress` 的子文件夹）。

## 重命名非常慢

- 在**机械硬盘**上，大规模操作受限于 I/O (磁盘读写速度)。处理 100 个文件大约需要 5-10 秒。
- 在**通过 SMB / NFS 挂载的 NAS** 上，网络延迟会成倍增加操作时间。对于非常大的卷，请在本地挂载共享文件夹（使用 sshfs / nfs 并加上 `noatime` 参数）。
- 从 **偏好设置 → 支持 → 复制日志** 复制较短时间窗口，用来确认慢的是扫描、提供商查询、字幕、图片还是磁盘操作。

## “拒绝访问”错误

- 在 **Windows** 上，以管理员身份运行应用程序（右键单击 → **以管理员身份运行**）。
- 在 **macOS** 上，Tauri v2 需要显式权限。进入 **系统偏好设置 → 隐私与安全性 → 完全磁盘访问权限**，并授权给 CineRename。
- 在 **Linux** 上，检查文件夹权限（`ls -la`）和用户所有权。

## 撤销 (Undo) 失败

请参阅 [历史记录与撤销](/zh/history#撤销的限制) 中的专用部分。常见原因：

- 文件在 CineRename 外部被手动删除
- 源卷未挂载
- 文件在被 CineRename 处理后又被重命名了

## 如何分享有用日志？

打开 **偏好设置 → 支持**，选择要复制的时间范围，然后点击 **复制日志**。建议只复制问题发生前后的短时间窗口，避免分享多天的个人路径。

CLI/headless 用法可以重新运行命令，并把终端输出重定向到文件。开发调试时也可以使用 `CINERENAME_LOG_LEVEL=debug`。

## 我的数据存储在哪里？

| 操作系统 / 模式 | 应用数据与配置 | 日志 |
| --- | --- | --- |
| Windows (桌面版) | `%APPDATA%\com.cinerename.desktop\` | `%LOCALAPPDATA%\com.cinerename.desktop\logs\` |
| macOS (桌面版) | `~/Library/Application Support/com.cinerename.desktop/` | `~/Library/Logs/com.cinerename.desktop/` |
| Linux (桌面版) | `~/.local/share/com.cinerename.desktop/` | `~/.local/share/com.cinerename.desktop/logs/` |
| Headless / NAS (Linux) | `~/.config/cinerename/` | 标准输出 / 终端重定向 |

在桌面应用中，您可以通过 **偏好设置 → 支持 → 显示日志文件夹** 快速打开日志目录。您可以删除这些文件夹以重新初始化（将清空本地历史、缓存和预设）。

## 我没有找到我想要的答案

- 请写信给 [cinerename@gmail.com](mailto:cinerename@gmail.com)，并附上：
  - 您的操作系统和 CineRename 的版本
  - 问题的精确描述
  - 最好能提供日志（`偏好设置 → 支持 → 复制日志`）
