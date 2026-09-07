# Command Line And Headless Usage

CineRename includes command-line tools for NAS, Docker, server scripts, and cautious automation.

## Installation

CineRename has two command-line surfaces:

- **Desktop CLI**: included with the desktop app binary. It supports the core workflows: `preview`, `rename`, `organize`, `auto`, and `schedule`.
- **Headless/NAS CLI**: included in NAS/headless archives. It supports the core workflows plus server tools such as `audit`, `nfo`, `subtitles`, `download-client`, `pre-arr`, `web`, and `tui`.

If a command below is marked **headless**, use the NAS/headless archive rather than the desktop app binary.

NAS release formats:

| Architecture | Artifact |
| :--- | :--- |
| Intel / AMD 64-bit | Linux x64 NAS archive |
| ARM 64-bit | Linux arm64 NAS archive |

Extract the archive, then run commands from the extracted folder.

## Help

```bash
cinerename --help
cinerename preview --help
cinerename auto --help
```

## Main Commands

| Command | Available in | Action |
| --- | --- | --- |
| `cinerename preview <path>` | Desktop + headless | Shows the before/after preview without changing files |
| `cinerename rename <path>` | Desktop + headless | Renames files in place |
| `cinerename organize <path> --to <library>` | Desktop + headless | Renames and moves files into a library |
| `cinerename auto <path> --to <library> [--subs en]` | Desktop + headless | Runs the careful pipeline: rename, organize, optional subtitles |
| `cinerename schedule <path> --every 15m --to <library>` | Desktop + headless | Repeats a workflow on an interval |
| `cinerename history list` | Headless | Lists recent rename batches |
| `cinerename history undo-last` | Headless | Undoes the newest restorable batch |
| `cinerename history undo <batch-id>` | Headless | Undoes a specific batch |
| `cinerename history export --output <path>` | Headless | Exports history to CSV, JSON, or Markdown |
| `cinerename audit <path> --profile plex` | Headless | Audits a Plex/Jellyfin/Kodi-style library |
| `cinerename nfo <path> --profile kodi --write` | Headless | Generates NFO metadata explicitly |
| `cinerename subtitles convert <file> --to srt` | Headless | Converts subtitle formats |
| `cinerename subtitles shift <file> --ms 750` | Headless | Applies a fixed subtitle offset |
| `cinerename subtitles drift <file> --first-ms 0 --last-ms 1250` | Headless | Applies a simple linear drift fix |
| `cinerename download-client test qbittorrent --url <url>` | Headless | Tests a download-client endpoint |
| `cinerename download-client import <client> --url <url>` | Headless | Simulates or applies download client imports |
| `cinerename pre-arr preview <path> --profile sonarr` | Headless | Prepares a safe Sonarr/Radarr staging preview |
| `cinerename pre-arr apply <path> --to <staging>` | Headless | Moves safe matched media to a staging directory |
| `cinerename benchmark large-import --files 2000` | Headless | Runs a controlled fake-import benchmark |
| `cinerename web --host 127.0.0.1 --port 8787 --allowed-root <dir>` | Headless | Starts the local WebUI |
| `cinerename tui <path>` | Headless | Starts the terminal UI |

Global flags:
- `--json`: Emit machine-readable JSON output (JSON Lines in scheduler mode)
- `--config-dir <dir>`: Override the CineRename configuration directory (Headless)
- `--cache-dir <dir>`: Override the CineRename cache directory (Headless)

## Desktop And Headless Examples

```bash
# Preview without touching files
cinerename preview /path/to/video.mkv

# Export a dry-run report
cinerename preview /path/to/folder --export dry-run.csv

# Rename in place
cinerename rename /path/to/folder

# Rename and organize into a media library
cinerename organize /path/to/downloads --to /media/Library

# Rename, organize, and search French subtitles
cinerename auto /path/to/downloads --to /media/Library --subs fr

# Run every 15 minutes on a NAS
cinerename schedule /path/to/downloads --every 15m --to /media/Library --subs fr
```

## Headless Examples

These commands require the NAS/headless build.

```bash
# Undo the latest restorable rename batch
cinerename history undo-last

# Audit a library
cinerename audit /media/Library --profile plex --export audit.md --format markdown
```

## Headless: Pre-Arr For Sonarr / Radarr

Pre-Arr is a conservative staging mode. It only stages files that CineRename considers safe and ready.

```bash
cinerename pre-arr preview /path/to/downloads --profile sonarr --json
cinerename pre-arr apply /path/to/downloads --profile radarr --to /path/to/staging
```

Use the preview first. Apply only when the plan looks correct.

## Headless: Subtitle Tools

```bash
cinerename subtitles convert episode.ass --to srt --output episode.srt
cinerename subtitles shift movie.fr.srt --ms 750 --output movie.fr.shifted.srt
cinerename subtitles drift movie.fr.srt --first-ms 0 --last-ms 1250 --output movie.fr.fixed.srt
```

These commands adjust subtitle files locally. They do not guarantee perfect audio synchronization without previewing the result.

## Headless: WebUI Configuration and Security

The WebUI API is always token-protected and requires at least one `--allowed-root <DIR>` to bound filesystem access.

On loopback (`127.0.0.1`), if no token is provided, CineRename generates a random token and prints it to stderr (never in URLs or JSON output).

The WebUI only serves plain HTTP. Binding to a non-loopback address (`0.0.0.0`) requires `--insecure-http` (behind an HTTPS reverse proxy) and an operator-provided token of at least 32 bytes (via `--token-file`, `--token`, or `CINERENAME_WEB_TOKEN`):

```bash
# Localhost WebUI
cinerename web --host 127.0.0.1 --port 8787 --allowed-root /media/Library

# Non-loopback behind an HTTPS reverse proxy
openssl rand -hex 32 > /secure/cinerename-web.token
chmod 600 /secure/cinerename-web.token
cinerename web --host 0.0.0.0 --port 8787 --insecure-http \
  --allowed-root /media/Library \
  --token-file /secure/cinerename-web.token
```

Keep this token private.

## NAS Scheduler Example

```txt
*/15 * * * * /volume1/@appstore/cinerename/cinerename auto /volume1/video/Inbox --to /volume1/video/Library --subs fr --json >> /var/log/cinerename.log 2>&1
```

For a long-running Docker container, use `schedule` or `web` instead of cron.

## Troubleshooting

- Use `preview` before any large automated run.
- If a provider is unavailable, rerun the preview later or select a match manually in the desktop app.
- If a path fails on NAS, check file ownership and mount permissions.
- For support, copy logs from the desktop Support screen or attach the CLI output to your email.
