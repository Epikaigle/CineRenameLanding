# Studio

El **Studio** es la pantalla principal de CineRename: es donde previsualizas y validas cada renombrado. Cualquier operación destructiva pasa primero por aquí.

## Anatomía de la pantalla

- **Zona de arrastre (drop zone)** — en el centro, acepta archivos, carpetas y archivos comprimidos.
- **Lista virtual** — muestra hasta miles de archivos sin ralentización (virtualización de Svelte 5).
- **Panel de detalles** — cuando haces clic en una fila, muestra los metadatos encontrados, alternativas y formato de salida.
- **Acciones** — botones **Renombrar**, **Limpiar la lista**, **Exportar informe**.

## Reconocimiento de medios

CineRename utiliza una heurística en varias pasadas:

1. **Análisis del nombre de archivo** — temporada/episodio (S01E02, 1x02, Episode 2…), año, calidad, códec, idioma.
2. **Identificación del tipo** — película, serie, anime — a través de patrones + bases de datos.
3. **Consulta de metadatos** — TheTVDB para películas/series, TVmaze como complemento para series de TV, base interna para animes.
4. **Puntuación (Scoring)** — se evalúan todos los candidatos. Se selecciona el mejor y los demás quedan disponibles en el selector.

## Edición manual

Para cada entrada, puedes:

- **Forzar una coincidencia** — seleccionar manualmente la película/episodio correcto entre los candidatos.
- **Editar el título** — error tipográfico, versión extendida ("Director's Cut")…
- **Ignorar una fila** — excluirla del renombrado final (útil para archivos `.txt` o `.nfo` que se hayan colado).

## Presets de nombrado

Configúralos en **Preferencias → Plantillas de nombrado**. Cada plantilla tiene un **idioma**:

| Modo | Cuándo usarlo |
| :--- | :--- |
| **Tokens** | Patrones de sustitución simple: `{title} - S{season}E{episode} - {episode_title}` — cubre el 95% de los casos. Incluye un importador de formatos heredados para patrones existentes. |
| **JavaScript** | Patrones avanzados: ternarios, regex, closures, manipulación de cadenas. El motor QuickJS integrado es rápido y sandboxed. Ver [Templates JavaScript](/es/templates). |

Variables disponibles:

| Tokens | JavaScript | Descripción |
| --- | --- | --- |
| `{title}` | `title` | Título del medio |
| `{year}` | `year` | Año de lanzamiento |
| `{season}` | `season` | Número de temporada (con ceros a la izquierda en tokens) |
| `{episode}` | `episode` | Número de episodio (con ceros a la izquierda en tokens) |
| `{absolute_episode}` | `absolute_episode` | Número de episodio absoluto (con ceros a la izquierda en tokens) |
| `{episode_title}` | `episode_title` | Título del episodio |
| `{tmdb_id}` | `tmdb_id` | Identificador TMDb |
| `{tvdb_id}` | `tvdb_id` | Identificador TheTVDB |
| `{imdb_id}` | `imdb_id` | Identificador IMDb |
| `{plex}` | `plex` | Formato estándar Plex |
| `{plex.id}` | `plex_id` | Formato estándar Plex con identificador multimedia |
| `{resolution}` | `resolution` | Resolución (`1080p`, `2160p`, `720p`…) |
| `{source}` | `source` | Fuente (`BluRay`, `WEB-DL`, `HDTV`…) |
| `{video_codec}` | `video_codec` | Códec de video (`x264`, `x265`, `AV1`…) |
| `{audio_codec}` | `audio_codec` | Códec de audio (`AAC`, `AC3`, `EAC3`, `DTS`…) |
| `{audio_language}` | `audio_language` | Idioma de audio (`fr`, `en`, `ja`…) |
| `{dynamic_range}` | `dynamic_range` | Rango dinámico (`SDR`, `HDR10`, `Dolby Vision`…) |
| `{bit_depth}` | `bit_depth` | Profundidad de bits (`8-bit`, `10-bit`…) |
| — | `media_kind` | Categoría multimedia en JS (`"movie"`, `"series"` o `"anime"`) |

