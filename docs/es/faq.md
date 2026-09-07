# Preguntas Frecuentes (FAQ)

## ¿En qué sistemas funciona CineRename?

CineRename es una aplicación nativa para **Windows 10/11**, **macOS 11+** y **Linux**. Los builds Linux de escritorio se preparan como AppImage, deb y rpm, con builds headless separados para NAS / Docker.

## ¿Mis archivos salen de mi ordenador?

**No.** El análisis, renombrado, movimiento, cálculo de checksums y herramientas de timing de subtítulos se ejecutan localmente. Las peticiones de red solo van a los proveedores de metadatos/subtítulos configurados, como TheTVDB, TVmaze, AniList, Kitsu u OpenSubtitles, con títulos, IDs, idioma o la huella OpenSubtitles del archivo — nunca el vídeo en sí.

## ¿Puedo deshacer un renombrado accidental?

Sí. La pestaña de [Historial](/es/history) mantiene un registro de cada operación y te permite deshacer con un solo clic, incluso varios días después.

## ¿Es CineRename compatible con Plex / Jellyfin / Emby / Kodi?

Sí. CineRename incluye perfiles listos para Plex, Jellyfin y Kodi. Emby suele seguir las convenciones de Jellyfin, por lo que esas salidas también son compatibles. Ver [Plex / Jellyfin / Emby](/es/media-servers) para más detalles.

## ¿CineRename soporta archivos ZIP / RAR?

Sí, con un detalle importante: CineRename extrae los archivos soportados a una caché local antes de procesar los vídeos. No renombra archivos directamente dentro del comprimido.

La app de escritorio soporta ZIP, RAR, 7z, tar, gzip, bzip2 y xz. El build headless/NAS estático excluye RAR para mantener la portabilidad, pero mantiene ZIP, 7z, tar, gzip, bzip2 y xz.

*(Nota: Los archivos protegidos con contraseña no están soportados. Además, extraer archivos muy grandes puede llevar tiempo y requerir temporalmente el doble de espacio en disco).*

## ¿Hay una CLI disponible?

Sí. Consulta la página de la [CLI](/es/cli). Disponible en los tres sistemas operativos, es útil para automatizar con Sonarr / Radarr / cron / scripts NAS.

## ¿Cuál es la diferencia entre Gratis y Pro?

| Funcionalidad | Gratis | Pro |
| --- | --- | --- |
| Studio (renombrado) | ✅ 2 archivos / día | ✅ ilimitado |
| Vista previa Antes / Después | ✅ | ✅ |
| Emparejamiento básico de metadatos | ✅ | ✅ |
| Búsquedas de subtítulos OpenSubtitles | ✅ 2 búsquedas / día | ✅ ilimitado |
| Duplicados multi-calidad | ❌ | ✅ |
| Pipeline de automatización | ❌ | ✅ |
| Soporte prioritario | ❌ | ✅ |
| CLI / comandos headless | ⚠️ mismos límites gratis | ✅ |

Visita la página de [Precios](/es/pro) para obtener detalles sobre la licencia Pro.

## ¿Puedo seguir usando CineRename gratis?

Sí. La versión gratuita **no tiene límite de tiempo**. Puedes usarla indefinidamente para renombrar o añadir subtítulos a **un máximo de 2 archivos por día**. Las funciones completas e ilimitadas requieren activar una licencia Pro.

## ¿Cómo funciona la búsqueda de duplicados?

CineRename detecta las múltiples copias de una misma película/episodio basándose en:

- título + año (películas) o serie + temporada + episodio (series)
- resolución, códec, fuente, bitrate, audio, tamaño para puntuar la calidad

Te propone conservar la mejor versión. No hay eliminación sin tu validación. Ver [Duplicados](/es/duplicates).

## ¿Puede CineRename funcionar 100% offline?

Sí y no. La aplicación en sí (la interfaz, el análisis de nombres nativo en Rust, la evaluación de plantillas JavaScript mediante QuickJS, el historial, la limpieza de duplicados locales) funciona sin ninguna conexión a internet.

Sin embargo, las funciones de emparejamiento (obtención de títulos oficiales, IDs y números de episodios) requieren consultar el proveedor de metadatos configurado. Sin internet, CineRename limpiará el nombre del archivo con su parser interno nativo, pero no podrá garantizar el título oficial completo. La descarga de subtítulos es, por supuesto, imposible sin conexión.

## ¿Qué pasa si TheTVDB / OpenSubtitles se caen?

CineRename sigue funcionando:
- Los **renombrados ya previsualizados** en Studio se pueden validar (los metadatos están en caché).
- Los **nuevos archivos** muestran una advertencia en caso de resultados no encontrados — aún puedes renombrar manualmente.
- El **modo automático** registra el error de forma segura; puedes volver a lanzar la vista previa o el pipeline cuando el proveedor esté disponible.

## He encontrado un error. ¿Cómo os lo reporto?

Escribe a [cinerename@gmail.com](mailto:cinerename@gmail.com). Si es posible, adjunta:

- Tu sistema operativo y la versión de CineRename (`Preferencias → Soporte → Copiar configuración`)
- Un ejemplo de nombre de archivo que causa el problema
- El log (`Preferencias → Soporte → Copiar logs`)

## ¿Cómo puedo contribuir?

- **Reportando errores** o solicitando funciones por correo electrónico
- **Sugiriendo mejoras** en los presets de renombrado
- **Traduciendo la interfaz** a un nuevo idioma
- **Comprando una licencia Pro**, que apoya directamente el desarrollo
