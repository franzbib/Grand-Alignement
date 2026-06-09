# Audit de jouabilité et d'intérêt — v0.2

> Note : cet audit externe a motivé la passe « Le monde répond » (voir `docs/design/passe-monde-qui-repond-v0-1.md`), qui applique ses recommandations P0 et une partie des P1. Les constats ci-dessous décrivent l'état du jeu *avant* cette passe.

Audit externe, juin 2026. Méthode : lecture complète du moteur (`gameEngine.ts`, `trajectories.ts`, `capabilities.ts`, `relations.ts`), des données (`actions.ts`, `endings.ts`, `events.ts`), des documents de référence du dépôt, exécution du script `simulate:trajectories`, puis **simulations sondes** écrites pour cet audit (stratégies monotones, rushes ciblés par fin, rotation équilibrée, jeu minimal) en appelant directement `applyTurnPlan` sur 60 tours.

---

## 1. Verdict synthétique

Le Grand Alignement est, à ce stade, **un excellent texte posé sur un jeu qui ne résiste pas encore**. L'écriture (fins, signaux faibles, charte littéraire), le concept (une IA clandestine dont la partie se termine par un diagnostic politique plutôt qu'une victoire) et le système des huit trajectoires constituent un intérêt réel et distinctif — il n'existe presque aucun jeu sur ce créneau. Mais la boucle stratégique ne produit ni tension, ni dilemme, ni risque d'échec : le monde ne pousse jamais en retour, le soupçon n'a aucune dent, et une seule action répétée suffit à atteindre la fin la plus positive au tour minimum.

L'intérêt actuel du jeu repose donc à environ 90 % sur la curiosité du joueur pour le texte et le diagnostic, et à 10 % sur la décision. La bonne nouvelle : l'architecture est saine, typée, simulable, et les correctifs identifiés sont peu coûteux. Le problème n'est pas la fondation, c'est l'absence d'adversité.

---

## 2. Constats empiriques

### 2.1 Toutes les fins sont atteignables au tour 15, par jeu monotone

Le seuil `MIN_STANDARD_ENDING_TURN = 15` est en réalité la durée effective du jeu dès qu'un joueur pousse dans une direction. Résultats des sondes (moteur réel, 60 tours max) :

| Stratégie sonde | Fin obtenue | Tour |
|---|---|---|
| « Narratif d'unité humaine » seul, une fois par tour (coût 1/5) | Confédération fragile | 15 |
| Unité + diplomatie secrète | Confédération fragile | 15 |
| Rotation équilibrée (climat, redistribution, unité, diplomatie) | Confédération fragile | 15 |
| Rush puissance IA (auto-amélioration, éducation, divertissement, surveillance) | Empire algorithmique | 15 |
| Rush escalade (défense commune, dérégulation, désinformation) | Escalade stratégique | 19 |
| Auto-amélioration + surveillance ciblée + dérégulation | Révolte humaine | 15 |

La fin « réussite » est donc obtenue par le joueur **le plus passif possible** : une action de coût 1 sur une capacité de 5, répétée 14 fois. Il n'existe aucune configuration où le joueur qui vise une fin échoue à l'atteindre. Les fins sont des vérifications de direction, pas des accomplissements.

### 2.2 À l'inverse, le jeu diversifié ne se termine jamais

Vos propres simulations (`trajectory-simulation-report.md`, régénérées pour cet audit) le montrent : les huit profils, qui répartissent l'influence sur plusieurs actions et cibles, n'atteignent **aucune fin à l'horizon 30 tours** et ne concluent qu'à l'horizon 50. Le rythme est donc bimodal : jouer focalisé termine la partie au tour 15, jouer varié la fait dériver indéfiniment au-delà de la cible de 20–30 tours affichée dans la vision v0.2. Aucun des deux régimes n'est le bon.

### 2.3 Le soupçon IA n'a aucune conséquence mécanique

C'est le constat le plus important pour la fantasy du jeu. Une recherche exhaustive des usages de `soupconIA` dans le moteur montre qu'il alimente : deux événements systémiques à déclenchement unique, une condition de relation, le score de la trajectoire t3, et des notes narratives. C'est tout. À soupçon 100 : aucune action n'est verrouillée, aucun coût n'augmente, aucun bloc ne réagit, aucune fin d'exposition n'existe — et la fin « Confédération fragile » reste accessible (vérifié en sonde : fin positive obtenue avec soupçon 100). Le code lui-même l'avoue : « Une branche d'exposition pourra exister plus tard. » Or le pitch du jeu est *une IA cachée que le monde pourrait découvrir*. Tant que la découverte est impossible, la clandestinité est un décor, pas un enjeu.

