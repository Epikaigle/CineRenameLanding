# Studio

The **Studio** is the main screen of CineRename: this is where you preview and validate each renaming. Any destructive operation first goes through here.

## Screen anatomy

- **Drop zone** — in the center, accepts files, folders, and archives.
- **Virtual list** — displays up to thousands of files without slowdowns (Svelte 5 virtualization).
- **Details panel** — when you click on a row, displays found metadata, alternatives, and output format.
- **Actions** — buttons **Rename**, **Clear list**, **Export report**.

## Media recognition

CineRename uses a multi-pass heuristic:

1. **Filename parsing** — season/episode (S01E02, 1x02, Episode 2...), year, quality, codec, language.
2. **Type identification** — movie, series, anime — via patterns + databases.
3. **Metadata query** — TheTVDB for movies/series, TVmaze for TV series as a fallback, internal database for animes.
4. **Scoring** — all candidates are scored. The best one is selected, the others remain available in the selector.

## Manual editing

For each entry, you can:

- **Force a match** — manually select the right movie/episode among the candidates.
- **Edit the title** — typo, extended version ("Director's Cut")...
- **Ignore a row** — exclude from the final renaming (useful for `.txt`, `.nfo` that slipped in).

## Naming presets

Configure in **Preferences → Naming templates**. Each template has a **language**:

| Mode | When to use it |
| :--- | :--- |
| **Tokens** | Simple substitution patterns: `{title} - S{season}E{episode} - {episode_title}` — covers 95% of cases. Includes a legacy-format importer for existing token-style patterns. |
| **JavaScript** | Advanced patterns: ternaries, regex, closures, string manipulation. The embedded QuickJS engine is fast and sandboxed. See [JavaScript Templates](/templates). |

Variables available:

| Tokens | JavaScript | Description |
| --- | --- | --- |
| `{title}` | `title` | Media title |
| `{year}` | `year` | Release year |
| `{season}` | `season` | Season number (zero-padded in tokens) |
| `{episode}` | `episode` | Episode number (zero-padded in tokens) |
| `{absolute_episode}` | `absolute_episode` | Absolute episode number (zero-padded in tokens) |
| `{episode_title}` | `episode_title` | Episode title |
| `{tmdb_id}` | `tmdb_id` | TMDb identifier |
| `{tvdb_id}` | `tvdb_id` | TheTVDB identifier |
| `{imdb_id}` | `imdb_id` | IMDb identifier |
| `{plex}` | `plex` | Plex-standard naming |
| `{plex.id}` | `plex_id` | Plex-standard naming with media ID |
| `{resolution}` | `resolution` | Resolution (`1080p`, `2160p`, `720p`...) |
| `{source}` | `source` | Source (`BluRay`, `WEB-DL`, `HDTV`...) |
| `{video_codec}` | `video_codec` | Video codec (`x264`, `x265`, `AV1`...) |
| `{audio_codec}` | `audio_codec` | Audio codec (`AAC`, `AC3`, `EAC3`, `DTS`...) |
| `{audio_language}` | `audio_language` | Audio language (`fr`, `en`, `ja`...) |
| `{dynamic_range}` | `dynamic_range` | Dynamic range (`SDR`, `HDR10`, `Dolby Vision`...) |
| `{bit_depth}` | `bit_depth` | Bit depth (`8-bit`, `10-bit`...) |
| — | `media_kind` | Media category in JS (`"movie"`, `"series"`, or `"anime"`) |

::: tip Plex friendly
The default preset is calibrated for Plex and Jellyfin. If you change it, verify with your library scanner that the files are still recognized.
:::

## DVD / BluRay linear pairing

If you import a disc rip folder (`VTS_01_1.VOB`, `00001.m2ts`, `BDMV/STREAM/…`), the Studio detects these files and displays a **Linear pairing…** button in the toolbar.

The workflow:

1. Search for the series in the metadata search bar (TheTVDB / TVmaze)
2. Select the correct candidate and the relevant **season**
3. (Optional) Start at an episode other than 1 — useful for discs containing the second half of a season
4. (Optional) Filter **small fragments** (`< 50 MB`) to ignore DVD menus / intros
5. Click **Generate plan** — each file (sorted alphabetically) is paired to `episode[i]` and the current batch is replaced by the result

You then validate via the usual **Rename** button.

## File operations

In **Preferences → Automation**, choose what CineRename does when you validate a renaming:

| Mode | Effect |
| --- | --- |
| **Move** (default) | Moves the file to the new path / name. Classic behavior. |
| **Copy** | Copies the file keeping the original intact. Useful for preserving a seedbox. |
| **Hardlink** | Creates a hard link — zero extra bytes on the disk (same filesystem required). |
| **Symlink** | Creates a symbolic link — the original is referenced. |

For Move, undo via the History restores the original name. For other modes, the original is unchanged so undo simply deletes the created copy / link.

## Checksums

Select one or more entries and click **Calculate checksums** to generate CRC32 / MD5 / SHA-1 / SHA-256 hashes, exportable as a sidecar manifest (`.sfv`, `.md5`, `.sha1`, `.sha256`). The **Verify a manifest…** button in the same dialog rereads an existing manifest and flags altered or missing files. See [Checksums](/checksums).

## Security

- **No disk writes** before validation.
- **Atomic renaming** — if a file cannot be renamed (permissions, name conflict), the operation stops cleanly and nothing is left half-done.
- **Conflicts detected** — if two files would result in the same output name, CineRename refuses to continue and reports the conflict.

## Keyboard shortcuts

| Action | Windows / Linux | macOS |
| --- | --- | --- |
| Select all | <kbd>Ctrl</kbd> + <kbd>A</kbd> | <kbd>Cmd</kbd> + <kbd>A</kbd> |
| Start renaming | <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | <kbd>Cmd</kbd> + <kbd>Enter</kbd> |
| Clear the list | <kbd>Ctrl</kbd> + <kbd>Backspace</kbd> | <kbd>Cmd</kbd> + <kbd>Delete</kbd> |
| Open Settings | <kbd>Ctrl</kbd> + <kbd>,</kbd> | <kbd>Cmd</kbd> + <kbd>,</kbd> |
| Move through the file list | <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Same |
| Select the focused file | <kbd>Space</kbd> | Same |
| Open the focused file review | <kbd>Enter</kbd> | Same |
| Open the focused file menu | <kbd>Menu</kbd> or <kbd>Shift</kbd> + <kbd>F10</kbd> | Same |
