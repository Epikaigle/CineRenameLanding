# Ligne De Commande Et Usage Headless

CineRename inclut des outils en ligne de commande pour NAS, Docker, scripts serveur et automatisation prudente.

## Installation

CineRename a deux surfaces CLI :

- **CLI desktop** : incluse avec le binaire de l'app desktop. Elle prend en charge les workflows principaux : `preview`, `rename`, `organize`, `auto` et `schedule`.
- **CLI headless/NAS** : incluse dans les archives NAS/headless. Elle prend en charge les workflows principaux plus les outils serveur : `audit`, `nfo`, `subtitles`, `download-client`, `pre-arr`, `web` et `tui`.

Si une commande ci-dessous est marquée **headless**, utilisez l'archive NAS/headless plutôt que le binaire desktop.

Formats NAS :

| Architecture | Artefact |
| :--- | :--- |
| Intel / AMD 64-bit | archive NAS Linux x64 |
| ARM 64-bit | archive NAS Linux arm64 |

Extrayez l'archive, puis lancez les commandes depuis le dossier extrait.

## Aide

```bash
cinerename --help
cinerename preview --help
cinerename auto --help
```

## Commandes Principales

| Commande | Disponible dans | Action |
| --- | --- | --- |
| `cinerename preview <chemin>` | Desktop + headless | Affiche l'aperçu avant/après sans modifier les fichiers |
| `cinerename rename <chemin>` | Desktop + headless | Renomme les fichiers sur place |
| `cinerename organize <chemin> --to <bibliotheque>` | Desktop + headless | Renomme et déplace les fichiers vers une bibliothèque |
| `cinerename auto <chemin> --to <bibliotheque> [--subs fr]` | Desktop + headless | Lance le pipeline prudent : renommage, classement, sous-titres optionnels |
| `cinerename schedule <chemin> --every 15m --to <bibliotheque>` | Desktop + headless | Répète un workflow à intervalle régulier |
| `cinerename history list` | Headless | Liste les lots de renommage récents |
| `cinerename history undo-last` | Headless | Annule le dernier lot restaurable |
| `cinerename history undo <batch-id>` | Headless | Annule un lot précis |
| `cinerename history export --output <chemin>` | Headless | Exporte l'historique en CSV, JSON ou Markdown |
| `cinerename audit <chemin> --profile plex` | Headless | Audite une bibliothèque Plex/Jellyfin/Kodi |
| `cinerename nfo <chemin> --profile kodi --write` | Headless | Génère explicitement les fichiers NFO |
| `cinerename subtitles convert <fichier> --to srt` | Headless | Convertit les formats de sous-titres |
| `cinerename subtitles shift <fichier> --ms 750` | Headless | Applique un décalage fixe aux sous-titres |
| `cinerename subtitles drift <fichier> --first-ms 0 --last-ms 1250` | Headless | Applique une correction de drift linéaire simple |
| `cinerename download-client test qbittorrent --url <url>` | Headless | Teste un client de téléchargement |
| `cinerename download-client import <client> --url <url>` | Headless | Simule ou applique les imports de clients de téléchargement |
| `cinerename pre-arr preview <chemin> --profile sonarr` | Headless | Prépare un aperçu de staging Sonarr/Radarr |
| `cinerename pre-arr apply <chemin> --to <staging>` | Headless | Déplace les médias reconnus vers un dossier de staging |
| `cinerename benchmark large-import --files 2000` | Headless | Lance un benchmark local contrôlé |
| `cinerename web --host 127.0.0.1 --port 8787 --allowed-root <dossier>` | Headless | Démarre la WebUI locale |
| `cinerename tui <chemin>` | Headless | Démarre l'interface terminal |

Options globales :
- `--json` : Génère une sortie JSON structurée (JSON Lines en mode scheduler)
- `--config-dir <dossier>` : Surcharge le répertoire de configuration CineRename (Headless)
- `--cache-dir <dossier>` : Surcharge le répertoire de cache CineRename (Headless)

