# Historial & Undo

Todo lo que CineRename modifica en tu disco es **rastreable** y **reversible**. La pestaña de **Historial** es tu máquina del tiempo.

## Qué se registra

Para cada lote de renombrado ejecutado en Studio, la CLI o el pipeline de automatización, CineRename registra:

- **Fecha y hora** precisas (inicio, finalización, reversión)
- **Estado del lote** (`running`, `applied`, `failed`, `undone`)
- **Antes / Después** completo para cada archivo (ruta y nombre original, ruta y nombre renombrado, tipo de medio)
- La **plantilla de renombrado** aplicada
- **Disponibilidad para deshacer** y estado de validación

Los datos se almacenan localmente en una base de datos **SQLite** (a través de `rusqlite` en el núcleo de Rust). No se envía ningún dato a servidores externos ni a la nube.

::: info Qué no se incluye en el Historial
La tabla SQLite de historial rastrea exclusivamente lotes de renombrado y traslado. Las descargas de subtítulos y las eliminaciones de duplicados son acciones independientes que no se registran como lotes reversibles.
:::

## Organización y visualización del Historial

La pantalla de Historial ofrece una lista virtualizada unificada agrupada cronológicamente:

- **Agrupado por fecha** — secciones para Hoy, Ayer y fechas anteriores
- **Búsqueda en tiempo real** — filtra lotes y entradas por nombre o ruta de archivo original o renombrado
- **Filtro de estado** — muestra todos los lotes, solo los restaurables, los ya revertidos o los fallidos
- **Ordenación** — orden cronológico (más reciente o más antiguo primero)

## Deshacer (undo)

Selecciona una operación y haz clic en **Deshacer**. CineRename:

1. Comprueba que los archivos sigan existiendo en su destino
2. Pide confirmación
3. Restaura los nombres y las ubicaciones originales
4. Marca la operación como deshecha en el historial (con un nuevo registro de "anulación")

::: tip Anulación en cadena
Puedes deshacer varios días de modificaciones sucesivas — el historial se remonta hasta el inicio de tu instalación.
:::

## Limitaciones del undo

La anulación puede fallar si:

- Los archivos han sido **eliminados manualmente** entretanto (no están en la papelera).
- Has **renombrado manualmente** un archivo después de que CineRename lo procesara — el undo no sabe que se trata del mismo archivo.
- El **disco de origen** ya no está montado (NAS desconectado, llave USB retirada).

En estos casos, CineRename notifica el fallo y conserva el registro original como referencia.

## Selección múltiple

`Ctrl + clic` (o `Cmd + clic`) para seleccionar múltiples operaciones, y luego **Deshacer selección**. Las anulaciones se realizan en orden inverso (LIFO) para respetar las dependencias entre las operaciones.

También puedes pulsar `Ctrl+A` (o `Cmd+A` en macOS) fuera del campo de búsqueda para seleccionar o vaciar todos los lotes restaurables.

## Restablecer el historial local

La aplicación de escritorio no sincroniza el historial con la nube. Si necesitas empezar desde cero, guarda lo importante, copia diagnósticos desde **Preferencias → Soporte** si los necesitas y elimina la carpeta local de datos de CineRename de tu sistema. Eliminar el historial también elimina la posibilidad de deshacer operaciones antiguas.
