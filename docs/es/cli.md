# Línea De Comandos Y Uso Headless

CineRename incluye herramientas de línea de comandos para NAS, Docker, scripts de servidor y automatización prudente.

## Instalación

CineRename tiene dos superficies CLI:

- **CLI desktop**: incluida con el binario de la aplicación desktop. Soporta los flujos principales: `preview`, `rename`, `organize`, `auto` y `schedule`.
- **CLI headless/NAS**: incluida en los archivos NAS/headless. Soporta los flujos principales más herramientas de servidor como `audit`, `nfo`, `subtitles`, `download-client`, `pre-arr`, `web` y `tui`.

Si un comando está marcado como **headless**, usa el archivo NAS/headless en lugar del binario desktop.

Formatos NAS:

| Arquitectura | Artefacto |
| :--- | :--- |
| Intel / AMD 64-bit | archivo NAS Linux x64 |
| ARM 64-bit | archivo NAS Linux arm64 |

Extrae el archivo y ejecuta los comandos desde la carpeta extraída.

## Ayuda

```bash
cinerename --help
cinerename preview --help
cinerename auto --help
```

## Comandos Principales

| Comando | Disponible en | Acción |
| --- | --- | --- |
| `cinerename preview <ruta>` | Desktop + headless | Muestra la vista previa antes/después sin cambiar archivos |
| `cinerename rename <ruta>` | Desktop + headless | Renombra archivos en el lugar |
| `cinerename organize <ruta> --to <biblioteca>` | Desktop + headless | Renombra y mueve archivos a una biblioteca |
| `cinerename auto <ruta> --to <biblioteca> [--subs es]` | Desktop + headless | Ejecuta el pipeline prudente: renombrar, organizar, subtítulos opcionales |
| `cinerename schedule <ruta> --every 15m --to <biblioteca>` | Desktop + headless | Repite un flujo en un intervalo |
| `cinerename history list` | Headless | Lista los lotes recientes de renombrado |
| `cinerename history undo-last` | Headless | Deshace el lote restaurable más reciente |
| `cinerename history undo <batch-id>` | Headless | Deshace un lote específico |
| `cinerename history export --output <ruta>` | Headless | Exporta el historial a CSV, JSON o Markdown |
| `cinerename audit <ruta> --profile plex` | Headless | Audita una biblioteca Plex/Jellyfin/Kodi |
| `cinerename nfo <ruta> --profile kodi --write` | Headless | Genera archivos NFO explícitamente |
| `cinerename subtitles convert <archivo> --to srt` | Headless | Convierte formatos de subtítulos |
| `cinerename subtitles shift <archivo> --ms 750` | Headless | Aplica un desplazamiento fijo a los subtítulos |
| `cinerename subtitles drift <archivo> --first-ms 0 --last-ms 1250` | Headless | Aplica una corrección simple de drift lineal |
| `cinerename download-client test qbittorrent --url <url>` | Headless | Prueba un cliente de descarga |
| `cinerename download-client import <cliente> --url <url>` | Headless | Simula o aplica importaciones de clientes de descarga |
| `cinerename pre-arr preview <ruta> --profile sonarr` | Headless | Prepara una vista previa de staging Sonarr/Radarr |
| `cinerename pre-arr apply <ruta> --to <staging>` | Headless | Mueve archivos coincidentes a un directorio de staging |
| `cinerename benchmark large-import --files 2000` | Headless | Ejecuta un benchmark local controlado |
| `cinerename web --host 127.0.0.1 --port 8787 --allowed-root <dir>` | Headless | Inicia la WebUI local |
| `cinerename tui <ruta>` | Headless | Inicia la interfaz de terminal |

Opciones globales:
- `--json`: Genera salida estructurada en JSON (JSON Lines en modo scheduler)
- `--config-dir <dir>`: Sobrescribe el directorio de configuración de CineRename (Headless)
- `--cache-dir <dir>`: Sobrescribe el directorio de caché de CineRename (Headless)

