# Pipeline de automatización

El **pipeline de automatización** encadena las funciones principales de CineRename:

```
Carpeta de origen  →  renombrado  →  subtítulos  →  movimiento  →  biblioteca final
```

Sirve para procesar una carpeta de descargas con menos intervención manual. Las acciones de riesgo siguen siendo prudentes: dry-run recomendado, sin sobrescritura por defecto y coincidencias inciertas en revisión.

## A quién va dirigido

- **Usuarios de Plex / Jellyfin** que quieren que los nuevos archivos aterricen automáticamente bien nombrados y con subtítulos.
- **Administradores de NAS** que usan scripts de post-procesamiento de Sonarr / Radarr.
- **Usuarios de Seedbox** que transfieren descargas a una biblioteca remota.

## Configuración

En **Preferencias → Automatización**:

| Opción | Descripción |
| --- | --- |
| **Disparador automático** | Ejecuta el pipeline después de los imports cuando está activo |
| **Estrategia** | Solo renombrar, renombrar y mover, o renombrar/mover/subtítulos |
| **Raíz de destino** | Biblioteca final o carpeta de staging, por ejemplo `/media/Plex` |
| **Subcarpetas películas / series / anime** | Organización opcional por tipo de medio |
| **Idioma de subtítulos** | Idioma preferido para los pasos automáticos de subtítulos |
| **Opciones de movimiento** | Move, copy, hardlink o symlink según tu flujo |
| **Clientes de descarga** | qBittorrent, Transmission o JDownloader |
| **Dry-run por defecto** | Recomendado para imports desde clientes de descarga y lotes grandes |

## Iniciar el pipeline

Cuatro formas:

1. **Desde Studio** — botón **Iniciar pipeline** en los archivos cargados.
2. **Desde el CLI** — `cinerename auto /ruta --to /Plex/...` (ver [CLI](/es/cli)).
3. **En segundo plano** — las carpetas vigiladas importan archivos nuevos, y el disparador de Automatización puede procesarlos si está activo.
4. **Headless/WebUI** — el build NAS puede lanzar flujos de servidor programados o protegidos por token.

## Seguridad

El modo automático respeta las mismas garantías que el Studio:

- **Flujo con vista previa primero** — ejecuta un dry-run antes de operaciones grandes o sin supervisión.
- **Sin sobreescritura** por defecto — el modo `keep both` se selecciona si no se especifica nada.
- **Cancelación posible** — cada operación se registra individualmente en el [Historial](/es/history), por lo que se puede deshacer.
- **Revisión para casos inciertos** — los elementos de baja confianza permanecen en revisión en lugar de moverse silenciosamente.

::: warning Vigilancia y flujos de trabajo de torrents
Si vigilas una carpeta donde los torrents escriben durante la descarga (`*.part`, `.!ut`), apunta CineRename a la carpeta final/completada del cliente o usa staging. De lo contrario, puede ver un archivo incompleto demasiado pronto.
:::

## Ejemplos de escenarios

### Escenario 1 — Transferencia de Seedbox a NAS

1. `rsync` transfiere `seedbox:downloads/` a `/mnt/nas/incoming/`
2. CineRename vigila `/mnt/nas/incoming/`
3. Pipeline automático:
   - renombra
   - descarga subtítulos en ES
   - mueve a `/mnt/nas/Plex/Films` o `/mnt/nas/Plex/Séries`
4. Plex escanea `/mnt/nas/Plex/` → contenido más fácil de reconocer gracias a nombres limpios

### Escenario 2 — Post-proceso Sonarr

1. Sonarr descarga un episodio
2. Al finalizar, Sonarr llama a un script `post-process.sh`
3. Este script ejecuta `cinerename auto $sonarr_episodefile_path --to /Plex/Séries --subs es`
4. No es necesaria ninguna acción manual

### Escenario 3 — Mac familiar

1. Un miembro de la familia arrastra una carpeta a `~/Movies/Inbox`
2. CineRename para Mac, ejecutándose en segundo plano, vigila esta carpeta
3. El pipeline automático mueve los archivos limpios a `~/Movies/Plex/...`

## Logs y soporte

Todos los eventos del pipeline y de fondo se registran en los logs estándar de CineRename:

| Sistema / Modo | Directorio de logs |
| --- | --- |
| Windows (Escritorio) | `%LOCALAPPDATA%\com.cinerename.desktop\logs\` |
| macOS (Escritorio) | `~/Library/Logs/com.cinerename.desktop/` |
| Linux (Escritorio) | `~/.local/share/com.cinerename.desktop/logs/` |
| Headless / NAS (Linux) | Salida estándar / redirección por shell (ej. `>> /var/log/cinerename.log 2>&1`) |

En la aplicación de escritorio, puedes acceder directamente a través de **Preferencias → Soporte → Copiar logs** o **Mostrar carpeta de logs** para inspeccionar la actividad reciente o informar de un problema. En CLI/headless, redirige stdout/stderr a tu archivo de log persistente preferido.