## Exemples Desktop Et Headless

```bash
# Prévisualiser sans toucher aux fichiers
cinerename preview /chemin/vers/video.mkv

# Exporter un rapport dry-run
cinerename preview /chemin/vers/dossier --export dry-run.csv

# Renommer sur place
cinerename rename /chemin/vers/dossier

# Renommer et classer dans une bibliothèque
cinerename organize /chemin/vers/telechargements --to /media/Library

# Renommer, classer et chercher des sous-titres français
cinerename auto /chemin/vers/telechargements --to /media/Library --subs fr

# Lancer toutes les 15 minutes sur un NAS
cinerename schedule /chemin/vers/telechargements --every 15m --to /media/Library --subs fr
```

## Exemples Headless

Ces commandes nécessitent le build NAS/headless.

```bash
# Annuler le dernier lot restaurable
cinerename history undo-last

# Auditer une bibliothèque
cinerename audit /media/Library --profile plex --export audit.md --format markdown
```

## Headless : Pre-Arr Pour Sonarr / Radarr

Pre-Arr est un mode de staging conservateur. Il ne déplace automatiquement que les fichiers considérés sûrs.

```bash
cinerename pre-arr preview /chemin/vers/telechargements --profile sonarr --json
cinerename pre-arr apply /chemin/vers/telechargements --profile radarr --to /chemin/vers/staging
```

Utilisez toujours l'aperçu d'abord. Appliquez seulement quand le plan est correct.

## Headless : Outils Sous-Titres

```bash
cinerename subtitles convert episode.ass --to srt --output episode.srt
cinerename subtitles shift movie.fr.srt --ms 750 --output movie.fr.shifted.srt
cinerename subtitles drift movie.fr.srt --first-ms 0 --last-ms 1250 --output movie.fr.fixed.srt
```

Ces commandes modifient des fichiers de sous-titres localement. Elles ne garantissent pas une synchronisation audio parfaite sans vérifier le résultat.

## Headless : Configuration et Sécurité WebUI

L'API WebUI est toujours protégée par un token et nécessite au moins une option `--allowed-root <DIR>` pour restreindre l'accès au système de fichiers.

Sur l'interface de bouclage locale (`127.0.0.1`), si aucun token n'est fourni, CineRename génère un token aléatoire et l'affiche sur stderr (jamais dans les URL ni dans la sortie JSON).

Le serveur WebUI ne fonctionne qu'en HTTP brut. Toute liaison sur une adresse externe ou globale (`0.0.0.0`) exige l'argument `--insecure-http` (derrière un reverse-proxy HTTPS) ainsi qu'un token fourni par l'opérateur d'au moins 32 octets (via `--token-file`, `--token` ou `CINERENAME_WEB_TOKEN`) :

```bash
# WebUI sur localhost
cinerename web --host 127.0.0.1 --port 8787 --allowed-root /media/Library

# Non-loopback derrière un reverse proxy HTTPS
openssl rand -hex 32 > /secure/cinerename-web.token
chmod 600 /secure/cinerename-web.token
cinerename web --host 0.0.0.0 --port 8787 --insecure-http \
  --allowed-root /media/Library \
  --token-file /secure/cinerename-web.token
```

Gardez ce token privé.

## Exemple Scheduler NAS

```txt
*/15 * * * * /volume1/@appstore/cinerename/cinerename auto /volume1/video/Inbox --to /volume1/video/Library --subs fr --json >> /var/log/cinerename.log 2>&1
```

Pour un conteneur Docker long-running, utilisez `schedule` ou `web` plutôt que cron.

## Dépannage

- Utilisez `preview` avant tout gros traitement automatique.
- Si un provider est indisponible, relancez l'aperçu plus tard ou choisissez un match manuellement dans l'app desktop.
- Si un chemin échoue sur NAS, vérifiez les permissions de fichiers et de montage.
- Pour le support, copiez les logs depuis l'écran Support ou joignez la sortie CLI à votre email.
