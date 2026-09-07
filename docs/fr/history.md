# Historique & Undo

Tout ce que CineRename modifie sur votre disque est **traçable** et **réversible**. L'onglet **Historique** est votre machine à remonter le temps.

## Ce qui est enregistré

Pour chaque lot de renommage exécuté dans le Studio, le CLI ou le pipeline d'automatisation, CineRename enregistre :

- **Date et heure** précises (début, fin, annulation)
- **Statut du lot** (`running`, `applied`, `failed`, `undone`)
- **Avant / Après** complets pour chaque fichier (chemin et nom d'origine, chemin et nom renommés, type de média)
- Le **modèle de renommage** appliqué
- La **disponibilité de l'annulation** et l'état de validation

Les données sont stockées localement dans une base **SQLite** (via `rusqlite` dans le cœur Rust). Aucune donnée n'est envoyée vers des serveurs externes ou le cloud.

::: info Ce qui ne figure pas dans l'Historique
La table SQLite d'historique suit exclusivement les lots de renommage et de déplacement. Les téléchargements de sous-titres et les suppressions de doublons sont des actions distinctes non suivies sous forme de lots annulables.
:::

## Organisation de la vue Historique

L'écran Historique propose une liste virtualisée unifiée regroupée chronologiquement :

- **Regroupement par date** — sections Aujourd'hui, Hier et dates antérieures
- **Recherche en temps réel** — filtrage des lots et entrées par nom ou chemin de fichier d'origine ou renommé
- **Filtre de statut** — afficher tous les lots, uniquement les restaurables, les déjà annulés ou les échecs
- **Tri** — ordre chronologique (du plus récent ou du plus ancien)

## Annuler (undo)

Sélectionnez une opération et cliquez sur **Annuler**. CineRename :

1. Vérifie que les fichiers existent toujours à leur destination
2. Demande confirmation
3. Restaure les noms / emplacements d'origine
4. Marque l'opération annulée dans l'historique (avec un nouvel enregistrement "annulation")

::: tip Annulation en chaîne
Vous pouvez annuler plusieurs jours de modifications successives — l'historique remonte jusqu'au début de votre installation.
:::

## Limitations de l'undo

L'annulation peut échouer si :

- Les fichiers ont été **supprimés manuellement** entre temps (pas dans la corbeille).
- Vous avez **renommé manuellement** un fichier après le passage de CineRename — l'undo ne sait pas qu'il s'agit du même fichier.
- Le **disque source** n'est plus monté (NAS débranché, clé USB retirée).

Dans ces cas, CineRename signale l'échec et conserve l'enregistrement original pour référence.

## Sélection multiple

`Ctrl + clic` (ou `Cmd + clic`) pour sélectionner plusieurs opérations, puis **Annuler la sélection**. Les annulations sont effectuées dans l'ordre inverse (LIFO) pour respecter les dépendances entre opérations.

Vous pouvez aussi utiliser `Ctrl+A` (ou `Cmd+A` sur macOS) hors du champ de recherche pour sélectionner ou vider tous les lots restaurables.

## Réinitialiser l'historique local

L'application desktop ne synchronise pas l'historique dans le cloud. Si vous voulez repartir de zéro, sauvegardez ce qui doit l'être, copiez les diagnostics depuis **Préférences → Support** si besoin, puis supprimez le dossier local de données CineRename de votre système. Supprimer l'historique supprime aussi la possibilité d'annuler les anciennes opérations.
