# Studio

Le **Studio** est l'écran principal de CineRename : c'est là où vous prévisualisez et validez chaque renommage. Toute opération destructive passe d'abord par lui.

## Anatomie de l'écran

- **Zone de drop** — au centre, accepte fichiers, dossiers et archives.
- **Liste virtuelle** — affiche jusqu'à des milliers de fichiers sans ralentissement (virtualisation Svelte 5).
- **Panneau de détails** — quand vous cliquez sur une ligne, affiche metadata trouvée, alternatives, format de sortie.
- **Actions** — boutons **Renommer**, **Nettoyer la liste**, **Exporter le rapport**.

## Reconnaissance des médias

CineRename utilise une heuristique en plusieurs passes :

1. **Parsing du nom de fichier** — saison/épisode (S01E02, 1x02, Episode 2…), année, qualité, codec, langue.
2. **Identification du type** — film, série, anime — via patterns + bases.
3. **Requête metadata** — TheTVDB pour les films/séries, TVmaze pour les séries TV en complément, base interne pour les animes.
4. **Scoring** — tous les candidats sont notés. Le meilleur est sélectionné, les autres restent disponibles dans le sélecteur.

## Édition manuelle

Pour chaque entrée, vous pouvez :

- **Forcer un match** — sélectionner manuellement le bon film/épisode parmi les candidats.
- **Éditer le titre** — typo, version étendue ("Director's Cut")…
- **Ignorer une ligne** — exclure du renommage final (utile pour les `.txt`, `.nfo` qui se sont glissés).

## Presets de nommage

Configurez dans **Préférences → Modèles de nommage**. Chaque template a une **langue** :

| Mode | Quand l'utiliser |
| :--- | :--- |
| **Tokens** | Patterns à substitution simple : `{title} - S{season}E{episode} - {episode_title}` — couvre 95% des cas. Inclut un importeur de formats historiques pour récupérer des patterns existants. |
| **JavaScript** | Patterns avancés : ternaires, regex, closures, manipulation de chaînes. Le moteur QuickJS embarqué est rapide et sandboxé. Voir [Templates JavaScript](/fr/templates). |

Variables disponibles :

| Tokens | JavaScript | Description |
| --- | --- | --- |
| `{title}` | `title` | Titre du média |
| `{year}` | `year` | Année de sortie |
| `{season}` | `season` | Numéro de saison (zero-padded en tokens) |
| `{episode}` | `episode` | Numéro d'épisode (zero-padded en tokens) |
| `{absolute_episode}` | `absolute_episode` | Numéro d'épisode absolu (zero-padded en tokens) |
| `{episode_title}` | `episode_title` | Titre de l'épisode |
| `{tmdb_id}` | `tmdb_id` | Identifiant TMDb |
| `{tvdb_id}` | `tvdb_id` | Identifiant TheTVDB |
| `{imdb_id}` | `imdb_id` | Identifiant IMDb |
| `{plex}` | `plex` | Format standard Plex |
| `{plex.id}` | `plex_id` | Format standard Plex avec identifiant média |
| `{resolution}` | `resolution` | Résolution (`1080p`, `2160p`, `720p`…) |
| `{source}` | `source` | Source (`BluRay`, `WEB-DL`, `HDTV`…) |
| `{video_codec}` | `video_codec` | Codec vidéo (`x264`, `x265`, `AV1`…) |
| `{audio_codec}` | `audio_codec` | Codec audio (`AAC`, `AC3`, `EAC3`, `DTS`…) |
| `{audio_language}` | `audio_language` | Langue audio (`fr`, `en`, `ja`…) |
| `{dynamic_range}` | `dynamic_range` | Plage dynamique (`SDR`, `HDR10`, `Dolby Vision`…) |
| `{bit_depth}` | `bit_depth` | Profondeur de bits (`8-bit`, `10-bit`…) |
| — | `media_kind` | Catégorie média en JS (`"movie"`, `"series"` ou `"anime"`) |

