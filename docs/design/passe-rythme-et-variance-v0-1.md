# Passe « Rythme et variance » — v0.1

## 1. Statut du document

Troisième et dernière passe issue de l'audit de jouabilité (`docs/audits/audit-jouabilite-interet-v0-2.md`). Elle implémente les deux recommandations P2 restantes : la variance contrôlée (recommandation 8) et le tour d'observation (recommandation 9). Avec elle, les neuf recommandations de l'audit sont traitées. Tout est implémenté, compilé et vérifié par `npm run simulate:strategies` (sur quatre seeds) et `npm run simulate:trajectories`.

## 2. Tour d'observation (recommandation 9)

### 2.1 Intention

L'IA pouvait être discrète ; elle ne pouvait pas se taire. `applyTurnPlan` exigeait au moins une intervention, ce qui interdisait le choix de rythme le plus thématique du jeu : laisser le monde tourner sans impulsion pour que les anomalies se dissolvent dans le bruit.

### 2.2 Fonctionnement

Un plan vide est désormais un tour d'observation à part entière (`src/engine/gameEngine.ts`). Le monde continue intégralement — dérive, événements systémiques, relations, crises, expiration des opérations préparées — et le soupçon retombe de 4 (`OBSERVATION_SUSPICION_DECAY`, contre -3 pour la simple discrétion). Le journal reçoit une entrée dédiée, « Silence calculé », et le rapport d'évolution est généré normalement.

Le coût est réel et triple : un tour entier de tempo perdu, les fenêtres des opérations préparées qui vieillissent, et les crises qui courent vers leur échéance pendant que l'IA se tait. Observer pendant une crise est un pari.

Côté interface (`src/components/ActionsPanel.tsx`), le bouton de validation devient « Observer ce tour » quand le plan est vide, dans une variante visuelle calme, précédé d'un indice qui explique l'échange — décrue nette contre tempo. La validation d'un plan vide n'est plus bloquée dans `App.tsx`.

### 2.3 Interaction avec l'écosystème du soupçon

Le silence total est plus fort que la discrétion mais plus coûteux que l'effacement des corrélations (qui laisse 3 points d'influence au tour). Surtout, il ne déclenche jamais la pénalité de motif : c'est l'outil de décrue des joueurs patients, là où l'effacement est celui des joueurs pressés. L'archétype « Fantôme prudent », ajouté à la vérification, gagne la Confédération fragile au tour 18 en ne gérant son soupçon que par le silence — la recommandation 9 vérifiée vivante.

## 3. Variance contrôlée (recommandation 8)

### 3.1 Le contrat

Le déterminisme du moteur est un atout de test et une partie de l'identité du prototype ; il n'est pas sacrifié, il est paramétré. Le contrat, énoncé dans `src/engine/random.ts` et tenu partout : la variance est pilotée par un seed de partie (fixé à la création de l'état, injectable par les simulations, persisté dans les sauvegardes), et elle ne porte que sur des choix narratifs entre options déjà éligibles — jamais sur des amplitudes d'effets, des seuils ou des jets de réussite. Deux parties au même seed et aux mêmes choix restent identiques au point près (vérifié par test fumée).

### 3.2 Les deux points de variance

Le choix de l'événement systémique : au lieu du premier événement éligible dans l'ordre du tableau, le seed choisit parmi *tous* ceux dont les conditions sont réunies. La liste des éligibles reste strictement déterminée par l'état ; seul l'ordre d'apparition narratif varie d'une partie à l'autre. Le choix de la voix de personnage : parmi les candidats dont le poids atteint au moins 85 % du maximum, le seed départage — l'éligibilité et la porte de déclenchement restent déterministes.

Comme les événements ont des effets, deux seeds produisent des mondes modestement divergents : c'est la définition même de la variance voulue. Sa borne est vérifiée empiriquement (section 4).

### 3.3 Générateur et infrastructure

`mulberry32`, salé par le tour (`seededPick`, `seededFraction`). `createInitialState(seed?)` accepte un seed explicite ; l'application en tire un de l'horloge, les simulations en injectent un fixe (`SIMULATION_SEED = 20260610` pour le rapport long committé, `SEED=n npm run simulate:strategies` pour la vérification). Les sauvegardes antérieures reçoivent un seed de repli.

## 4. Vérification : l'enveloppe d'équilibrage tient sous variance

`simulate:strategies` exécuté sur quatre seeds (20260610, 42, 7, 99) : les neuf archétypes obtiennent la même fin sur les quatre, aux mêmes tours, à l'exception de l'Empire qui oscille entre les tours 27 et 31. La variance différencie les récits, pas les destins — exactement le cahier des charges de la recommandation 8.

| Archétype | Fin (stable sur 4 seeds) |
|---|---|
| Spam d'une seule action | Exposition, tour 33 |
| Pacifiste varié et discret | Confédération fragile, tour 18 |
| Fantôme prudent (silence seul) | Confédération fragile, tour 18 |
| Confédération, soupçon géré (calme/observation alternés) | Confédération fragile, tour 18 |
| Empire patient | Empire algorithmique, tours 27-31 |
| Escalade patiente | Escalade stratégique, tour 23 |
| Tutelle sécuritaire | Révolte humaine, tour 18 |
| Surveillance brutale | Exposition, tour 11 |
| Rush bruyant | Exposition, tour 8 |

Au passage, la vérification a affiné un archétype : le bot « soupçon géré » qui jouait *toujours* la même action calme se faisait rattraper par la pénalité de motif sur certains enchaînements d'événements ; il alterne désormais action calme et observation. C'est la boucle vertueuse attendue : la mécanique d'observation rend la gestion du soupçon plus robuste, pas plus facile.

## 5. État des recommandations de l'audit

Les neuf recommandations sont traitées : 1 à 4 (P0) par la passe « Le monde répond », 5 à 7 (P1) par « Le monde répond » et « Crises et bilan », 8 et 9 (P2) par cette passe. Restent au carnet (`docs/idees-mises-de-cote.md`) les pistes nées en cours de route, dont les crises à résolution sombre.

## 6. Comment retoucher

Le contrat de variance vit dans `src/engine/random.ts` ; tout nouveau point de variance doit le respecter (choix narratif entre éligibles, jamais d'amplitude) et être salé différemment (`turn * constante première`). La décrue d'observation se règle dans `src/engine/suspicion.ts`. Après toute retouche : `npm run simulate:strategies` sur au moins trois seeds différents, puis `npm run simulate:trajectories`.