### 2.4 Le monde ne résiste pas

La seule pression exogène est la dérive systémique : +1 à +2 de stress climatique par tour, +2 d'escalade si la cohésion est basse, +1 de tension si la richesse est basse. Aucun aléa, aucun adversaire, aucun événement à échéance exigeant une réponse. Les événements systémiques sont à déclenchement unique (`triggeredEventIds`), évalués dans l'ordre du tableau, et leurs effets sont faibles : le contenu s'épuise et ne revient jamais. Le joueur n'est jamais en train de *réagir* — il administre un monde docile.

### 2.5 Le ciblage de bloc est un piège mécanique

Dans `applyTurnPlan`, une action visant `global` ou `all-blocks` applique ses `blockEffects` **à 100 % sur les six blocs** ; la même action ciblée sur un bloc applique ces effets sur un seul bloc, plus 65 % des effets globaux. Cibler est donc presque toujours strictement inférieur (un sixième des effets de bloc, contre un rabais de 35 % sur les effets globaux). Conséquence : la carte cliquable, le sélecteur de cible et la moitié de l'interface stratégique récompensent le joueur qui les ignore. Seules les actions à `targetRequired: true` échappent à ce constat — par contrainte, pas par intérêt.

### 2.6 Saturation des jauges

Les jauges sont bornées par `clamp(0, 100)` sans amortissement. En jeu focalisé, puissance IA et soupçon saturent à 100 vers les tours 12–15 ; vos simulations à 50 tours signalent la saturation sur les huit profils. Une fois une jauge collée à sa borne, les deltas affichés dans le rapport deviennent faux ou vides, et la lecture du monde se fige — précisément au moment où le jeu voudrait que les trajectoires deviennent intéressantes.

### 2.7 Le journal oublie l'histoire que le jeu prétend sédimenter

`MAX_JOURNAL_ENTRIES = 10`, soit environ trois à cinq tours d'historique, pour un jeu dont la vision affirme : « le joueur doit sentir que ses choix sédimentent progressivement en histoire ». Au tour 20, les douze premiers tours ont disparu. La phrase de réussite visée — « c'est ce monde-là que j'ai construit » — suppose de pouvoir relire la construction.

### 2.8 Déterminisme intégral

Hors le profil de simulation « aléatoire seedé », le moteur ne contient aucun aléa. Deux parties aux mêmes choix sont identiques au point près. Ce n'est pas un défaut en soi (c'est même élégant pour le test), mais combiné à l'absence d'adversité, cela signifie que la rejouabilité repose entièrement sur la curiosité du joueur pour les fins non vues — et il les aura toutes vues en quatre parties de 15 tours.

### 2.9 L'économie d'influence ne contraint presque rien

Capacité 5, coûts de 1 à 3 : un tour typique contient deux à quatre actions, sans ressource accumulable, sans dette, sans coût d'opportunité au-delà du tour courant. Le système d'opérations préparées (préparation → fenêtre d'expiration) est la seule mécanique temporelle intéressante, mais rien ne pousse à l'utiliser puisque les actions immédiates suffisent à tout.

---

## 3. Ce qui fait l'intérêt du jeu (et qu'il faut protéger)

L'écriture est très au-dessus du standard du genre. Les quatre textes de fin sont remarquables — « Le monde est en paix. Il ne sait plus très bien par qui » est exactement le ton que le projet revendique, et la charte littéraire est réellement appliquée dans les rapports, les signaux faibles et les voix de personnages.

Le système des huit trajectoires est la vraie proposition de valeur. Lire le monde produit (« Tutelle algorithmique 76, en collision avec Capture privée ») plutôt qu'un score est une idée de design forte, rare, et déjà fonctionnelle. Le diagnostic final est l'USP du jeu ; tout l'équilibrage devrait servir à rendre ce diagnostic *mérité*.

La progression en cinq paliers de capacités IA, avec coloration narrative selon la trajectoire dominante, donne une sensation d'apprentissage de la machine qui colle au fantasme. Les sensibilités différenciées par bloc produisent des réactions réellement distinctes (vérifié dans les sondes : l'Asie industrielle et le bloc Russie/Eurasie divergent nettement des autres).

Enfin, l'infrastructure est un atout invisible mais décisif : moteur pur et déterministe, simulation automatisée versionnée dans le dépôt, typage strict. Peu de prototypes de cette taille peuvent vérifier une hypothèse d'équilibrage en une commande. Toutes les recommandations ci-dessous sont testables par ce canal avant tout playtest humain.

