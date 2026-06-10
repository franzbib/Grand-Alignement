# Passe « Crises et bilan » — v0.1

## 1. Statut du document

Document de design de la deuxième passe issue de l'audit de jouabilité (`docs/audits/audit-jouabilite-interet-v0-2.md`). Elle implémente les deux briques explicitement reportées par la passe « Le monde répond » (`docs/design/passe-monde-qui-repond-v0-1.md`) : les crises à échéance et l'écran de bilan de fin de partie. Toutes les modifications sont implémentées, compilées et vérifiées par `npm run simulate:strategies` et `npm run simulate:trajectories`.

## 2. Crises à échéance

### 2.1 Intention

La passe précédente a donné au monde la capacité de réagir (paliers de soupçon, événements répétables). Il lui manquait la capacité d'*exiger* : aucun mécanisme n'imposait au joueur un tour qu'il n'avait pas choisi. Les crises à échéance comblent ce manque avec un seul gabarit réutilisable, conformément aux garde-fous : une jauge, une correction chiffrée, une échéance en tours, des effets d'échec.

### 2.2 Fonctionnement (`src/engine/crises.ts`, `src/data/crises.ts`)

Une crise se déclenche quand ses conditions sont réunies (même gabarit que les événements systémiques) et que sa recharge est écoulée. Une seule crise active à la fois, pour que l'ultimatum reste lisible. Au déclenchement, la cible est calculée par rapport à la valeur courante de la jauge (ex. : ramener le risque d'escalade de 8 points sous 4 tours). À chaque tour, la crise est résolue si la cible est atteinte, échouée si l'échéance est dépassée — les effets d'échec tombent immédiatement et comptent pour l'évaluation de fin du même tour. Le cycle de vie complet (déclenchement, progression, résolution, échec) s'écrit dans le journal et dans les signaux du rapport d'évolution.

Quatre crises couvrent les quatre axes de négligence, dans le registre littéraire du jeu : « Spirale d'interception » (escalade ≥ 55), « L'été des récoltes manquées » (climat ≥ 70), « Le comité des origines » (soupçon ≥ 68), « Grippage des chaînes » (tension sociale moyenne ≥ 62). Les textes décrivent des mécanismes du monde, jamais l'IA ; les échecs constatent sans moraliser.

### 2.3 Interface (`src/components/CrisisBanner.tsx`)

Un bandeau au-dessus de l'état synthétique affiche la crise active : titre, exigence chiffrée, valeur courante, compte à rebours. Il passe en rouge au dernier tour. L'ultimatum est impossible à manquer ; le récit, lui, vit dans le journal.

### 2.4 Propriétés émergentes constatées en simulation

Deux comportements non scriptés sont apparus pendant la vérification, et ont été conservés comme des qualités. D'abord, l'échec d'une crise peut *servir* certains objectifs : le joueur qui vise l'escalade a intérêt à laisser mourir la « Spirale d'interception » (+10 d'escalade) — l'archétype belliciste vérifié l'exploite, et c'est narrativement juste. Ensuite, la « fenêtre de clandestinité » : la taxe de tempo des crises allonge les parties ambitieuses, et l'horloge du soupçon (dérive, motifs, érosion) finit toujours par gagner au-delà de ~45 tours. Les grandes ambitions doivent se conclure avant que le monde ne comprenne. C'est désormais une propriété structurelle assumée du jeu.

### 2.5 Équilibrage associé

La condition d'autonomie de la fin « Empire algorithmique » passe de ≤ 20 à ≤ 25 : l'ancienne profondeur de grind avait été calibrée pour un monde qui ne se défendait pas, et devenait incompatible avec la fenêtre de clandestinité une fois la taxe des crises ajoutée. L'Empire reste la fin la plus exigeante (vérifiée au tour 27 par l'archétype dédié, contre 18 pour la Confédération).

## 3. Écran de bilan de fin (`src/components/EndingRecap.tsx`)

La fin du Grand Alignement est un diagnostic, pas un score ; cet écran le rend mérité. Sous le texte de fin, deux sections. « Le monde que vous avez construit » : les huit lectures politiques classées par score avec barres, la dominante mise en avant, les collisions nommées — c'est la première fois que les scores de trajectoires, jusqu'ici réservés aux signaux faibles et aux simulations, sont montrés au joueur. « Les moments qui ont compté » : les événements systémiques, crises et voix de personnages relus en ordre chronologique avec leur tour — la sédimentation des choix que la vision promet, rendue possible par le journal de 40 entrées de la passe précédente.

## 4. Simulation et vérification

Les profils de `simulate:trajectories` et les archétypes de `simulate:strategies` répondent aux crises comme un joueur réel alerté par le bandeau : une action corrective canonique par jauge (diplomatie pour l'escalade, conversion verte pour le climat, effacement pour le soupçon, unité pour la cohésion) — sauf l'archétype belliciste, qui ignore par choix de rôle les crises dont l'échec le sert. Un archétype « Tutelle sécuritaire » a été ajouté pour vérifier la Révolte humaine.

Résultats après la passe :

| Stratégie archétypale | Résultat |
|---|---|
| Spam d'une seule action | Exposition au tour 33 — ne gagne toujours rien |
| Pacifiste varié et discret | Confédération fragile au tour 18 |
| Confédération avec gestion du soupçon | Confédération fragile au tour 18 |
| Empire patient (cycle en 4 temps) | Empire algorithmique au tour 27 |
| Escalade patiente (laisse mourir les crises d'escalade) | Escalade stratégique au tour 23 |
| Tutelle sécuritaire (surveillance, traces gérées) | Révolte humaine au tour 18 |
| Surveillance brutale, traces ignorées | Exposition au tour 11 |
| Rush bruyant | Exposition au tour 8 |

Les huit profils diversifiés du stress test long survivent cinquante tours (les crises et l'hygiène de soupçon se compensent), n'atteignent pas de fin et produisent cinq trajectoires dominantes distinctes : la dérive reçoit un diagnostic, la direction reçoit une conclusion.

## 5. Ce qui reste volontairement de côté

La variance contrôlée par seed et le tour d'observation explicite restent archivés dans `docs/idees-mises-de-cote.md`. S'y ajoute une piste née de cette passe : des crises dont la *résolution* (et non l'échec) sert des objectifs sombres, pour offrir au joueur belliciste ou impérial des dilemmes symétriques de ceux du joueur coopératif.

## 6. Comment retoucher l'équilibrage

Les crises se règlent entièrement dans `src/data/crises.ts` (seuils de déclenchement, amplitude exigée, échéances, recharges, effets). Le cycle de vie est dans `src/engine/crises.ts` et ne devrait pas avoir à changer pour de l'équilibrage. Après toute retouche : `npm run simulate:strategies` doit conserver le tableau de la section 4 dans ses grandes lignes, puis `npm run simulate:trajectories` pour le stress test long.
