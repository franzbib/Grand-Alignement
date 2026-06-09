# Passe « Le monde répond » — v0.1

## 1. Statut du document

Document de design de la passe gameplay appliquée après l'audit externe de jouabilité (`docs/audits/audit-jouabilite-interet-v0-2.md`). Toutes les modifications décrites ici sont implémentées, compilées et vérifiées par simulation (`npm run simulate:strategies` et `npm run simulate:trajectories`).

## 2. Problème traité

L'audit a établi empiriquement que le jeu ne résistait pas au joueur. Une seule action de coût 1 répétée quatorze fois atteignait la fin la plus positive au tour minimal, avec un soupçon IA à 100 sans la moindre conséquence. À l'inverse, le jeu diversifié ne se terminait jamais avant cinquante tours. Le ciblage d'un bloc était strictement inférieur à l'action globale, les jauges saturaient à leurs bornes dès le milieu de partie, et le journal oubliait l'histoire que le jeu prétend sédimenter.

Le principe directeur de la passe : introduire de la résistance sans rien changer à l'identité du projet. Le joueur reste une IA clandestine, le monde reste lisible par jauges et trajectoires, la fin reste un diagnostic. Ce qui change : le diagnostic doit désormais être mérité.

## 3. Ce qui a été ajouté ou modifié

### 3.1 Le soupçon a des conséquences (`src/engine/suspicion.ts`, nouveau module)

Le soupçon était purement narratif. Il a maintenant cinq paliers. Sous 30, bruit de fond. De 30 à 59, perceptible — purement narratif, comme avant. De 60 à 79, vigilance : la confiance IA de tous les blocs s'érode de 2 par tour, quoi que fasse le joueur. De 80 à 95, enquête : érosion portée à 3, opérations à forte signature (`suspicionEffect >= 4`) suspendues, pression relationnelle accrue sur les domaines technologie et information (« Audits croisés sur l'origine des décisions »). À 96, fin Exposition.

Deux mécaniques de gestion accompagnent ces paliers. La discrétion est récompensée : un tour dont la signature cumulée est de 2 ou moins fait retomber le soupçon de 3. Et la répétition devient détectable : une action rejouée dans la fenêtre des deux derniers tours perd en efficacité (×0,65 par répétition, plancher 0,35) et ajoute du soupçon (+2 par répétition). Un motif répété est un motif détectable — c'est la traduction mécanique directe de la prémisse clandestine, et c'est ce qui tue la stratégie monotone identifiée par l'audit.

### 3.2 Fin « Exposition » (`src/data/endings.ts`)

Cinquième fin, type échec, déclenchée à soupçon ≥ 96, y compris avant le tour minimal standard (champ `ignoresMinimumTurn`). C'est la défaite qui donne son sens à la clandestinité : toutes les autres parties deviennent des prises de risque. Le texte suit la charte littéraire des quatre fins existantes.

Dérogation au garde-fou « pas de scénario d'exposition complète » : il ne s'agit pas d'un scénario ni d'une branche, mais d'un texte de fin et d'une condition — directement au service de la boucle, testé par simulation, retirable en supprimant une entrée. La dérogation est documentée dans `docs/REPRISE.md` comme l'exige `docs/reference/garde-fous-v0-1.md`.

### 3.3 Action « Effacement des corrélations » (`src/data/actions.ts`)

Le soupçon ayant des dents, le joueur devait disposer d'un levier actif pour le gérer. Une action de catégorie Discrétion (palier IA 2, coût 2) fait retomber le soupçon de 8 au prix d'un recul de puissance IA et d'un tour de tempo. Le système anti-répétition la dégrade naturellement si on en abuse : elle ne peut pas devenir une pompe à innocence. Sans elle, les simulations montraient que les fins Empire et Escalade étaient devenues pratiquement inatteignables.

### 3.4 Le monde répond plusieurs fois (`src/data/events.ts`, `src/engine/gameEngine.ts`)

Dix événements systémiques de nature récurrente (incidents de sécurité, sommets, audits, rumeurs, grèves, contrecoups) sont marqués `repeatable` et peuvent se redéclencher après huit tours de recharge (`eventCooldowns` dans l'état). Les jalons narratifs uniques (créations d'institutions, accords fondateurs) restent à déclenchement unique. Le contenu ne s'épuise plus en une partie.

### 3.5 Ciblage rééquilibré (`src/engine/gameEngine.ts`)

Avant : une action de portée globale appliquait ses effets de bloc à 100 % sur les six blocs ; cibler un bloc donnait les mêmes effets sur un seul bloc. Le ciblage — et la carte cliquable — étaient un piège mécanique. Désormais, cibler concentre (effets de bloc ×1,5 sur la cible) et la portée globale dilue (×0,6 par bloc). Le choix de cible est devenu un vrai arbitrage entre profondeur et largeur.

