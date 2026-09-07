# Solución de problemas

## La aplicación no se inicia

### Windows

- **SmartScreen bloquea la ejecución**: haz clic en **Más información** → **Ejecutar de todas formas**. La aplicación se añadirá a la lista de confianza para futuros inicios.
- **Error WebView2**: asegúrate de que `Microsoft Edge WebView2 Runtime` esté instalado (preinstalado en Windows 11, debe instalarse manualmente en versiones anteriores de Windows 10).

### macOS

- **"CineRename no se puede abrir porque no se puede verificar al desarrollador"**:
  - Haz **clic derecho en el icono → Abrir** (solo funcionará una vez)
  - O: **Preferencias del Sistema → Privacidad y seguridad → Abrir de todos modos**

### Linux

- **AppImage no se inicia**: comprueba `chmod +x CineRename.AppImage`. Si el error menciona FUSE, instala `libfuse2` (`sudo apt install libfuse2` en Ubuntu).
- **Error WebKit**: en algunas distribuciones mínimas, instala `webkit2gtk-4.0` o `webkit2gtk-4.1`.

## Plex / Jellyfin no reconoce mis archivos

1. Comprueba que la **estructura de carpetas** coincida con las convenciones del servidor (ver [Plex / Jellyfin / Emby](/es/media-servers)).
2. Comprueba que el **título + año** son reconocidos por el proveedor usado por tu servidor multimedia. Si no, añade el ID explícitamente cuando tu preset lo soporte (`{tmdb-12345}` o `{tvdb-12345}`).
3. Ejecuta un **escaneo completo** forzando la actualización de los metadatos.
4. Si nada funciona, saca el archivo de la biblioteca, escanea, vuélvelo a poner y vuelve a escanear (Plex Dance).

## Los subtítulos no se descargan

- Comprueba tu **clave API de OpenSubtitles** en **Preferencias → Fuentes y subtítulos**.
- El **hash de video** puede no encontrar nada para archivos muy poco comunes. El fallback a metadatos tomará el relevo — comprueba que el título + temporada + episodio están bien identificados en el Studio.
- Comprueba el **límite de peticiones (rate limit)**: OpenSubtitles limita el número de descargas por día según tu plan.

## El modo automático se ejecuta en bucle

Si CineRename vuelve a procesar el mismo archivo en cada ciclo:
- Comprueba que la **biblioteca final** es diferente de la **carpeta de origen**.
- El watcher debería estar configurado solo en la carpeta de origen.
- Si usas `rsync` para enviar archivos a la carpeta de origen, asegúrate de que termine sus copias antes de que CineRename la vigile (usa una subcarpeta `.in-progress`).

## El renombrado es muy lento

- En **discos duros mecánicos**, las operaciones masivas están limitadas por el I/O. Calcula ~5-10s por cada 100 archivos.
- En un **NAS a través de SMB / NFS**, la latencia multiplica las operaciones. Para volúmenes muy grandes, monta el recurso compartido localmente (sshfs / nfs con `noatime`).
- Copia una ventana breve desde **Preferencias → Soporte → Copiar logs** para identificar el paso lento: escaneo, proveedor, subtítulos, artwork o disco.

## Error «acceso denegado»

- En **Windows**, ejecuta la aplicación como administrador (clic derecho → **Ejecutar como administrador**).
- En **macOS**, Tauri v2 requiere permisos explícitos. Ve a **Preferencias del Sistema → Privacidad → Acceso total al disco** y autoriza a CineRename.
- En **Linux**, comprueba los permisos de la carpeta (`ls -la`) y el propietario (usuario).

## El undo ha fallado

Ver la sección dedicada en [Historial & Undo](/es/history#limitaciones-del-undo). Causas frecuentes:

- Archivo eliminado manualmente fuera de CineRename
- Volumen de origen no montado
- Archivo renombrado después del paso de CineRename

## ¿Cómo compartir logs útiles?

Abre **Preferencias → Soporte**, elige la duración que quieres copiar y pulsa **Copiar logs**. Usa una ventana corta alrededor del problema para evitar compartir días de rutas personales.

En CLI/headless, vuelve a ejecutar el comando y redirige la salida de terminal a un archivo si lo necesitas. Los desarrolladores también pueden usar `CINERENAME_LOG_LEVEL=debug` para diagnósticos locales.

## ¿Dónde están mis datos?

| Sistema / Modo | Datos de aplicación y config | Logs |
| --- | --- | --- |
| Windows (Escritorio) | `%APPDATA%\com.cinerename.desktop\` | `%LOCALAPPDATA%\com.cinerename.desktop\logs\` |
| macOS (Escritorio) | `~/Library/Application Support/com.cinerename.desktop/` | `~/Library/Logs/com.cinerename.desktop/` |
| Linux (Escritorio) | `~/.local/share/com.cinerename.desktop/` | `~/.local/share/com.cinerename.desktop/logs/` |
| Headless / NAS (Linux) | `~/.config/cinerename/` | Salida estándar / redirección por shell |

En la aplicación de escritorio, puedes abrir directamente la carpeta de registros desde **Preferencias → Soporte → Mostrar carpeta de logs**. Puedes eliminar estas carpetas para comenzar desde cero (se borrará el historial local, la caché y los ajustes preestablecidos).

## No he encontrado mi respuesta

- Escribe a [cinerename@gmail.com](mailto:cinerename@gmail.com) con:
  - Tu OS y la versión de CineRename
  - Una descripción precisa del problema
  - Idealmente los logs (`Preferencias → Soporte → Copiar logs`)
