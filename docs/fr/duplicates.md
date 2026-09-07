# Doublons

Le module **Doublons** scanne votre bibliothèque pour repérer les copies multiples d'un même film ou épisode, et vous aide à libérer de l'espace en gardant uniquement la meilleure version.

## Comment ça marche

1. Vous pointez un dossier (ou plusieurs).
2. CineRename indexe tous les fichiers vidéo, calcule un score de qualité, et regroupe par identité de média (titre + année pour les films, série + saison + épisode pour les séries).
3. Le résultat est affiché par **clusters** : un cluster = plusieurs fichiers qui désignent le même contenu.

![Aperçu des clusters de doublons](/assets/img/duplicates-clusters.png)

## Le score de qualité

Chaque fichier reçoit un score basé sur :

- **Résolution** — 4K > 1440p > 1080p > 720p > 480p
- **Codec** — HEVC/AV1 (efficacité) avec malus pour codecs anciens
- **Source** — BluRay > WEBRip > HDTV > DVDRip
- **Bitrate** — bonus pour les bitrates élevés à résolution égale
- **Audio** — DTS-HD MA / TrueHD > DTS / DD+ > AC3 / AAC
- **Taille** — pour départager à qualité technique équivalente

Le fichier avec le score le plus élevé est marqué **À conserver**, les autres **Candidats à la suppression**.

::: tip Pas de suppression automatique
Aucun fichier n'est jamais supprimé sans votre accord explicite. Le module ne fait que **proposer**.
:::

## Menu contextuel

Sur chaque ligne du cluster, **clic droit** ouvre :

- **Ouvrir l'emplacement** — Finder / Explorer / Files manager natif
- **Lire la vidéo** — lance votre lecteur par défaut
- **Forcer la conservation** — marque ce fichier comme "à conserver" (override le scoring)
- **Forcer la suppression** — marque pour suppression
- **Exclure du cluster** — si CineRename a regroupé à tort

## Raccourci clavier

| Action | Windows / Linux | macOS |
| --- | --- | --- |
| Scanner le lot Studio courant | <kbd>Ctrl</kbd> + <kbd>F</kbd> | <kbd>Cmd</kbd> + <kbd>F</kbd> |

## Suppression des doublons

Lorsque vous choisissez de supprimer des fichiers candidats :

1. CineRename affiche une boîte de dialogue de confirmation explicite (`Supprimer définitivement ce fichier ? Cette action est irréversible.`).
2. Le fichier est définitivement supprimé du système de fichiers (délié atomiquement s'il est inchangé).
3. **Opération irréversible** : les fichiers ne vont pas dans la corbeille du système et les suppressions de doublons ne sont pas consignées dans l'Historique de renommage.

::: warning Suppression définitive
Comme la suppression de doublons délie directement le fichier du stockage au lieu de le déplacer dans la corbeille du système d'exploitation, les fichiers supprimés ne peuvent être récupérés depuis la corbeille ni annulés depuis l'Historique. Vérifiez toujours soigneusement votre sélection avant de confirmer.
:::

## Bonnes pratiques

- **Toujours renommer avant** — sinon CineRename peine à matcher `MovieX.1080p.x264-GROUP.mkv` avec `MovieX.4k.HDR.mkv` car les noms ne se ressemblent pas.
- **Lancer un dry-run** d'abord — explorez les clusters, ajustez les overrides, puis seulement supprimez.
- **Vérifier les éditions multiples** — pour les films, "Director's Cut", "Extended", "Theatrical" ne sont **pas** considérés comme doublons s'ils sont nommés explicitement.

## Limitations connues

- Pour les **multi-disques** (un film coupé en `Movie - cd1.mkv` + `Movie - cd2.mkv`), CineRename les groupe correctement seulement si la convention `cd1`/`cd2` ou `part1`/`part2` est respectée.
- Pour les **archives mixtes** (zips contenant plusieurs versions), il faut d'abord extraire ou utiliser le Studio pour les normaliser.
