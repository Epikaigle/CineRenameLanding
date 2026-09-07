# Carpetas vigiladas

CineRename puede vigilar carpetas en segundo plano y **auto-importar cualquier video nuevo que aparezca allí** en el Studio. Ideal para las carpetas de descargas, de recepción en NAS o el Inbox de Sonarr / Radarr.

## Configuración

En **Preferencias → Carpetas vigiladas**:

1. Haz clic en **Añadir una carpeta**
2. Selecciona la carpeta a vigilar (recursivo por defecto)
3. La carpeta aparece en la lista, con una insignia de **Activa**

Puedes **pausar** una carpeta (el watcher se detiene pero la configuración se mantiene) o **eliminarla** por completo.

## Comportamiento

Cuando un nuevo archivo multimedia (extensiones de video soportadas + subtítulos) aparece en una carpeta activa:

1. El watcher de disco (basado en `notify` en el lado de Rust) detecta el evento.
2. Se aplica un debounce (retraso) de **1.5 s**, seguido de una comprobación automática de estabilidad del archivo (verificando que el tamaño y los sellos de tiempo permanezcan estables) para evitar leer un archivo que aún se está escribiendo.
3. Las nuevas rutas se envían al Studio como una importación normal (equivalente a arrastrar y soltar).
4. Si el **Modo Automático** está activo, el pipeline completo (renombrado + subtítulos + movimiento) se desencadena por sí solo.
5. Una notificación de estado confirma: *«3 nuevo(s) archivo(s) detectado(s) en "Downloads" — importados al Studio.»*

## Alternativa para servidores Headless (NAS)

Para una vigilancia continua en un **NAS sin interfaz gráfica (GUI)**, el watcher de la aplicación de escritorio no es adecuado. 

La solución oficial consiste en utilizar la CLI headless de CineRename junto con una tarea Cron o el comando integrado `schedule`:

1. Conéctate por SSH a tu NAS.
2. Edita el archivo cron: `crontab -e`
3. Añade una línea para revisar la carpeta cada 5 minutos:
   ```bash
   */5 * * * * /usr/local/bin/cinerename auto /mnt/Downloads --to /mnt/Library --json >> /var/log/cinerename.log 2>&1
   ```
   O ejecuta el planificador daemon directamente (por ejemplo en Docker o un servicio systemd):
   ```bash
   cinerename schedule /mnt/Downloads --every 5m --to /mnt/Library --json
   ```

Este método es mucho más robusto para servidores 24/7, ya que lanza el procesamiento a intervalos regulares de forma autónoma. Consulta [Línea de comandos (CLI)](/es/cli) para más detalles.

## Limitaciones

- **El watcher solo se ejecuta cuando la app de escritorio está abierta.** Si cierras la ventana, la vigilancia se detiene. Para 24/7, utiliza el método Cron anterior.
- Los **eventos de renombrado** (movimiento interno, mv) se detectan pero desencadenan una importación — si renombras manualmente un archivo ya importado, espera una segunda importación. El detector de duplicados compensa estos casos.
- La vigilancia no extrae archivos comprimidos — un `.zip` que aparezca no se descomprime automáticamente. Importalo manualmente.

## Recomendaciones

- Para una carpeta de **descargas**: combínalo con el **Modo Automático** y un destino (`/Plex/Series`) — pipeline 100% sin intervención (manos libres).
- Para una carpeta de **NAS compartida**: deja que la máquina principal haga la vigilancia con la GUI abierta (o usa la CLI en el NAS, que es más robusta).
- Para evitar importaciones prematuras: configura tu programa de descargas para usar una **carpeta temporal** (`.partial`, `_incomplete`) y una **carpeta final** separada, y vigila únicamente la final.
