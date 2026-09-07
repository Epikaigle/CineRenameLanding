# Data Export

CineRename doesn't just rename your files, it also allows you to export useful data in standardized formats to feed other tools (spreadsheets, scripts, databases).

## Export the renaming report

In the **Studio**, once you have simulated or validated a renaming, you can click the **Export report** button located in the toolbar.

The generated file contains the exact dry-run preview and modifications, formatted as chosen:

- **CSV** (Comma-Separated Values): Perfect for opening in Excel or Google Sheets. Contains columns: `status`, `source_path`, `current_name`, `suggested_name`, `target_path`, `media_kind`, `detected_kind`, `source_label`, `confidence`, `template_name`, `warnings`, `error_message`.
- **JSON**: Structured object with `generatedAt`, `batchId`, `summary` (`totalItems`, `readyCount`, `reviewCount`, `blockedCount`), and `items`.
- **Markdown** (`.md`): Formatted table with batch summary, counts, and status indicators.

Item match statuses:
- `ready`: confident match ready to apply
- `review`: low confidence or ambiguous match requiring confirmation
- `blocked`: validation error, conflict, or unresolvable path

### JSON report example

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

## Export an episode list (Schedule)

If you have loaded a series into CineRename, the software has retrieved the complete structure of the series from TheTVDB or TVmaze (including missing or unaired episodes).

You can export this complete list to track your watch history or plan your downloads:

1. Click on the **Series options** icon (the three little dots) next to the series name in the side panel.
2. Click on **Export episode list**.
3. Choose the format:
   - `CSV`
   - `TSV` (Tab-Separated Values)
   - `JSON`

The export includes:
- The series title
- The season and episode number
- The episode title (in your preferred language)
- The official air date (Air Date)
- The absolute identifier (useful for animes)

::: tip Automation
If you use the CLI (`cinerename`), you can force a JSON output with the `--json` flag to retrieve all metadata on standard output (`stdout`), which is equivalent to an automated export.
:::
