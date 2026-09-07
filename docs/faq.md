# FAQ

## What systems does CineRename run on?

CineRename is a native application for **Windows 10/11**, **macOS 11+** and **Linux**. Linux desktop builds are prepared as AppImage, deb and rpm packages, and separate headless builds are prepared for NAS / Docker usage.

## Do my files leave my computer?

**No.** File analysis, renaming, moving, checksum calculation and subtitle timing tools run locally. Network requests only go to the configured metadata/subtitle providers, such as TheTVDB, TVmaze, AniList, Kitsu or OpenSubtitles, and contain titles, IDs, language choices or the OpenSubtitles file fingerprint — never the video file itself.

## Can I undo a mistaken renaming?

Yes. The [History](/history) tab keeps track of every operation and lets you undo it in one click, even days later.

## Is CineRename compatible with Plex / Jellyfin / Emby / Kodi?

Yes. CineRename includes ready-to-use Plex, Jellyfin and Kodi profiles. Emby generally follows Jellyfin-style naming, so those outputs are compatible too. See [Plex / Jellyfin / Emby](/media-servers) for details.

## Does CineRename support ZIP / RAR files?

Yes, with one important detail: CineRename extracts supported archives to a local cache before processing the video files. It does not rename files in place inside the compressed archive.

The desktop app supports ZIP, RAR, 7z, tar, gzip, bzip2 and xz families. The static headless/NAS build intentionally excludes RAR for portability, but keeps ZIP, 7z, tar, gzip, bzip2 and xz.

*(Note: Password-protected archives are not supported. Furthermore, extracting very large archives can take time and temporarily require double the disk space).*

## Is there a CLI?

Yes. See the [CLI](/cli) page. Available on all three OS, perfect for automating via Sonarr / Radarr / cron / NAS scripts.

## Is there a difference between Free and Pro?

| Feature | Free | Pro |
| --- | --- | --- |
| Studio (renaming) | ✅ 2 files / day | ✅ unlimited |
| Before / After preview | ✅ | ✅ |
| Basic metadata matching | ✅ | ✅ |
| OpenSubtitles subtitle searches | ✅ 2 searches / day | ✅ unlimited |
| Multi-quality duplicates | ❌ | ✅ |
| Auto pipeline mode | ❌ | ✅ |
| Priority support | ❌ | ✅ |
| CLI / headless commands | ⚠️ same free limits | ✅ |

See the [Pricing](/pro) page for details on the Pro license.

## Can I continue using CineRename for free?

Yes. The free version has **no time limit**. You can use it indefinitely to rename or add subtitles to **up to 2 files per day**. Full and unlimited features require activating a Pro license.

## How does duplicate hunting work?

CineRename detects multiple copies of the same movie/episode based on:

- title + year (movies) or series + season + episode (series)
- resolution, codec, source, bitrate, audio, size to score the quality

It prompts you to keep the best version. No deletion without validation. See [Duplicates](/duplicates).

## Can CineRename work 100% offline?

Yes and no. The application itself (the interface, native Rust filename parsing, JavaScript template evaluation via QuickJS, history, local duplicate cleaning) works completely without an internet connection.

However, the matching features (fetching official titles, IDs and episode numbers) require querying the configured metadata provider. Without internet, CineRename will clean the filename via its native internal parser, but it won't be able to guarantee the full official title. Downloading subtitles is, of course, impossible offline.

## What happens if TheTVDB / OpenSubtitles is down?

CineRename continues to function:
- **Renames already previewed** in the Studio can be validated (metadata is cached).
- **New files** display a warning in case of missing hits — you can still rename them manually.
- The **auto mode** logs the error safely; you can rerun the preview or pipeline when the provider returns.

## I found a bug. How can I report it?

Write to [cinerename@gmail.com](mailto:cinerename@gmail.com). Include if possible:

- Your OS and CineRename version (`Preferences → Support → Copy Config`)
- An example of a problematic filename
- The log (`Preferences → Support → Copy Logs`)

## How can I contribute?

- **Report bugs** or request features by email
- **Suggest improvements** to naming presets
- **Translate the interface** into a new language
- **Buy a Pro license** directly supports development