::: tip Plex friendly
Le preset par défaut est calibré pour Plex et Jellyfin. Si vous changez, vérifiez avec votre scanner de bibliothèque que les fichiers sont toujours reconnus.
:::

## Appairage linéaire DVD / BluRay

Si vous importez un dossier de rip disque (`VTS_01_1.VOB`, `00001.m2ts`, `BDMV/STREAM/…`), le Studio détecte ces fichiers et fait apparaître un bouton **Appairage linéaire…** dans la barre d'outils.

Le workflow :

1. Cherchez la série dans la barre de recherche metadata (TheTVDB / TVmaze)
2. Sélectionnez le bon candidat et la **saison** concernée
3. (Optionnel) Démarrez à un épisode autre que le 1 — utile pour les disques contenant la deuxième moitié d'une saison
4. (Optionnel) Filtrez les **petits fragments** (`< 50 Mo`) pour ignorer les menus / intros DVD
5. Cliquez sur **Générer le plan** — chaque fichier (trié alphabétiquement) est appairé à `episode[i]` et le batch courant est remplacé par le résultat

Vous validez ensuite via le bouton **Renommer** habituel.

## Opérations fichier

Dans **Préférences → Automation**, choisissez ce que CineRename fait quand vous validez un renommage :

| Mode | Effet |
| --- | --- |
| **Move** (défaut) | Déplace le fichier vers le nouveau chemin / nom. Comportement classique. |
| **Copy** | Copie le fichier en gardant l'original intact. Utile pour préserver une seedbox. |
| **Hardlink** | Crée un lien dur — zéro octet supplémentaire sur le disque (même filesystem requis). |
| **Symlink** | Crée un lien symbolique — l'original est référencé. |

Pour Move, l'undo via l'Historique restaure le nom original. Pour les autres modes, l'original est inchangé donc l'undo supprime simplement la copie / le lien créé.

## Checksums

Sélectionnez une ou plusieurs entrées et cliquez sur **Calculer checksums** pour générer des empreintes CRC32 / MD5 / SHA-1 / SHA-256, exportables en manifeste sidecar (`.sfv`, `.md5`, `.sha1`, `.sha256`). Le bouton **Vérifier un manifeste…** dans le même dialog relit un manifeste existant et flagge les fichiers altérés ou manquants. Voir [Checksums](/fr/checksums).

## Sécurité

- **Aucune écriture disque** avant validation.
- **Renommage atomique** — si un fichier ne peut pas être renommé (permissions, conflit de nom), l'opération s'arrête proprement et rien n'est laissé à moitié fait.
- **Conflits détectés** — si deux fichiers donneraient le même nom de sortie, CineRename refuse de continuer et signale le conflit.

## Raccourcis clavier

| Action | Windows / Linux | macOS |
| --- | --- | --- |
| Tout sélectionner | <kbd>Ctrl</kbd> + <kbd>A</kbd> | <kbd>Cmd</kbd> + <kbd>A</kbd> |
| Lancer le renommage | <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | <kbd>Cmd</kbd> + <kbd>Enter</kbd> |
| Nettoyer la liste | <kbd>Ctrl</kbd> + <kbd>Backspace</kbd> | <kbd>Cmd</kbd> + <kbd>Delete</kbd> |
| Ouvrir Réglages | <kbd>Ctrl</kbd> + <kbd>,</kbd> | <kbd>Cmd</kbd> + <kbd>,</kbd> |
| Se déplacer dans la liste | <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Identique |
| Sélectionner le fichier ciblé | <kbd>Espace</kbd> | Identique |
| Ouvrir la vérification du fichier ciblé | <kbd>Enter</kbd> | Identique |
| Ouvrir le menu du fichier ciblé | <kbd>Menu</kbd> ou <kbd>Shift</kbd> + <kbd>F10</kbd> | Identique |
