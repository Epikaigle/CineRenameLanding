# Claves API y proveedores

CineRename puede consultar varios proveedores externos según la función que uses:

- **TheTVDB** — películas, series, temporadas, episodios, títulos localizados, posters e imágenes cuando están disponibles
- **TVmaze** — complemento a TheTVDB para series de TV (datos abiertos, sin clave)
- **AniList** — búsqueda de anime y numeración absoluta cuando está disponible
- **Kitsu** — búsqueda alternativa de anime
- **OpenSubtitles** — búsqueda y descarga de subtítulos

Para que la aplicación funcione desde la instalación, CineRename puede incluir claves de proveedor durante la compilación. No necesitas configurar nada para empezar, pero tus propias claves pueden ayudar con grandes volúmenes o cuotas dedicadas.

## ¿Por qué proporcionar tu propia clave?

- **Cuotas más altas** — útil para procesar volúmenes muy grandes
- **Cuota dedicada** — útil para uso intensivo de TheTVDB u OpenSubtitles
- **Funciones de cuenta** — la subida a OpenSubtitles requiere tu propia clave API y credenciales
- **Rotación en CI / staging** — equipos que prueban en un entorno aislado

## Orden de resolución

Si varias fuentes proporcionan una clave, CineRename utiliza la primera que encuentre según este orden:

1. **Variable de entorno en tiempo de ejecución**
   - `CINERENAME_TVDB_API_KEY`
   - `CINERENAME_TVDB_SUBSCRIBER_PIN`
   - `CINERENAME_OPENSUBTITLES_API_KEY`
   - `CINERENAME_OPENSUBTITLES_USERNAME`
   - `CINERENAME_OPENSUBTITLES_PASSWORD`
   - `CINERENAME_OPENSUBTITLES_USER_AGENT`
2. **Valor introducido en Preferencias → Fuentes y subtítulos** (guardado en el almacén de secretos / llavero del sistema cuando es sensible)
3. **Archivo `providers.toml`** en la subcarpeta `<config-dir>/providers/`
4. **Clave incluida por defecto** compilada en la app

## Configurar a través de la UI

**Preferencias → Fuentes y subtítulos**:

- TheTVDB: campo **API Key** y opcional **PIN de suscriptor**
- OpenSubtitles: campo **API Key** + credenciales (usuario/contraseña) si tienes una cuenta premium

Los valores sensibles se guardan con el almacén de credenciales / llavero del sistema cuando está disponible, no en texto claro en SQLite. Nunca salen de tu equipo salvo cuando se envían al proveedor correspondiente.

## Configurar a través de un archivo

Crea (o edita) `providers.toml` dentro de la subcarpeta `providers/` de tu directorio de configuración:

| Sistema / Modo | Ruta |
| --- | --- |
| Windows (Escritorio) | `%APPDATA%\com.cinerename.desktop\providers\providers.toml` |
| macOS (Escritorio) | `~/Library/Application Support/com.cinerename.desktop/providers/providers.toml` |
| Linux (Escritorio) | `~/.local/share/com.cinerename.desktop/providers/providers.toml` |
| Headless / NAS (Linux) | `~/.config/cinerename/providers/providers.toml` |

Formato:

```toml
[thetvdb]
enabled = true
api_key = "tu-clave-tvdb"
subscriber_pin = "tu-pin-suscriptor"

[opensubtitles]
enabled = true
api_key = "tu-clave-opensubtitles"
username = "tu-usuario"
password = "tu-contraseña"
user_agent = "CineRename"
```

## Build personalizado

Para generar un binario de CineRename con claves diferentes (rotación en CI, staging):

```bash
export CINERENAME_BUNDLED_TVDB_API_KEY="..."
export CINERENAME_BUNDLED_OPENSUBTITLES_API_KEY="..."
npm run dist
```

## Obtener tus propias claves

| Proveedor | Cómo hacerlo |
| --- | --- |
| **TheTVDB** | Crea una cuenta en [thetvdb.com](https://thetvdb.com/) → API → Subscriptions |
| **OpenSubtitles** | Crea una cuenta en [opensubtitles.com](https://www.opensubtitles.com/) → Consumers → New API consumer |
| **TVmaze** | No requiere clave (API pública, con límite de tasa de 20 req/s) |
| **AniList** | No requiere clave para las funciones públicas usadas por CineRename |
| **Kitsu** | No requiere clave para las funciones públicas usadas por CineRename |
