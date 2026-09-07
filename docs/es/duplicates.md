# Duplicados

El módulo **Duplicados** escanea tu biblioteca para detectar múltiples copias de una misma película o episodio, y te ayuda a liberar espacio manteniendo solo la mejor versión.

## Cómo funciona

1. Señalas una carpeta (o varias).
2. CineRename indexa todos los archivos de video, calcula un puntaje de calidad y los agrupa por identidad de medio (título + año para películas, serie + temporada + episodio para series).
3. El resultado se muestra por **clústeres**: un clúster = varios archivos que apuntan al mismo contenido.

![Vista previa de los clústeres de duplicados](/assets/img/duplicates-clusters.png)

## El puntaje de calidad

Cada archivo recibe un puntaje basado en:

- **Resolución** — 4K > 1440p > 1080p > 720p > 480p
- **Códec** — HEVC/AV1 (eficiencia) con penalización para códecs antiguos
- **Fuente** — BluRay > WEBRip > HDTV > DVDRip
- **Bitrate** — bonificación para bitrates altos a igual resolución
- **Audio** — DTS-HD MA / TrueHD > DTS / DD+ > AC3 / AAC
- **Tamaño** — para desempatar con calidad técnica equivalente

El archivo con la puntuación más alta se marca como **A conservar**, los demás como **Candidatos a eliminación**.

::: tip Sin eliminación automática
Ningún archivo se elimina sin tu acuerdo explícito. El módulo solo hace **propuestas**.
:::

## Menú contextual

En cada línea del clúster, el **clic derecho** abre:

- **Abrir ubicación** — Finder / Explorer / Gestor de archivos nativo
- **Reproducir video** — inicia tu reproductor predeterminado
- **Forzar conservación** — marca este archivo como "a conservar" (anula la puntuación)
- **Forzar eliminación** — marca para eliminar
- **Excluir del clúster** — si CineRename ha agrupado incorrectamente

## Atajo de teclado

| Acción | Windows / Linux | macOS |
| --- | --- | --- |
| Escanear el lote actual de Studio | <kbd>Ctrl</kbd> + <kbd>F</kbd> | <kbd>Cmd</kbd> + <kbd>F</kbd> |

## Eliminación de duplicados

Cuando decides eliminar archivos candidatos:

1. CineRename muestra un cuadro de diálogo de confirmación explícito (`¿Eliminar permanentemente este archivo? Esta acción no se puede deshacer.`).
2. El archivo se elimina definitivamente del sistema de archivos (se desenlaza de forma atómica si no ha cambiado).
3. **Operación irreversible**: los archivos no se envían a la papelera del sistema operativo y las eliminaciones de duplicados no se registran en el Historial de renombrado.

::: warning Eliminación permanente
Dado que la eliminación de candidatos duplicados desenlaza directamente el archivo del almacenamiento en lugar de usar la papelera del sistema, los archivos eliminados no se pueden recuperar de la papelera ni deshacer desde el Historial. Revisa siempre con atención tu selección antes de confirmar.
:::

## Buenas prácticas

- **Renombrar siempre antes** — de lo contrario, a CineRename le costará emparejar `MovieX.1080p.x264-GROUP.mkv` con `MovieX.4k.HDR.mkv` porque los nombres no se parecen.
- **Ejecutar un dry-run** primero — explora los clústeres, ajusta las excepciones y solo entonces elimina.
- **Comprobar las múltiples ediciones** — para las películas, "Director's Cut", "Extended", "Theatrical" **no** se consideran duplicados si están nombrados explícitamente.

## Limitaciones conocidas

- Para los **multi-discos** (una película cortada en `Movie - cd1.mkv` + `Movie - cd2.mkv`), CineRename los agrupa correctamente solo si se respeta la convención `cd1`/`cd2` o `part1`/`part2`.
- Para los **archivos mixtos** (zips que contienen varias versiones), primero hay que extraerlos o usar el Studio para normalizarlos.
