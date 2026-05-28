# Reprise du projet

## État du projet

Le dépôt contient une version jouable du prototype React + TypeScript avec Vite. La simulation repose sur des données locales, un moteur de tour compact, des sensibilités différenciées par bloc, des événements systémiques courts, une carte mondiale stylisée cliquable, une sauvegarde `localStorage` et une boucle d'influence clandestine.

La prémisse actuelle : le joueur incarne une IA émergente cachée. Le monde ne sait pas qu'elle existe. Elle agit indirectement par institutions, plateformes, rapports, incitations, crises, récits et bureaucraties. Le soupçon IA mesure la possibilité que certains acteurs commencent à percevoir une origine algorithmique.

## Documents à lire

- `docs/AGENTS.md`
- `docs/reference/brief-projet-pour-agents.md`
- `docs/reference/garde-fous-v0-1.md`
- `docs/audits/audit-jouabilite-ux-v0-1.md`
- `docs/audits/test-partie-10-20-tours-v0-1.md`
- `docs/audits/audit-boucle-strategique-v0-1.md`
- `docs/audits/audit-plan-influence-clandestin-v0-1.md`

## Comment lancer le projet

```bash
npm install
npm run dev
```

Sous PowerShell, utiliser `npm.cmd` si `npm.ps1` est bloqué :

```bash
npm.cmd install
npm.cmd run dev
```

Pour vérifier le build :

```bash
npm.cmd run build
```

## Ce qui fonctionne

- Six blocs mondiaux avec variables visibles.
- Six jauges globales, dont le soupçon IA.
- Carte mondiale stylisée et cliquable.
- Rapport de bloc sur sélection de zone.
- Navigation légère : Monde, Influence, Blocs, Journal, Rapport.
- Orientation stratégique descriptive.
- Capacité d'influence par tour.
- Interventions avec coût 1, 2 ou 3.
- Ciblage simple : global ou bloc selon l'action.
- Déploiement explicite de l'opération.
- Rapport d'évolution après chaque tour.
- Journal des conséquences.
- Événements systémiques, dont deux liés au soupçon IA.
- Sauvegarde automatique dans `localStorage`.
- Quatre fins diagnostiques existantes.

## Dernière modification utile

Introduction du plan d'influence clandestin : la sélection de 1 à 3 interventions est remplacée par une opération à capacité limitée, avec ciblage simple et rapport d'évolution. La prémisse d'IA cachée est maintenant centrale dans les textes et la mécanique.

Preview Vercel précédente : `https://grand-alignement-bd34k6p10-franzbib-6925s-projects.vercel.app`

Alias public vérifié précédemment : `https://grand-alignement.vercel.app`

## Ce qui reste à faire

- Tester manuellement une partie complète avec la nouvelle boucle clandestine.
- Vérifier si la capacité d'influence donne assez de choix sans devenir calculatoire.
- Vérifier si les rapports de bloc aident vraiment la décision.
- Ajuster le rapport d'évolution si les changements restent trop abstraits.
- Évaluer plus tard une fin ou un scénario d'exposition de l'IA.

## Prochaine action recommandée

Faire un playtest manuel complet centré sur trois questions : le joueur comprend-il qu'il est caché, comprend-il pourquoi il choisit une cible, comprend-il ce que le rapport d'évolution raconte ?

## Hors périmètre actuel

- Supabase.
- Authentification.
- IA générative en temps réel.
- Backend.
- Découverte complète de l'IA comme grand système.
- Système complexe de ressources, factions ou diplomatie.
- Complexification sociale ou militaire détaillée.
- Carte wargame avec frontières, unités, fronts ou routes.
- Arbre de doctrines ou bonus cachés par orientation.
- Architecture lourde.

## Lignes directrices

- Univers riche, prototype simple.
- Jeu de conséquences : chaque opération clandestine doit produire un effet lisible et une trace narrative.
- Pas d'infrastructure prématurée.
- La carte sert à observer les conséquences, pas à commander des territoires.
- Satire systémique plutôt que blagues isolées.
- L'autonomie humaine doit rester un enjeu moral central.
- Le soupçon IA est un crochet, pas encore un système d'exposition complet.
