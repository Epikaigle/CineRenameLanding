# Dossiers surveillés

CineRename peut surveiller des dossiers en arrière-plan et **auto-importer toute nouvelle vidéo qui y apparaît** dans le Studio. Idéal pour les dossiers de téléchargement, de réception NAS, ou de Inbox Sonarr / Radarr.

## Configuration

Dans **Préférences → Dossiers surveillés** :

1. Cliquez sur **Ajouter un dossier**
2. Sélectionnez le dossier à surveiller (récursif par défaut)
3. Le dossier apparaît dans la liste, avec un badge **Actif**

Vous pouvez **mettre en pause** un dossier (le watcher s'arrête mais la config reste) ou le **retirer** complètement.

## Comportement

Quand un nouveau fichier média (extensions vidéo supportées + sous-titres) apparaît dans un dossier actif :

1. Le watcher disque (basé sur `notify` côté Rust) détecte l'événement.
2. Un débouncage de **1.5 s** est appliqué, suivi d'une vérification automatisée de stabilité du fichier (vérifiant que la taille et les horodatages restent stables) afin d'éviter de lire un fichier encore en cours d'écriture.
3. Les nouveaux chemins sont envoyés au Studio comme un import normal (équivalent à un drag-and-drop).
4. Si le **Mode Automatique** est actif, le pipeline complet (renommage + sous-titres + déplacement) se déclenche tout seul.
5. Une notification status confirme : *« 3 nouveau(x) fichier(s) détecté(s) dans "Downloads" — importés dans le Studio. »*

## Alternative pour les Serveurs Headless (NAS)

Pour une surveillance continue sur un **NAS sans interface graphique (GUI)**, le watcher de l'application de bureau n'est pas adapté. 

La solution officielle consiste à utiliser la CLI headless CineRename couplée à une tâche Cron ou à la commande intégrée `schedule` :

1. Connectez-vous en SSH sur votre NAS.
2. Éditez le fichier cron : `crontab -e`
3. Ajoutez une ligne pour vérifier le dossier toutes les 5 minutes :
   ```bash
   */5 * * * * /usr/local/bin/cinerename auto /mnt/Downloads --to /mnt/Library --json >> /var/log/cinerename.log 2>&1
   ```
   Ou exécutez directement le planificateur autonome (par ex. dans Docker ou un service systemd) :
   ```bash
   cinerename schedule /mnt/Downloads --every 5m --to /mnt/Library --json
   ```

Cette méthode est beaucoup plus robuste pour les serveurs 24/7, car elle lance le traitement à intervalles réguliers de manière autonome. Consultez [Ligne de commande (CLI)](/fr/cli) pour plus de détails.

## Limitations

- **Le watcher tourne uniquement quand l'app desktop est ouverte.** Si vous fermez la fenêtre, la surveillance s'arrête. Pour du H24, voir la méthode Cron ci-dessus.
- Les **événements de renommage** (mv interne) sont détectés mais déclenchent un import — si vous renommez manuellement un fichier déjà importé, attendez-vous à un second import. Le détecteur de doublons rattrape ces cas.
- Le watch n'extrait pas les archives — un `.zip` qui apparaît n'est pas décompressé automatiquement. Importez-le manuellement.

## Recommandations

- Pour un dossier de **téléchargement** : combinez avec le **Mode Automatique** et une cible (`/Plex/Series`) — pipeline 100% mains libres.
- Pour un dossier de **NAS partagé** : laissez la machine principale faire la surveillance avec la GUI ouverte (ou utilisez la CLI sur le NAS, plus robuste).
- Pour éviter les imports prématurés : configurez votre téléchargeur pour utiliser un **dossier temporaire** (`.partial`, `_incomplete`) et un **dossier final** distinct, et surveillez uniquement le final.
