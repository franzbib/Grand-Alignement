# Audit carte simplifiée et analyse des blocs v0.1

## Objectif

Réduire la surcharge visuelle de la carte et déplacer l'analyse détaillée vers l'onglet Blocs.

## Carte simplifiée

La carte est désormais traitée comme une carte d'observation synthétique. Elle sert à répondre vite à trois questions :

- où sont les six blocs ;
- quel est l'état dominant de chaque bloc ;
- quel bloc est sélectionné.

Les halos ont été réduits, les labels relationnels ont été retirés et la carte n'affiche plus que deux arcs de tension maximum.

## Analyse détaillée des blocs

L'onglet Blocs devient l'espace d'inspection. Il contient :

- une liste de blocs sélectionnables ;
- un panneau d'analyse du bloc sélectionné ;
- synthèse du bloc ;
- jauges principales ;
- tendances récentes ;
- groupes sociaux ;
- relations extérieures ;
- vulnérabilités ;
- leviers possibles ;
- derniers signaux.

La logique de rapport reste centralisée dans `src/engine/reports.ts`.

## Sélection cohérente

La sélection de bloc est conservée dans l'état React principal. Un bloc cliqué sur la carte reste sélectionné dans l'onglet Blocs. Une sélection dans l'onglet Blocs met à jour le même état.

## Relations

Les relations restent visibles, mais la carte ne tente plus de tout afficher. Le détail des relations du bloc sélectionné est déplacé dans l'analyse de bloc.

## Limites

- Pas de graphique historique.
- Pas de filtre de relations.
- Les textes restent fonctionnels et devront être repris plus tard.
- Le panneau d'analyse doit être testé en partie réelle pour vérifier qu'il aide vraiment le choix de cible.

## Prochaine priorité

Playtest manuel de dix tours : vérifier si la carte simplifiée reste utile et si l'onglet Blocs devient le bon lieu d'analyse.
