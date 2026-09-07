# Naming Templates

Each renaming preset in CineRename has a **language**: the historical token engine (simple and readable) or a sandboxed **JavaScript** evaluator for advanced patterns.

Preferences → **Naming templates** → `Tokens` / `JavaScript` button above the editor.

## Tokens Mode (default)

Simple substitution `{token}` → value. Covers the vast majority of cases.

```text
{title} ({year})
{title} - S{season}E{episode} - {episode_title}
{title} - {absolute_episode} - {episode_title}
{title} [{resolution} {video_codec}]
```

Available variables:
- **Core tokens**: `{title}`, `{year}`, `{season}`, `{episode}`, `{absolute_episode}`, `{episode_title}`, `{tmdb_id}`, `{tvdb_id}`, `{imdb_id}`, `{plex}`, `{plex.id}`
- **Advanced tokens**: `{resolution}`, `{source}`, `{video_codec}`, `{audio_codec}`, `{audio_language}`, `{dynamic_range}`, `{bit_depth}`

::: tip Import a legacy format
The **Import legacy format** button converts common token-style patterns (`{n} ({y})/{n} - {s00e00} - {t}`) into a CineRename pattern. `${...}` blocks and custom conditionals are flagged for manual review, or can be rewritten in JavaScript mode.
:::

## JavaScript Mode

The pattern is evaluated as a **JavaScript expression** in an embedded QuickJS sandbox:

- No filesystem, network, timers, or dangerous globals access
- Full ES2020: ternaries, regex, closures, arrow functions, string methods, template literals
- The rename context is exposed as **global variables**
- The value returned by the expression becomes the filename
- **Fast**: immediate execution inside a local, restricted QuickJS runtime

### Exposed variables

```text
title, year, season, episode, absolute_episode,
episode_title, resolution, source, video_codec,
audio_codec, audio_language, dynamic_range, bit_depth,
tmdb_id, tvdb_id, imdb_id, plex, plex_id, media_kind
```

Numeric values (`year`, `season`, `episode`, `absolute_episode`) are **numbers** (or `null`). `media_kind` is `"movie"`, `"series"`, or `"anime"`. The others (including `bit_depth`, e.g. `"10-bit"`) are **strings** or `null` if not provided.

### Typical variable values

To help you write your `if / else` conditions in JavaScript, here are the typical values returned by the internal parser:

| Variable | Possible values (examples) |
| --- | --- |
| `resolution` | `2160p`, `1080p`, `720p`, `480p` |
| `video_codec` | `x264`, `x265`, `AV1`, `MPEG-2` |
| `audio_codec` | `AAC`, `AC3`, `EAC3`, `DTS`, `DTS-HD MA`, `TrueHD`, `FLAC` |
| `dynamic_range`| `SDR`, `HDR10`, `HDR10+`, `Dolby Vision` |
| `source` | `BluRay`, `WEBRip`, `WEB-DL`, `HDTV`, `DVD` |

### Provided helpers

| Helper | Effect |
| :--- | :--- |
| `pad(value, width)` | Zero-pads a number (e.g. `pad(2, 3)` → `"002"`) |
| `s00e00(season, episode)` | `"S01E02"` format |
| `nonEmpty(...args)` | Returns the first non-empty argument |
| `joinNonEmpty(separator, ...args)` | Concatenates non-empty arguments with a separator |

### Examples

**Conditional concat on dynamic range:**
```js
title + ' (' + year + ')' + (dynamic_range === 'HDR10' ? ' [HDR]' : '')
```

**"The Wire" reordering → "Wire, The":**
```js
title.replace(/^The\s+/, '') + ', The - ' + s00e00(season, episode)
```

**Cleaning forbidden characters:**
```js
title.replace(/[:?]/g, '').trim() + ' (' + year + ')'
```

**HD/SD suffix based on resolution:**
```js
title + ' [' + (parseInt(resolution) >= 1080 ? 'HD' : 'SD') + ']'
```

**Plex-friendly with episode title fallback:**
```js
title + ' - ' + s00e00(season, episode) +
  (episode_title ? ' - ' + episode_title : '')
```

**Anime with absolute episode and fallback:**
```js
title + ' - ' + pad(absolute_episode, 3) +
  joinNonEmpty(' - ', episode_title, resolution)
```

### Security

The QuickJS sandbox exposes **no I/O API**: no `fetch`, no `require`, no `process`, no `Deno`, no `setTimeout`. The only possible "side effect" is returning a string (or throwing an exception, which flags the row for review).

Syntax errors are **detected on save**: the Save button validates by parsing the expression before persisting it to the database.

### Limits

- **No infinite recursion**: QuickJS cuts loops that are too long, but in practice a template should execute in a few µs.
- **No state between calls**: each render is a fresh sandbox — you cannot store a counter between two files.
- **No access to other files in the batch**: a template only sees its own context.

For transformations that require global context (sequential numbering over a whole batch, etc.), use the **CLI** wrapped in a shell script.

## How to migrate common legacy tokens

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

::: warning Unexposed symbols
Some technical media fields (overall bitrate, framerate, audio channels) are not yet exposed to the CineRename JS sandbox. If you need them, contact us by email — they can be added to `RenameTemplateContext`.
:::
