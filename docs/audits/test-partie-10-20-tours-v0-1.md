# Test de partie 10-20 tours v0.1

## Méthode de test

Test effectué avec un petit simulateur interne : `src/engine/simulateGame.ts`, lancé via `scripts/simulate-trajectories.ts`. Le simulateur applique des suites d'actions prédéfinies sur l'état initial, relève les événements systémiques, les jauges finales, les blocs les plus instables et la fin éventuelle.

Commande utilisée pendant l'audit :

```bash
.\node_modules\.bin\esbuild.cmd scripts\simulate-trajectories.ts --bundle --platform=node --format=esm --outfile=.sim\simulate-trajectories.mjs
node .sim\simulate-trajectories.mjs
```

## Trajectoires testées

- Unification prudente : narratif d'unité, diplomatie secrète, conversion écologique, intellectuels critiques, redistribution.
- Empire algorithmique : surveillance prédictive, automatisation administrative, éducation IA, divertissement personnalisé.
- Escalade : défense commune et croissance par dérégulation en alternance.
- Résistance humaine : puissance IA forte, automatisation, divertissement, puis retours critiques et tensions.

## Résumé des parties simulées

| Trajectoire | Tours | Fin | Événements systémiques | Lecture |
| --- | ---: | --- | ---: | --- |
| Unification prudente | 11 | Confédération fragile | 4 | Réussite fragile, cohésion haute et risque bas. |
| Empire algorithmique | 11 | Empire algorithmique | 7 | Puissance IA très haute, autonomie presque nulle. |
| Escalade | 17 | Escalade stratégique | 6 | Le risque monte lentement puis bascule après l'ultimatum. |
| Résistance humaine | 11 | Révolte humaine | 6 | La puissance IA progresse, mais un bloc entre en résistance. |

## Problèmes observés

- Les événements se répétaient après leur disparition du journal tronqué à 10 entrées.
- La Révolte humaine était trop difficile à atteindre : elle exigeait un retournement moyen de tous les blocs, alors que la fiction fonctionne mieux avec un foyer de résistance.
- L'escalade était cohérente mais demandait plus de 15 tours ; elle reste acceptable dans la fenêtre 10-20 tours.
- Le stress climatique peut atteindre 100 dans la trajectoire d'escalade. Ce n'est pas bloquant, mais il faudra surveiller cet effet après playtest.

## Ajustements effectués

- Ajout d'une mémoire interne `triggeredEventIds` pour éviter qu'un événement systémique déjà déclenché revienne après avoir quitté le journal.
- Ajustement de la fin Révolte humaine : elle se déclenche maintenant si la puissance IA est forte, l'autonomie basse, et au moins un bloc combine confiance IA basse et tension sociale élevée.
- Prolongement du scénario de simulation Escalade à 17 tours pour tester son diagnostic dans la fenêtre demandée.
- Ajout d'un ignore `.sim/` pour les sorties temporaires de simulation.

## Limites restantes

- Les simulations restent déterministes et ne remplacent pas une vraie session jouée.
- Les actions n'affichent toujours pas d'aperçu des effets avant clic.
- Les seuils climatiques mériteront un réglage fin après une partie manuelle.
- Le simulateur n'est pas encore branché à une commande npm dédiée.

## Prochaines priorités

1. Jouer manuellement une partie complète en suivant les quatre trajectoires.
2. Vérifier si les diagnostics arrivent trop vite ou trop tard en situation réelle.
3. Ajuster ensuite uniquement les seuils qui gênent la compréhension.

## Ce qu'il ne faut pas ajouter maintenant

- Nouvelles variables visibles.
- Sous-systèmes sociaux ou militaires.
- Arbre narratif.
- Carte détaillée.
- IA générative.
- Backend, authentification ou Supabase.