## Ejemplos Desktop Y Headless

```bash
# Previsualizar sin tocar archivos
cinerename preview /ruta/al/video.mkv

# Exportar un informe dry-run
cinerename preview /ruta/a/la/carpeta --export dry-run.csv

# Renombrar en el lugar
cinerename rename /ruta/a/la/carpeta

# Renombrar y organizar en una biblioteca
cinerename organize /ruta/a/descargas --to /media/Library

# Renombrar, organizar y buscar subtítulos en español
cinerename auto /ruta/a/descargas --to /media/Library --subs es

# Ejecutar cada 15 minutos en un NAS
cinerename schedule /ruta/a/descargas --every 15m --to /media/Library --subs es
```

## Ejemplos Headless

Estos comandos requieren el build NAS/headless.

```bash
# Deshacer el último lote restaurable
cinerename history undo-last

# Auditar una biblioteca
cinerename audit /media/Library --profile plex --export audit.md --format markdown
```

## Headless: Pre-Arr Para Sonarr / Radarr

Pre-Arr es un modo de staging conservador. Solo prepara automáticamente los archivos considerados seguros.

```bash
cinerename pre-arr preview /ruta/a/descargas --profile sonarr --json
cinerename pre-arr apply /ruta/a/descargas --profile radarr --to /ruta/a/staging
```

Usa primero la vista previa. Aplica solo cuando el plan sea correcto.

## Headless: Herramientas De Subtítulos

```bash
cinerename subtitles convert episode.ass --to srt --output episode.srt
cinerename subtitles shift movie.es.srt --ms 750 --output movie.es.shifted.srt
cinerename subtitles drift movie.es.srt --first-ms 0 --last-ms 1250 --output movie.es.fixed.srt
```

Estos comandos ajustan archivos de subtítulos localmente. No garantizan una sincronización de audio perfecta sin revisar el resultado.

## Headless: Configuración y Seguridad WebUI

La API WebUI siempre está protegida por un token y requiere al menos una opción `--allowed-root <DIR>` para restringir el acceso al sistema de archivos.

En la interfaz local de bucle invertido (`127.0.0.1`), si no se proporciona ningún token, CineRename genera un token aleatorio y lo imprime en stderr (nunca en URL ni en la salida JSON).

El servidor WebUI solo funciona en HTTP plano. Cualquier enlace a una dirección externa o global (`0.0.0.0`) requiere el argumento `--insecure-http` (detrás de un proxy inverso HTTPS) junto con un token proporcionado por el operador de al menos 32 bytes (mediante `--token-file`, `--token` o `CINERENAME_WEB_TOKEN`):

```bash
# WebUI en localhost
cinerename web --host 127.0.0.1 --port 8787 --allowed-root /media/Library

# Non-loopback detrás de un proxy inverso HTTPS
openssl rand -hex 32 > /secure/cinerename-web.token
chmod 600 /secure/cinerename-web.token
cinerename web --host 0.0.0.0 --port 8787 --insecure-http \
  --allowed-root /media/Library \
  --token-file /secure/cinerename-web.token
```

Mantén este token privado.

## Ejemplo Scheduler NAS

```txt
*/15 * * * * /volume1/@appstore/cinerename/cinerename auto /volume1/video/Inbox --to /volume1/video/Library --subs es --json >> /var/log/cinerename.log 2>&1
```

Para un contenedor Docker de larga duración, usa `schedule` o `web` en lugar de cron.

## Solución De Problemas

- Usa `preview` antes de cualquier ejecución automática grande.
- Si un proveedor no está disponible, vuelve a ejecutar la vista previa más tarde o selecciona un resultado manualmente en la aplicación desktop.
- Si una ruta falla en NAS, revisa los permisos de archivos y montajes.
- Para soporte, copia logs desde la pantalla Support o adjunta la salida CLI a tu email.
