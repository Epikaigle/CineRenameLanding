# Watch Folders

CineRename can monitor folders in the background and **auto-import any new video that appears there** into the Studio. Ideal for download folders, NAS reception, or Sonarr / Radarr Inbox.

## Configuration

In **Preferences → Watch folders**:

1. Click on **Add a folder**
2. Select the folder to watch (recursive by default)
3. The folder appears in the list, with an **Active** badge

You can **pause** a folder (the watcher stops but the config remains) or **remove** it completely.

## Behavior

When a new media file (supported video extensions + subtitles) appears in an active folder:

1. The disk watcher (based on `notify` on the Rust side) detects the event.
2. A debouncing of **1.5 s** is applied, followed by automated file stability checks (monitoring size and modification timestamps) to avoid reading files that are still being written by a downloader.
3. The new paths are sent to the Studio as a normal import (equivalent to a drag-and-drop).
4. If the **Automation** trigger is active, the pipeline can run after import.
5. A status notification confirms: *"3 new file(s) detected in 'Downloads' — imported to Studio."*

## Alternative for Headless Servers (NAS)

For continuous monitoring on a **NAS without a graphical interface (GUI)**, the desktop app's watcher is not suitable.

The official solution is to use the CineRename headless CLI coupled with a Cron task or the built-in `schedule` command:

1. Connect via SSH to your NAS.
2. Edit the cron file: `crontab -e`
3. Add a line to check the folder every 5 minutes:
   ```bash
   */5 * * * * /usr/local/bin/cinerename auto /mnt/Downloads --to /mnt/Library --json >> /var/log/cinerename.log 2>&1
   ```
   Or run the daemon scheduler directly (e.g. inside Docker or a systemd service):
   ```bash
   cinerename schedule /mnt/Downloads --every 5m --to /mnt/Library --json
   ```

This method is much more robust for 24/7 servers, as it autonomously launches processing at regular intervals. See [Command Line (CLI)](/cli) for more details.

## Limitations

- **The watcher only runs when the desktop app is open.** If you close the window, the monitoring stops. For 24/7, see the Cron method above.
- **Rename events** (internal mv) are detected but trigger an import — if you manually rename an already imported file, expect a second import. The duplicate detector catches these cases.
- The watch does not extract archives — a `.zip` that appears is not decompressed automatically. Import it manually.

## Recommendations

- For a **download** folder: combine watch folders with **Automation** and a target (`/Plex/Series`) for a careful hands-free pipeline.
- For a **shared NAS** folder: let the main machine do the monitoring with the GUI open (or use the CLI on the NAS, which is more robust).
- To avoid premature imports: configure your downloader to use a **temporary folder** (`.partial`, `_incomplete`) and a separate **final folder**, and only watch the final one.
