# Automation Pipeline

The **automation pipeline** chains together the main functions of CineRename:

```
Source folder  →  renaming  →  subtitles  →  moving  →  final library
```

It is useful for processing a downloads folder with less manual work. Risky actions stay conservative: preview first, no overwrite by default, and only confident matches should move automatically.

## Who is it for

- **Plex / Jellyfin users** who want new files to land automatically well-named and with subtitles.
- **NAS Admins** who script Sonarr / Radarr post-processing.
- **Seedbox users** who pull downloads to a remote library.

## Configuration

In **Preferences → Automation**:

| Option | Description |
| --- | --- |
| **Automatic trigger** | Run the pipeline after imports when enabled |
| **Pipeline strategy** | Rename only, rename and move, or rename/move/subtitles |
| **Destination root** | Final library or staging folder, for example `/media/Plex` |
| **Movie / series / anime folders** | Optional subfolders used when organizing by media type |
| **Subtitle language** | Preferred subtitle language for automated subtitle steps |
| **Move options** | Move, copy, hardlink, or symlink depending on your workflow |
| **Download clients** | qBittorrent, Transmission, or JDownloader import settings |
| **Dry-run by default** | Recommended for download-client imports and large unattended runs |

## Run the pipeline

Four ways:

1. **From the Studio** — **Run pipeline** button on the loaded files.
2. **From the CLI** — `cinerename auto /path --to /Plex/...` (see [CLI](/cli)).
3. **In the background** — watch folders can import new files, and the automation trigger can process them if enabled.
4. **Headless/WebUI** — the NAS build can run scheduled or token-protected server workflows.

## Security

The auto mode respects the same guarantees as the Studio:

- **Preview-first flow** — run a dry-run before large or unattended operations.
- **No overwrite** by default — `keep both` mode is selected if nothing is specified.
- **Reversible** — each operation is tracked individually in the [History](/history), therefore undoable.
- **Quarantine for uncertainty** — low-confidence download-client items stay in review instead of being moved silently.

::: warning Surveillance and torrent workflows
If you watch a folder where torrents write during download (`*.part`, `.!ut`), point CineRename at the downloader's completed/final folder or enable a staging flow. Otherwise it may see incomplete files before the downloader has finished.
:::

## Example Scenarios

### Scenario 1 — Seedbox pull to NAS

1. `rsync` pulls `seedbox:downloads/` to `/mnt/nas/incoming/`
2. CineRename watches `/mnt/nas/incoming/`
3. Automation pipeline:
   - renames
   - downloads EN subtitles
   - moves to `/mnt/nas/Plex/Movies` or `/mnt/nas/Plex/Series`
4. Plex scans `/mnt/nas/Plex/` → content recognized instantly

### Scenario 2 — Sonarr post-processing

1. Sonarr downloads an episode
2. At the end, Sonarr calls a script `post-process.sh`
3. This script runs `cinerename auto $sonarr_episodefile_path --to /Plex/Series --subs en`
4. No manual action required

### Scenario 3 — Family Mac

1. A family member drags a folder into `~/Movies/Inbox`
2. CineRename Mac, running in the background, watches this folder
3. Auto pipeline moves it to a clean `~/Movies/Plex/...`

## Logs And Support

All pipeline and background events are recorded in the standard CineRename application logs:

| OS / Mode | Log Directory |
| --- | --- |
| Windows (Desktop) | `%LOCALAPPDATA%\com.cinerename.desktop\logs\` |
| macOS (Desktop) | `~/Library/Logs/com.cinerename.desktop/` |
| Linux (Desktop) | `~/.local/share/com.cinerename.desktop/logs/` |
| Headless / NAS (Linux) | Standard output / redirect via shell (e.g. `>> /var/log/cinerename.log 2>&1`) |

In the desktop application, you can access logs directly via **Preferences → Support → Copy Logs** or **Show Logs Folder** to inspect recent activity or report an issue. On CLI/headless runs, redirect stdout/stderr to your desired persistent log destination.
