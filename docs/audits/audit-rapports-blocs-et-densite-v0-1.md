# Audit rapports de blocs et densité v0.1

## Objectif

Ajouter une couche de lecture dynamique sans créer de simulation sociologique lourde ni réécrire littérairement le jeu.

## Groupes sociaux

Le prototype utilise maintenant un petit ensemble fixe de groupes sociaux :

- travailleurs précaires ;
- classes moyennes ;
- diplômés techniques ;
- intellectuels critiques ;
- élites administratives ;
- élites économiques ;
- jeunesse étudiante.

Chaque bloc possède une saillance interne simple. Ces valeurs ne sont pas affichées au joueur et servent seulement à produire des rapports plus lisibles.

## Rapports de blocs dynamiques

Les rapports de blocs sont générés par des fonctions pures dans `src/engine/reports.ts`. Ils affichent :

- situation générale ;
- groupes sous tension ;
- groupes favorables à l'influence IA ;
- risque principal ;
- tendance récente ;
- lecture stratégique ;
- vulnérabilité et levier probable.

## Tendances

Le moteur conserve les blocs du tour précédent dans `GameState.previousBlocks`. Les rapports comparent ensuite stabilité, richesse, éducation, liberté, confiance IA et tension sociale.

## Onglet Blocs

Les cartes de blocs ne se limitent plus aux jauges. Elles ajoutent une humeur sociale, une vulnérabilité stratégique et un levier probable. Cela prépare un futur onglet plus riche sans ajouter de sous-système.

## Rapport d'évolution

Le rapport d'évolution gagne des sections plus denses :

- synthèse ;
- interventions immédiates ;
- préparations ;
- opérations débloquées ;
- effets globaux ;
- blocs affectés ;
- groupes sociaux ;
- événement systémique ;
- signaux faibles.

## Journal

Les entrées de journal conservent leur format court, mais le résumé d'opération inclut maintenant une conséquence systémique ou une phrase d'interprétation. La réécriture littéraire complète reste différée.

## Limites

- Les groupes sociaux ne sont pas des populations simulées.
- Les textes restent fonctionnels et parfois répétitifs.
- Les leviers probables sont indicatifs.
- La densité nouvelle doit être testée pour éviter l'effet tableau de bord.

## Prochaine priorité

Playtest de huit à dix tours en vérifiant si les rapports de blocs aident vraiment à choisir une cible ou une opération préparée.
