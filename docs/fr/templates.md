# Templates de nommage

Chaque preset de renommage dans CineRename a une **langue** : le moteur de tokens historique (simple et lisible) ou un évaluateur **JavaScript** sandboxé pour les patterns avancés.

Préférences → **Modèles de nommage** → bouton `Tokens` / `JavaScript` au-dessus de l'éditeur.

## Mode Tokens (par défaut)

Substitution simple `{token}` → valeur. Couvre la grande majorité des cas.

```text
{title} ({year})
{title} - S{season}E{episode} - {episode_title}
{title} - {absolute_episode} - {episode_title}
{title} [{resolution} {video_codec}]
```

Variables disponibles :
- **Tokens essentiels** : `{title}`, `{year}`, `{season}`, `{episode}`, `{absolute_episode}`, `{episode_title}`, `{tmdb_id}`, `{tvdb_id}`, `{imdb_id}`, `{plex}`, `{plex.id}`
- **Tokens avancés** : `{resolution}`, `{source}`, `{video_codec}`, `{audio_codec}`, `{audio_language}`, `{dynamic_range}`, `{bit_depth}`

::: tip Importer un ancien format
Le bouton **Importer un ancien format** convertit les patterns token-style courants (`{n} ({y})/{n} - {s00e00} - {t}`) en pattern CineRename. Les blocs `${...}` et conditionnels personnalisés sont signalés pour relecture manuelle, ou peuvent être réécrits en mode JavaScript.
:::

## Mode JavaScript

Le pattern est évalué comme une **expression JavaScript** dans un sandbox QuickJS embarqué :

- Pas d'accès filesystem, réseau, timers, ou globals dangereux
- ES2020 complet : ternaires, regex, closures, arrow functions, méthodes de chaîne, template literals
- Le contexte de rename est exposé comme **variables globales**
- La valeur retournée par l'expression devient le nom de fichier
- **Rapide** : exécution immédiate dans un runtime QuickJS local et restreint

### Variables exposées

```text
title, year, season, episode, absolute_episode,
episode_title, resolution, source, video_codec,
audio_codec, audio_language, dynamic_range, bit_depth,
tmdb_id, tvdb_id, imdb_id, plex, plex_id, media_kind
```

Les valeurs numériques (`year`, `season`, `episode`, `absolute_episode`) sont des **nombres** (ou `null`). `media_kind` vaut `"movie"`, `"series"`, ou `"anime"`. Les autres (dont `bit_depth`, ex. `"10-bit"`) sont des **chaînes de caractères** ou `null` si non renseigné.

### Valeurs typiques des variables

Pour vous aider à écrire vos conditions `if / else` en JavaScript, voici les valeurs typiques renvoyées par le parseur interne :

| Variable | Valeurs possibles (exemples) |
| --- | --- |
| `resolution` | `2160p`, `1080p`, `720p`, `480p` |
| `video_codec` | `x264`, `x265`, `AV1`, `MPEG-2` |
| `audio_codec` | `AAC`, `AC3`, `EAC3`, `DTS`, `DTS-HD MA`, `TrueHD`, `FLAC` |
| `dynamic_range`| `SDR`, `HDR10`, `HDR10+`, `Dolby Vision` |
| `source` | `BluRay`, `WEBRip`, `WEB-DL`, `HDTV`, `DVD` |

### Helpers fournis

| Helper | Effet |
| :--- | :--- |
| `pad(value, width)` | Zero-pad un nombre (ex. `pad(2, 3)` → `"002"`) |
| `s00e00(season, episode)` | Format `"S01E02"` |
| `nonEmpty(...args)` | Renvoie le premier argument non-vide |
| `joinNonEmpty(separator, ...args)` | Concatène les arguments non-vides avec un séparateur |

### Exemples

**Concat conditionnel sur la dynamic range :**
```js
title + ' (' + year + ')' + (dynamic_range === 'HDR10' ? ' [HDR]' : '')
```

**Réordonnancement "The Wire" → "Wire, The" :**
```js
title.replace(/^The\s+/, '') + ', The - ' + s00e00(season, episode)
```

**Nettoyage des caractères interdits :**
```js
title.replace(/[:?]/g, '').trim() + ' (' + year + ')'
```

**Suffixe HD/SD selon la résolution :**
```js
title + ' [' + (parseInt(resolution) >= 1080 ? 'HD' : 'SD') + ']'
```

**Plex-friendly avec fallback episode title :**
```js
title + ' - ' + s00e00(season, episode) +
  (episode_title ? ' - ' + episode_title : '')
```

**Anime avec absolute episode et fallback :**
```js
title + ' - ' + pad(absolute_episode, 3) +
  joinNonEmpty(' - ', episode_title, resolution)
```

### Sécurité

Le sandbox QuickJS n'expose **aucune API I/O** : pas de `fetch`, pas de `require`, pas de `process`, pas de `Deno`, pas de `setTimeout`. Le seul "effet de bord" possible est de retourner une string (ou de lever une exception, ce qui marque la ligne en review).

Les erreurs de syntaxe sont **détectées à la sauvegarde** : le bouton Save valide en parsant l'expression avant de la persister en base.

### Limites

- **Pas de récursion infinie** : QuickJS coupe les boucles trop longues, mais en pratique un template doit s'exécuter en quelques µs.
- **Pas de state entre appels** : chaque rendu est un sandbox neuf — vous ne pouvez pas mémoriser un compteur entre deux fichiers.
- **Pas d'accès aux autres fichiers du batch** : un template ne voit que son propre contexte.

Pour des transformations qui nécessitent du contexte global (numérotation séquentielle sur tout un batch, etc.), utilisez la **CLI** avec un script shell autour.

## Comment migrer des tokens historiques courants

| Token / expression historique | CineRename (JavaScript) |
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

::: warning Symboles non exposés
Certains champs media techniques (bitrate global, framerate, audio channels) ne sont pas encore exposés au sandbox JS de CineRename. Si vous en avez besoin, contactez-nous par email — ils peuvent être ajoutés à `RenameTemplateContext`.
:::