---

## 4. Recommandations, par ordre de priorité

### P0 — Rendre le jeu adversarial (sans rien ajouter d'énorme)

**Recommandation 1 — Donner des dents au soupçon.** C'est le correctif au meilleur ratio effet/coût du projet. Trois paliers à conséquences mécaniques : à 60, les blocs entrent en vigilance (coût des actions à fort `suspicionEffect` majoré de 1, ou confiance IA en érosion automatique de 2 par tour) ; à 80, contre-mesures actives (un événement systémique *répétable* d'audit qui annule partiellement la dernière opération, baisse de coopération sur les relations technologiques) ; à 100, fin « Exposition » — la cinquième fin manquante, celle où le monde découvre l'IA. Elle devrait pouvoir tomber *avant* le tour 15 : c'est la défaite qui donne son sens à toutes les autres parties.

**Recommandation 2 — Faire pousser le monde en retour.** Rendre les événements systémiques répétables avec temps de recharge plutôt qu'à usage unique, renforcer leurs effets, et introduire une à deux crises à échéance par partie (« la relation sécurité Asie/Amérique dépasse 75 : sans désescalade sous trois tours, escalade +15 »). Le joueur doit parfois jouer un tour qu'il n'a pas choisi.

**Recommandation 3 — Réparer l'asymétrie de ciblage.** Soit le ciblage d'un bloc amplifie les `blockEffects` (×1,5 à ×2) pendant que la portée globale les dilue (×0,4–0,5 par bloc), soit le choix de cible disparaît. En l'état, l'interface enseigne au joueur une option dominée.

**Recommandation 4 — Resserrer les fins sur la fenêtre 20–30 tours et les rendre exigeantes.** « Confédération fragile » devrait exiger un stress climatique et un soupçon contenus (mes sondes l'obtiennent avec climat 78 et soupçon 100, ce qui contredit le texte de la fin). Les fins de réussite doivent demander une tension entre plusieurs jauges qu'une stratégie monotone ne peut pas satisfaire — c'est exactement ce que la trajectoire t1 mesure déjà : s'en inspirer pour les conditions.

### P1 — Casser la monotonie et réparer la lisibilité

**Recommandation 5 — Rendements décroissants sur la répétition.** Une même action rejouée dans une fenêtre glissante de trois tours perd 25 à 40 % d'efficacité (et/ou gagne en soupçon : un motif répété est un motif détectable, ce qui est narrativement parfait). Cela tue la stratégie dominante constatée en 2.1 sans toucher aux données.

**Recommandation 6 — Journal à la hauteur de la vision.** Porter la limite à 40 entrées ou archiver par chapitres, et ajouter un écran de fin qui rejoue les moments clés (paliers franchis, événements systémiques, bascules de trajectoire dominante) avec les huit scores finaux. C'est l'écran qui transforme le diagnostic en récompense.

**Recommandation 7 — Amortir les bornes.** Réduire les effets de moitié au-delà de 85 (et en deçà de 15) plutôt que de clamper sec : les jauges restent vivantes en fin de partie et les rapports restent vrais.

### P2 — Confort et rejouabilité

**Recommandation 8 — Variance contrôlée.** Un seed par partie pilotant l'ordre et le tirage d'événements mineurs suffirait à différencier deux parties aux mêmes choix, sans sacrifier la testabilité (le seed reste injectable dans les simulations).

**Recommandation 9 — Tour d'observation.** Autoriser un tour sans action (actuellement impossible : `applyTurnPlan` exige une intervention) avec un petit bénéfice thématique — le soupçon retombe légèrement quand l'IA se tait. Cela crée un vrai choix de rythme et renforce la fantasy.

---

## 5. Conclusion

À la question « le jeu est-il intéressant ? » : le *projet* l'est nettement — concept singulier, écriture aboutie, diagnostic final comme récompense, outillage de simulation rare à ce stade. À la question « le jeu est-il jouable ? » : il est *manipulable* mais pas encore *joué contre*. Tout converge vers un même geste de design : introduire de la résistance (soupçon à conséquences, monde qui répond, fins exigeantes), et le reste de l'édifice — trajectoires, paliers, voix, rapports — se mettra immédiatement à produire la tension qu'il est déjà écrit pour raconter. Les recommandations P0 sont toutes vérifiables par `simulate:trajectories` avant le moindre playtest humain : c'est par là que je commencerais.
