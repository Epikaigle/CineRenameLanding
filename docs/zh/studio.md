# Studio

**Studio** 是 CineRename 的主屏幕：您可以在这里预览并确认每一个重命名操作。所有破坏性操作首先都会经过它。

## 屏幕解剖

- **拖放区 (Drop zone)** — 位于中央，接受文件、文件夹和压缩包。
- **虚拟列表 (Virtual list)** — 流畅显示多达数千个文件而不卡顿（使用 Svelte 5 虚拟化技术）。
- **详细信息面板 (Details panel)** — 当您点击某一行时，会显示找到的元数据、备选项和输出格式。
- **操作 (Actions)** — **重命名 (Rename)**、**清除列表 (Clear list)**、**导出报告 (Export report)** 按钮。

## 媒体识别

CineRename 使用多通道启发式算法：

1. **文件名解析** — 季数/集数 (S01E02, 1x02, Episode 2…)、年份、质量、编解码器、语言。
2. **类型识别** — 电影、剧集、动漫 — 通过模式匹配 + 数据库。
3. **元数据查询** — 查询 TheTVDB 以获取电影/剧集信息，查询 TVmaze 以补充电视连续剧信息，查询内部数据库以获取动漫信息。
4. **评分** — 为所有候选结果打分。选择最佳匹配，其他选项在选择器中依然可用。

## 手动编辑

对于每个条目，您可以：

- **强制匹配** — 从候选列表中手动选择正确的电影/剧集。
- **编辑标题** — 纠正错别字，选择加长版 ("Director's Cut") 等。
- **忽略该行** — 将其从最终的重命名操作中排除（对于混入其中的 `.txt`, `.nfo` 文件很有用）。

## 命名预设

在 **偏好设置 → 命名模板 (Naming templates)** 中进行配置。每个模板都有一种**语言**模式：

| 模式 | 适用场景 |
| :--- | :--- |
| **Tokens (占位符)** | 简单的替换模式：`{title} - S{season}E{episode} - {episode_title}` — 涵盖了 95% 的用例。包含 legacy 格式导入器，可迁移现有 token 风格模式。 |
| **JavaScript** | 高级模式：三元运算符、正则表达式、闭包、字符串操作。内置的 QuickJS 引擎快速且沙盒化。请参阅 [JavaScript 模板](/zh/templates)。 |

可用变量：

| Tokens (占位符) | JavaScript | 描述 |
| --- | --- | --- |
| `{title}` | `title` | 媒体标题 |
| `{year}` | `year` | 发行年份 |
| `{season}` | `season` | 季号 (在 Tokens 模式下补零) |
| `{episode}` | `episode` | 集号 (在 Tokens 模式下补零) |
| `{absolute_episode}` | `absolute_episode` | 绝对集号 (在 Tokens 模式下补零) |
| `{episode_title}` | `episode_title` | 剧集标题 |
| `{tmdb_id}` | `tmdb_id` | TMDb 唯一标识符 |
| `{tvdb_id}` | `tvdb_id` | TheTVDB 唯一标识符 |
| `{imdb_id}` | `imdb_id` | IMDb 唯一标识符 |
| `{plex}` | `plex` | Plex 标准命名规范 |
| `{plex.id}` | `plex_id` | 包含媒体 ID 的 Plex 标准命名 |
| `{resolution}` | `resolution` | 分辨率 (`1080p`, `2160p`, `720p`…) |
| `{source}` | `source` | 片源 (`BluRay`, `WEB-DL`, `HDTV`…) |
| `{video_codec}` | `video_codec` | 视频编解码器 (`x264`, `x265`, `AV1`…) |
| `{audio_codec}` | `audio_codec` | 音频编解码器 (`AAC`, `AC3`, `EAC3`, `DTS`…) |
| `{audio_language}` | `audio_language` | 音频语言 (`fr`, `en`, `ja`…) |
| `{dynamic_range}` | `dynamic_range` | 动态范围 (`SDR`, `HDR10`, `Dolby Vision`…) |
| `{bit_depth}` | `bit_depth` | 位深 (`8-bit`, `10-bit`…) |
| — | `media_kind` | JS 媒体分类 (`"movie"`, `"series"` 或 `"anime"`) |