::: tip Compatible con Plex
El preset por defecto está calibrado para Plex y Jellyfin. Si lo cambias, comprueba con el escáner de tu biblioteca que los archivos sigan siendo reconocidos.
:::

## Emparejamiento lineal de DVD / BluRay

Si importas una carpeta de un disco ripeado (`VTS_01_1.VOB`, `00001.m2ts`, `BDMV/STREAM/…`), Studio detecta estos archivos y muestra un botón de **Emparejamiento lineal…** en la barra de herramientas.

El flujo de trabajo:

1. Busca la serie en la barra de búsqueda de metadatos (TheTVDB / TVmaze)
2. Selecciona el candidato correcto y la **temporada** correspondiente
3. (Opcional) Empieza en un episodio que no sea el 1 — útil para discos que contienen la segunda mitad de una temporada
4. (Opcional) Filtra los **fragmentos pequeños** (`< 50 MB`) para ignorar los menús / intros de DVD
5. Haz clic en **Generar el plan** — cada archivo (ordenado alfabéticamente) se empareja con `episode[i]` y el lote actual se reemplaza por el resultado

Luego validas a través del botón **Renombrar** habitual.

## Operaciones de archivo

En **Preferencias → Automatización**, elige qué hace CineRename cuando validas un renombrado:

| Modo | Efecto |
| --- | --- |
| **Move** (por defecto) | Mueve el archivo a la nueva ruta / nombre. Comportamiento clásico. |
| **Copy** | Copia el archivo, manteniendo intacto el original. Útil para preservar archivos en una seedbox. |
| **Hardlink** | Crea un enlace duro — cero bytes adicionales en el disco (requiere el mismo sistema de archivos). |
| **Symlink** | Crea un enlace simbólico — se hace referencia al original. |

Para Move, deshacer (undo) a través del Historial restaura el nombre original. Para los demás modos, el original permanece inalterado, por lo que deshacer simplemente elimina la copia / enlace creado.

## Checksums

Selecciona una o más entradas y haz clic en **Calcular checksums** para generar huellas CRC32 / MD5 / SHA-1 / SHA-256, que se pueden exportar a un manifiesto sidecar (`.sfv`, `.md5`, `.sha1`, `.sha256`). El botón **Verificar un manifiesto…** en el mismo diálogo vuelve a leer un manifiesto existente y marca los archivos alterados o faltantes. Ver [Checksums](/es/checksums).

## Seguridad

- **Sin escrituras en disco** antes de la validación.
- **Renombrado atómico** — si un archivo no puede renombrarse (permisos, conflicto de nombre), la operación se detiene limpiamente y no deja nada a medias.
- **Conflictos detectados** — si dos archivos generaran el mismo nombre de salida, CineRename se niega a continuar y señala el conflicto.

## Atajos de teclado

| Acción | Windows / Linux | macOS |
| --- | --- | --- |
| Seleccionar todo | <kbd>Ctrl</kbd> + <kbd>A</kbd> | <kbd>Cmd</kbd> + <kbd>A</kbd> |
| Iniciar el renombrado | <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | <kbd>Cmd</kbd> + <kbd>Enter</kbd> |
| Limpiar la lista | <kbd>Ctrl</kbd> + <kbd>Backspace</kbd> | <kbd>Cmd</kbd> + <kbd>Delete</kbd> |
| Abrir Ajustes | <kbd>Ctrl</kbd> + <kbd>,</kbd> | <kbd>Cmd</kbd> + <kbd>,</kbd> |
| Moverse por la lista de archivos | <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Igual |
| Seleccionar el archivo enfocado | <kbd>Espacio</kbd> | Igual |
| Abrir la revisión del archivo enfocado | <kbd>Enter</kbd> | Igual |
| Abrir el menú del archivo enfocado | <kbd>Menu</kbd> o <kbd>Shift</kbd> + <kbd>F10</kbd> | Igual |
