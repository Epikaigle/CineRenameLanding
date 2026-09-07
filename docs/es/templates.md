# Plantillas de nombrado

Cada preset de renombrado en CineRename tiene un **idioma**: el histórico motor de tokens (sencillo y legible) o un evaluador **JavaScript** en un entorno aislado (sandbox) para patrones avanzados.

Preferencias → **Plantillas de nombrado** → botón `Tokens` / `JavaScript` encima del editor.

## Modo Tokens (por defecto)

Sustitución simple `{token}` → valor. Cubre la gran mayoría de los casos.

```text
{title} ({year})
{title} - S{season}E{episode} - {episode_title}
{title} - {absolute_episode} - {episode_title}
{title} [{resolution} {video_codec}]
```

Variables disponibles:
- **Tokens principales**: `{title}`, `{year}`, `{season}`, `{episode}`, `{absolute_episode}`, `{episode_title}`, `{tmdb_id}`, `{tvdb_id}`, `{imdb_id}`, `{plex}`, `{plex.id}`
- **Tokens avanzados**: `{resolution}`, `{source}`, `{video_codec}`, `{audio_codec}`, `{audio_language}`, `{dynamic_range}`, `{bit_depth}`

::: tip Importar un formato heredado
El botón **Import legacy format** convierte patrones token-style comunes (`{n} ({y})/{n} - {s00e00} - {t}`) en un patrón de CineRename. Los bloques `${...}` y condicionales personalizados se marcan para revisión manual, o pueden reescribirse en modo JavaScript.
:::

## Modo JavaScript

El patrón se evalúa como una **expresión JavaScript** en un sandbox integrado de QuickJS:

- Sin acceso al sistema de archivos, red, temporizadores o variables globales peligrosas
- ES2020 completo: ternarios, regex, closures, arrow functions, métodos de cadena, template literals
- El contexto de renombrado se expone como **variables globales**
- El valor devuelto por la expresión se convierte en el nombre de archivo
- **Rápido**: ejecución inmediata dentro de un runtime QuickJS local y restringido

### Variables expuestas

```text
title, year, season, episode, absolute_episode,
episode_title, resolution, source, video_codec,
audio_codec, audio_language, dynamic_range, bit_depth,
tmdb_id, tvdb_id, imdb_id, plex, plex_id, media_kind
```

Los valores numéricos (`year`, `season`, `episode`, `absolute_episode`) son **números** (o `null`). `media_kind` es `"movie"`, `"series"` o `"anime"`. Los demás (incluido `bit_depth`, p. ej. `"10-bit"`) son **cadenas de texto** o `null` si no se proporcionan.

### Valores típicos de las variables

Para ayudarte a escribir tus condiciones `if / else` en JavaScript, aquí tienes los valores típicos que devuelve el analizador interno:

| Variable | Valores posibles (ejemplos) |
| --- | --- |
| `resolution` | `2160p`, `1080p`, `720p`, `480p` |
| `video_codec` | `x264`, `x265`, `AV1`, `MPEG-2` |
| `audio_codec` | `AAC`, `AC3`, `EAC3`, `DTS`, `DTS-HD MA`, `TrueHD`, `FLAC` |
| `dynamic_range`| `SDR`, `HDR10`, `HDR10+`, `Dolby Vision` |
| `source` | `BluRay`, `WEBRip`, `WEB-DL`, `HDTV`, `DVD` |

### Helpers proporcionados

| Helper | Efecto |
| :--- | :--- |
| `pad(value, width)` | Rellena con ceros un número (ej. `pad(2, 3)` → `"002"`) |
| `s00e00(season, episode)` | Formato `"S01E02"` |
| `nonEmpty(...args)` | Devuelve el primer argumento no vacío |
| `joinNonEmpty(separator, ...args)` | Concatena los argumentos no vacíos con un separador |

### Ejemplos

**Concatenación condicional en el rango dinámico:**
```js
title + ' (' + year + ')' + (dynamic_range === 'HDR10' ? ' [HDR]' : '')
```

**Reordenamiento "The Wire" → "Wire, The":**
```js
title.replace(/^The\s+/, '') + ', The - ' + s00e00(season, episode)
```

**Limpieza de caracteres prohibidos:**
```js
title.replace(/[:?]/g, '').trim() + ' (' + year + ')'
```

**Sufijo HD/SD según la resolución:**
```js
title + ' [' + (parseInt(resolution) >= 1080 ? 'HD' : 'SD') + ']'
```

**Compatible con Plex y con fallback al título del episodio:**
```js
title + ' - ' + s00e00(season, episode) +
  (episode_title ? ' - ' + episode_title : '')
```

**Anime con episodio absoluto y fallback:**
```js
title + ' - ' + pad(absolute_episode, 3) +
  joinNonEmpty(' - ', episode_title, resolution)
```

### Seguridad

El sandbox de QuickJS **no expone ninguna API de I/O**: sin `fetch`, sin `require`, sin `process`, sin `Deno`, sin `setTimeout`. El único "efecto secundario" posible es devolver una cadena (o lanzar una excepción, lo que marca la línea para revisión).

Los errores de sintaxis se **detectan al guardar**: el botón Guardar (Save) valida analizando la expresión antes de persistirla en la base de datos.

### Límites

- **Sin recursión infinita**: QuickJS detiene los bucles demasiado largos, pero en la práctica una plantilla debería ejecutarse en unos pocos µs.
- **Sin estado entre llamadas**: cada renderizado es un sandbox nuevo — no puedes memorizar un contador entre dos archivos.
- **Sin acceso a los demás archivos del lote**: una plantilla solo ve su propio contexto.

Para transformaciones que requieran un contexto global (numeración secuencial en todo un lote, etc.), utiliza la **CLI** envuelta en un script de shell.

## Cómo migrar tokens heredados comunes

| Token / expresión heredada | CineRename (JavaScript) |
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

::: warning Símbolos no expuestos
Algunos campos multimedia técnicos (bitrate global, framerate, canales de audio) aún no están expuestos al sandbox de JS en CineRename. Si los necesitas, contáctanos por correo electrónico — pueden añadirse a `RenameTemplateContext`.
:::
