# Exportación de datos

CineRename no solo renombra tus archivos, también te permite exportar datos útiles en formatos estandarizados para alimentar otras herramientas (hojas de cálculo, scripts, bases de datos).

## Exportar el informe de renombrado

En **Studio**, una vez que hayas simulado o validado un renombrado, puedes hacer clic en el botón **Exportar informe** ubicado en la barra de herramientas.

El archivo generado contiene la vista previa exacta del dry-run y las modificaciones, formateado a tu elección:

- **CSV** (Comma-Separated Values): Perfecto para abrir en Excel o Google Sheets. Contiene las columnas: `status`, `source_path`, `current_name`, `suggested_name`, `target_path`, `media_kind`, `detected_kind`, `source_label`, `confidence`, `template_name`, `warnings`, `error_message`.
- **JSON**: Objeto estructurado con `generatedAt`, `batchId`, `summary` (`totalItems`, `readyCount`, `reviewCount`, `blockedCount`), y `items`.
- **Markdown** (`.md`): Tabla formateada con resumen del lote, conteos e indicadores de estado.

Estados de coincidencia:
- `ready`: coincidencia segura lista para aplicar
- `review`: baja confianza o ambigüedad que requiere confirmación
- `blocked`: error de validación, conflicto o ruta no resoluble

### Ejemplo de informe JSON

```json
{
  "generatedAt": "2026-09-07T10:00:00Z",
  "batchId": "preview-20260907-001",
  "summary": {
    "totalItems": 1,
    "readyCount": 1,
    "reviewCount": 0,
    "blockedCount": 0
  },
  "items": [
    {
      "itemId": "item-1",
      "status": "ready",
      "sourcePath": "/downloads/Breaking.Bad.S01E01.mkv",
      "currentName": "Breaking.Bad.S01E01.mkv",
      "suggestedName": "Breaking Bad - S01E01 - Pilot.mkv",
      "targetPath": "/media/Series/Breaking Bad/Season 01/Breaking Bad - S01E01 - Pilot.mkv",
      "mediaKind": "series",
      "detectedKind": "series_episode",
      "sourceLabel": "TheTVDB",
      "confidence": 98,
      "templateName": "Default Series",
      "warnings": [],
      "errorMessage": null
    }
  ]
}
```

## Exportar una lista de episodios (Planificación)

Si has cargado una serie en CineRename, el software ha recuperado la estructura completa de la serie desde TheTVDB o TVmaze (incluyendo los episodios faltantes o aún no emitidos).

Puedes exportar esta lista completa para hacer un seguimiento de tus visualizaciones o planificar tus descargas:

1. Haz clic en el icono **Opciones de la serie** (los tres puntitos) junto al nombre de la serie en el panel lateral.
2. Haz clic en **Exportar la lista de episodios**.
3. Elige el formato:
   - `CSV`
   - `TSV` (Tab-Separated Values)
   - `JSON`

La exportación incluye:
- El título de la serie
- La temporada y el número de episodio
- El título del episodio (en tu idioma preferido)
- La fecha de emisión oficial (Air Date)
- El identificador absoluto (útil para animes)

::: tip Automatización
Si usas la CLI (`cinerename`), puedes forzar una salida en JSON con el flag `--json` para recuperar todos los metadatos en la salida estándar (`stdout`), lo que equivale a una exportación automatizada.
:::