### 3.6 Bornes amorties (`src/engine/gameEngine.ts`)

Les effets qui s'enfoncent au-delà de 85 ou en deçà de 15 sont divisés par deux. Les jauges ne se collent plus aux bornes dès le milieu de partie, les deltas des rapports restent lisibles et vrais en fin de partie. Conséquence assumée : le palier d'escalade de la fin « Escalade stratégique » est passé de 90 à 85 pour rester atteignable.

### 3.7 Fins resserrées sur la fenêtre 20-30 tours (`src/data/endings.ts`)

Tour minimal standard porté de 15 à 18. « Confédération fragile » exige désormais un stress climatique ≤ 55 et un soupçon ≤ 50 : on ne « réussit » plus la coopération mondiale avec une planète à 78 de stress et un monde en train de découvrir l'IA — l'audit avait montré que c'était possible, en contradiction avec le texte même de la fin. « Empire algorithmique » exige un soupçon ≤ 79, par cohérence avec son texte (un empire que personne ne remarque).

### 3.8 Journal et interface

Journal porté de 10 à 40 entrées : un jeu de 20-30 tours dont la vision est la sédimentation des choix en histoire ne peut pas oublier 80 % de la partie. Le bandeau d'état affiche le palier de soupçon en toutes lettres (bruit de fond, perceptible, vigilance, enquête). Le panneau d'influence explique les opérations suspendues en zone d'enquête et leur condition de retour. Les notes de soupçon du rapport d'évolution décrivent désormais des conséquences réelles, plus des promesses (« une branche d'exposition pourra exister plus tard » a disparu). Un signal de monde explicite la détection de motif quand le joueur se répète.

### 3.9 Simulation (`src/engine/simulateGame.ts`, `scripts/verify-strategies.ts`)

Les huit profils de `simulate:trajectories` adoptent l'hygiène de soupçon minimale qu'un joueur réel adopterait (ralentir et effacer ses traces quand le soupçon monte), sans quoi toutes les simulations convergeaient vers l'Exposition et ne mesuraient plus la diversité des trajectoires. Un nouveau script `npm run simulate:strategies` vérifie sept joueurs archétypaux directionnels : il constitue désormais le test de non-régression de l'équilibrage.

## 4. Résultats vérifiés

Avant la passe, les quatre fins étaient toutes atteignables au tour 15 par jeu monotone, et le spam d'une action gagnait. Après la passe, mesures du script de vérification :

| Stratégie archétypale | Résultat |
|---|---|
| Spam d'une seule action (ancienne dominante) | Exposition au tour 34 — ne gagne plus rien |
| Pacifiste varié et discret | Confédération fragile au tour 18 |
| Confédération visée avec gestion du soupçon | Confédération fragile au tour 18 |
| Empire patient (traces effacées) | Empire algorithmique au tour 40 |
| Escalade patiente (signature gérée) | Escalade stratégique au tour 30 |
| Surveillance brutale, traces ignorées | Exposition au tour 11 |
| Rush bruyant toutes signatures dehors | Exposition au tour 8 |

Les fenêtres sont étagées selon l'ambition : la coopération discrète conclut tôt, l'empire est le succès le plus long et le plus exigeant, l'imprudence échoue vite. Les profils diversifiés de `simulate:trajectories` produisent désormais cinq trajectoires dominantes distinctes à cinquante tours (contre deux avant la passe) et n'atteignent généralement pas de fin — conforme au principe selon lequel les fins récompensent une direction tenue, pas une dérive.

## 5. Ce qui n'a volontairement pas été fait

Pas de crises à échéance (menace exigeant une réponse sous N tours) : c'est la prochaine brique d'adversité naturelle, archivée plutôt qu'implémentée pour garder la passe testable. Pas d'aléa : le déterminisme reste un atout de test et l'identité du prototype. Pas d'écran de bilan de fin de partie rejouant les moments clés : recommandé par l'audit, c'est une surface UX qui mérite sa propre passe. Pas de tour d'observation explicite : la discrétion récompensée en donne déjà la texture sans nouvelle interface. Ces pistes sont reportées dans `docs/idees-mises-de-cote.md`.

## 6. Comment retoucher l'équilibrage

Toutes les constantes de la passe sont regroupées en tête de `src/engine/suspicion.ts` (paliers, fenêtre de motif, décrue) et de `src/engine/gameEngine.ts` (multiplicateurs de ciblage, zone d'amortissement, recharge des événements). Après toute retouche : `npm run simulate:strategies` doit conserver le tableau de la section 4 dans ses grandes lignes, puis `npm run simulate:trajectories` pour le stress test long.