::: tip 兼容 Plex
默认预设针对 Plex 和 Jellyfin 进行了校准。如果您更改它，请使用您的媒体库扫描器验证文件是否仍然能被正确识别。
:::

## DVD / BluRay 线性配对

如果您导入的是光盘提取文件夹（`VTS_01_1.VOB`, `00001.m2ts`, `BDMV/STREAM/…`），Studio 会检测到这些文件，并在工具栏中显示一个 **线性配对… (Linear pairing…)** 按钮。

工作流如下：

1. 在元数据搜索栏中搜索剧集 (TheTVDB / TVmaze)
2. 选择正确的候选结果和相关的**季数**
3. (可选) 从第 1 集以外的集数开始 —— 这对于包含后半季内容的光盘很有用
4. (可选) 过滤掉**小片段** (`< 50 Mo`)，以忽略 DVD 菜单/片头
5. 点击 **生成计划 (Generate plan)** —— 每个文件（按字母顺序排序）将与 `episode[i]` 配对，并且当前批次将被结果替换

然后您像往常一样通过 **重命名 (Rename)** 按钮进行确认。

## 文件操作

在 **偏好设置 → 自动化** 中，选择您确认重命名时 CineRename 要执行的操作：

| 模式 | 效果 |
| --- | --- |
| **Move (移动)** (默认) | 将文件移动到新路径/重命名。经典行为。 |
| **Copy (复制)** | 复制文件，保持原文件不变。非常适合保留做种 (seedbox) 文件。 |
| **Hardlink (硬链接)** | 创建硬链接 —— 不占用额外的磁盘空间（要求在同一个文件系统上）。 |
| **Symlink (符号链接)** | 创建符号链接 —— 引用原始文件。 |

对于 Move (移动) 模式，通过历史记录执行撤销 (Undo) 会恢复原始名称。对于其他模式，原始文件保持不变，因此撤销仅删除创建的副本/链接。

## Checksums

选择一个或多个条目并点击 **计算 checksums (Calculate checksums)** 以生成 CRC32 / MD5 / SHA-1 / SHA-256 散列指纹，可导出为 sidecar 清单 (`.sfv`, `.md5`, `.sha1`, `.sha256`)。同一对话框中的 **验证清单… (Verify manifest…)** 按钮会重新读取现有的清单，并标记被篡改或缺失的文件。请参阅 [Checksums](/zh/checksums)。

## 安全性

- 在确认之前**没有磁盘写入操作**。
- **原子重命名** —— 如果文件无法重命名（权限问题，命名冲突），操作会干净地停止，不会留下处理了一半的文件。
- **冲突检测** —— 如果两个文件将产生相同的输出名称，CineRename 会拒绝继续并报告冲突。

## 键盘快捷键

| 操作 | Windows / Linux | macOS |
| --- | --- | --- |
| 全选 | <kbd>Ctrl</kbd> + <kbd>A</kbd> | <kbd>Cmd</kbd> + <kbd>A</kbd> |
| 开始重命名 | <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | <kbd>Cmd</kbd> + <kbd>Enter</kbd> |
| 清除列表 | <kbd>Ctrl</kbd> + <kbd>Backspace</kbd> | <kbd>Cmd</kbd> + <kbd>Delete</kbd> |
| 打开设置 | <kbd>Ctrl</kbd> + <kbd>,</kbd> | <kbd>Cmd</kbd> + <kbd>,</kbd> |
| 在文件列表中移动 | <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | 相同 |
| 选择当前聚焦的文件 | <kbd>Space</kbd> | 相同 |
| 打开当前文件的检查窗口 | <kbd>Enter</kbd> | 相同 |
| 打开当前文件菜单 | <kbd>Menu</kbd> 或 <kbd>Shift</kbd> + <kbd>F10</kbd> | 相同 |
