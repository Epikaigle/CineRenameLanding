# Export de données

CineRename ne se contente pas de renommer vos fichiers, il vous permet également d'exporter des données utiles sous des formats standardisés pour alimenter d'autres outils (tableurs, scripts, bases de données).

## Exporter le rapport de renommage

Dans le **Studio**, une fois que vous avez simulé ou validé un renommage, vous pouvez cliquer sur le bouton **Exporter le rapport** situé dans la barre d'outils.

Le fichier généré contient l'aperçu exact de la simulation et des modifications, formaté au choix :

- **CSV** (Comma-Separated Values) : Parfait pour ouvrir dans Excel ou Google Sheets. Contient les colonnes : `status`, `source_path`, `current_name`, `suggested_name`, `target_path`, `media_kind`, `detected_kind`, `source_label`, `confidence`, `template_name`, `warnings`, `error_message`.
- **JSON** : Objet structuré avec `generatedAt`, `batchId`, `summary` (`totalItems`, `readyCount`, `reviewCount`, `blockedCount`), et `items`.
- **Markdown** (`.md`) : Tableau formaté avec résumé du lot, totaux et indicateurs de statut.

Statuts des correspondances :
- `ready` : correspondance sûre prête à être appliquée
- `review` : confiance faible ou ambiguë nécessitant confirmation
- `blocked` : erreur de validation, conflit ou chemin impossible à résoudre

### Exemple de rapport JSON

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

## Exporter une liste d'épisodes (Planning)

Si vous avez chargé une série dans CineRename, le logiciel a récupéré la structure complète de la série depuis TheTVDB ou TVmaze (y compris les épisodes manquants ou non encore diffusés).

Vous pouvez exporter cette liste complète pour suivre vos visionnages ou planifier vos téléchargements :

1. Cliquez sur l'icône **Options de la série** (les trois petits points) à côté du nom de la série dans le panneau latéral.
2. Cliquez sur **Exporter la liste des épisodes**.
3. Choisissez le format :
   - `CSV`
   - `TSV` (Tab-Separated Values)
   - `JSON`

L'export inclut :
- Le titre de la série
- La saison et le numéro d'épisode
- Le titre de l'épisode (dans votre langue de préférence)
- La date de diffusion officielle (Air Date)
- L'identifiant absolu (utile pour les animes)

::: tip Automatisation
Si vous utilisez la CLI (`cinerename`), vous pouvez forcer un rendu en JSON avec le flag `--json` pour récupérer toutes les métadonnées sur la sortie standard (`stdout`), ce qui équivaut à un export automatisé.
:::
