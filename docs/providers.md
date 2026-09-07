# API Providers And Secrets

CineRename can query several external providers, depending on the feature you use:

- **TheTVDB** — movies, TV series, seasons, episodes, localized titles, posters and artwork when available
- **TVmaze** — TV series fallback (open data, no key)
- **AniList** — anime lookup and absolute numbering support where available
- **Kitsu** — anime lookup fallback
- **OpenSubtitles** — search and download subtitles

For the application to work out of the box, CineRename can include bundled provider keys at build time. You do not need to configure your own keys for normal use, but personal keys can help if you process very large libraries or need your own quota.

## Why provide your own key?

- **Higher quotas** — useful for processing very large volumes
- **Dedicated quota** — useful for OpenSubtitles or TheTVDB heavy usage
- **CI / staging rotation** — teams testing in an isolated environment
- **Account-only features** — OpenSubtitles upload requires your own API key plus account credentials

## Resolution order

If multiple sources provide a key, CineRename uses the first one found according to this order:

1. **Runtime environment variable**
   - `CINERENAME_TVDB_API_KEY`
   - `CINERENAME_TVDB_SUBSCRIBER_PIN`
   - `CINERENAME_OPENSUBTITLES_API_KEY`
   - `CINERENAME_OPENSUBTITLES_USERNAME`
   - `CINERENAME_OPENSUBTITLES_PASSWORD`
   - `CINERENAME_OPENSUBTITLES_USER_AGENT`
2. **Override entered in Preferences → Sources and subtitles** (stored in the operating system secret vault/keyring when it is sensitive)
3. **`providers.toml` file** inside `<config-dir>/providers/`
4. **Default bundled key** compiled into the app

## Configure via the UI

**Preferences → Sources and subtitles**:

- TheTVDB: **API Key** and optional **Subscriber PIN**
- OpenSubtitles: **API Key** field + credentials (username/password) if you have a premium account

Sensitive values are stored with the system credential store/keyring when available, not in plain text in the local SQLite database. They never leave your machine except when sent to the provider they belong to.

## Configure via file

Create (or edit) `providers.toml` inside the `providers/` subfolder of your configuration directory:

| OS / Mode | Path |
| --- | --- |
| Windows (Desktop) | `%APPDATA%\com.cinerename.desktop\providers\providers.toml` |
| macOS (Desktop) | `~/Library/Application Support/com.cinerename.desktop/providers/providers.toml` |
| Linux (Desktop) | `~/.local/share/com.cinerename.desktop/providers/providers.toml` |
| Headless / NAS (Linux) | `~/.config/cinerename/providers/providers.toml` |

Format:

```toml
[thetvdb]
enabled = true
api_key = "your-tvdb-key"
subscriber_pin = "your-subscriber-pin"

[opensubtitles]
enabled = true
api_key = "your-opensubtitles-key"
username = "your-username"
password = "your-password"
user_agent = "CineRename"
```

## Custom build

To generate a CineRename binary with different keys (CI rotation, staging):

```bash
export CINERENAME_BUNDLED_TVDB_API_KEY="..."
export CINERENAME_BUNDLED_OPENSUBTITLES_API_KEY="..."
npm run dist
```



## Get your own keys

| Provider | How |
| --- | --- |
| **TheTVDB** | Create an account on [thetvdb.com](https://thetvdb.com/) → API → Subscriptions |
| **OpenSubtitles** | Create an account on [opensubtitles.com](https://www.opensubtitles.com/) → Consumers → New API consumer |
| **TVmaze** | No key required (public API, rate-limited to 20 req/s) |
| **AniList** | No key required for the public API features used by CineRename |
| **Kitsu** | No key required for the public API features used by CineRename |
