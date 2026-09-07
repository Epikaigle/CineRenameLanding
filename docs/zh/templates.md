# 命名模板

CineRename 中的每个重命名预设都有一种**语言**模式：历史悠久的占位符引擎 (简单且易读) 或用于高级模式的沙盒 **JavaScript** 评估器。

偏好设置 → **命名模板 (Naming templates)** → 编辑器上方的 `Tokens (占位符)` / `JavaScript` 按钮。

## Tokens 模式 (默认)

简单的 `{token}` → 值替换。涵盖了绝大多数用例。

```text
{title} ({year})
{title} - S{season}E{episode} - {episode_title}
{title} - {absolute_episode} - {episode_title}
{title} [{resolution} {video_codec}]
```

可用变量：
- **核心 token**：`{title}`, `{year}`, `{season}`, `{episode}`, `{absolute_episode}`, `{episode_title}`, `{tmdb_id}`, `{tvdb_id}`, `{imdb_id}`, `{plex}`, `{plex.id}`
- **高级 token**：`{resolution}`, `{source}`, `{video_codec}`, `{audio_codec}`, `{audio_language}`, `{dynamic_range}`, `{bit_depth}`

::: tip 导入 legacy 格式
**Import legacy format** 按钮可以把常见 token 风格模式（`{n} ({y})/{n} - {s00e00} - {t}`）转换成 CineRename 模式。`${...}` 块和自定义条件会被标记为需要人工检查，也可以改写为 JavaScript 模式。
:::

## JavaScript 模式

模板模式会被视为 **JavaScript 表达式**，在内置的 QuickJS 沙盒中进行计算：

- 无法访问文件系统、网络、计时器或危险的全局变量
- 完整的 ES2020 支持：三元运算符、正则表达式、闭包、箭头函数、字符串方法、模板字面量 (template literals)
- 重命名上下文作为**全局变量**暴露
- 表达式返回的值将成为文件名
- **快速**：在本地受限 QuickJS runtime 中即时执行

### 暴露的变量

```text
title, year, season, episode, absolute_episode,
episode_title, resolution, source, video_codec,
audio_codec, audio_language, dynamic_range, bit_depth,
tmdb_id, tvdb_id, imdb_id, plex, plex_id, media_kind
```

数值类型（`year`, `season`, `episode`, `absolute_episode`）是**数字 (numbers)**（或 `null`）。`media_kind` 为 `"movie"`、`"series"` 或 `"anime"`。其余变量（包括 `bit_depth`，例如 `"10-bit"`）均为**字符串 (strings)**，如果未提供则为 `null`。

### 变量的典型值

为了帮助您在 JavaScript 中编写 `if / else` 条件，以下是内部解析器返回的典型值：

| 变量 | 可能的值 (示例) |
| --- | --- |
| `resolution` | `2160p`, `1080p`, `720p`, `480p` |
| `video_codec` | `x264`, `x265`, `AV1`, `MPEG-2` |
| `audio_codec` | `AAC`, `AC3`, `EAC3`, `DTS`, `DTS-HD MA`, `TrueHD`, `FLAC` |
| `dynamic_range`| `SDR`, `HDR10`, `HDR10+`, `Dolby Vision` |
| `source` | `BluRay`, `WEBRip`, `WEB-DL`, `HDTV`, `DVD` |

### 提供的辅助函数 (Helpers)

| 辅助函数 | 效果 |
| :--- | :--- |
| `pad(value, width)` | 给数字补零 (例如 `pad(2, 3)` → `"002"`) |
| `s00e00(season, episode)` | 格式化为 `"S01E02"` |
| `nonEmpty(...args)` | 返回第一个非空的参数 |
| `joinNonEmpty(separator, ...args)` | 使用分隔符拼接非空的参数 |

### 示例

**关于动态范围 (dynamic range) 的条件拼接：**
```js
title + ' (' + year + ')' + (dynamic_range === 'HDR10' ? ' [HDR]' : '')
```

**"The Wire" → "Wire, The" 的重排序：**
```js
title.replace(/^The\s+/, '') + ', The - ' + s00e00(season, episode)
```

**清理非法字符：**
```js
title.replace(/[:?]/g, '').trim() + ' (' + year + ')'
```

**根据分辨率添加 HD/SD 后缀：**
```js
title + ' [' + (parseInt(resolution) >= 1080 ? 'HD' : 'SD') + ']'
```

**对 Plex 友好的格式，具有 fallback 剧集标题：**
```js
title + ' - ' + s00e00(season, episode) +
  (episode_title ? ' - ' + episode_title : '')
```

**使用绝对集数和 fallback 属性的动漫：**
```js
title + ' - ' + pad(absolute_episode, 3) +
  joinNonEmpty(' - ', episode_title, resolution)
```

### 安全性

QuickJS 沙盒**不暴露任何 I/O API**：没有 `fetch`，没有 `require`，没有 `process`，没有 `Deno`，没有 `setTimeout`。唯一可能的“副作用”是返回一个字符串（或者抛出一个异常，这会将该行标记为需要审查）。

语法错误在**保存时被检测**：点击 Save 按钮会在将表达式持久化到数据库之前对其进行解析验证。

### 限制

- **没有无限递归**：QuickJS 会中断过长的循环，但实际上一个模板应该在几微秒内执行完毕。
- **调用之间没有状态 (No state)**：每次渲染都是在一个新的沙盒中进行 —— 您无法在两个文件之间记录状态（例如计数器）。
- **无法访问批次中的其他文件**：模板只能看到其自身的上下文。

对于需要全局上下文的转换（例如整个批次的顺序编号等），请使用 **CLI** 并在其外部包装一个 shell 脚本。

## 如何迁移常见 legacy tokens

| Legacy token / expression | CineRename (JavaScript) |
| :--- | :--- |
| `{n}` | `title` |
| `{y}` | `year` |
| `{s00e00}` | `s00e00(season, episode)` |
| `{t}` | `episode_title` |
| `{vf}` | `resolution` |
| `{vc}` | `video_codec` |
| `{ac}` | `audio_codec` |
| `${audio.lang == 'fr' ? 'VF' : 'VO'}` | `(audio_language === 'fr' ? 'VF' : 'VO')` |
| `{n.replaceAll(/X/, 'Y')}` | `title.replace(/X/g, 'Y')` |
| `{n.startsWith('The ') ? n.replaceFirst('^The ', '') + ', The' : n}` | `title.startsWith('The ') ? title.replace(/^The /, '') + ', The' : title` |

::: warning 未暴露的字段
某些媒体技术字段（整体码率，帧率，音频声道数）目前尚未暴露给 CineRename 的 JS 沙盒。如果您需要它们，请通过电子邮件与我们联系，可以将它们添加到 `RenameTemplateContext` 中。
:::
