# Audit UX, Carte et Lisibilité - v0.1
**Par Antigravity (Agent UX / Carte / Lisibilité)**

## Verdict général

Le prototype du *Grand Alignement* possède une identité visuelle et narrative forte. L'esthétique de "tableau de bord institutionnel" (tons sable/vert sombre/brique, typographie propre, absence de décorations superflues) colle parfaitement à la prémisse d'une IA clandestine observant et influençant le monde. La boucle de jeu de base (choisir des interventions, valider le tour, lire le rapport) fonctionne.

Cependant, **l'expérience utilisateur souffre actuellement d'une fragmentation de l'information et d'une surcharge cognitive**. Pour planifier ses actions d'influence, le joueur doit naviguer en permanence entre 3 ou 4 onglets différents. L'onglet "Rapport", affiché après chaque tour, noie l'essentiel dans une grille de 13 cases contenant une majorité d'informations vides ou secondaires. Enfin, la mécanique de préparation d'opérations multitours, pourtant centrale, manque de clarté dans son interface de ciblage et de suivi.

Cet audit propose des corrections simples, non perturbatrices pour le gameplay actuel, afin de rendre le jeu fluide et agréable dès cette version v0.1.

---

## Ce qui fonctionne

- **L'ambiance et la charte graphique** : Le style minimaliste et froid ("observatoire mondial") est très immersif. Les choix de couleurs (`#17211c`, `#f5f3ed`, etc.) et de contrastes respectent les contraintes artistiques et thématiques du projet.
- **La carte d'observation synthétique** : Elle évite le piège du wargame ou du jeu de stratégie territoriale. Les 6 blocs sont immédiatement identifiables, et leurs états simplifiés (Stable, Tension, Crise, etc.) sont bien traduits par la coloration et la légende.
- **La barre de statut globale** (`status-strip`) : Elle permet de garder sous les yeux les indicateurs de fin de partie (Soupçon, Escalade, Autonomie) et le tour actuel à tout moment.
- **La structure par onglets** : Elle est techniquement propre, réactive et s'adapte correctement aux écrans de taille moyenne grâce aux règles CSS responsives.
- **Le Journal des conséquences** : Il est concis, bien structuré et offre une lecture historique claire et aérée de la partie.

---

## Ce qui nuit à la compréhension

1. **Le ciblage "aveugle" des interventions** :
   Dans l'onglet **Influence**, les sélecteurs de cible (`select`) n'apparaissent qu'une fois la carte d'action cliquée (sélectionnée). Le joueur ne peut donc pas savoir quels blocs sont éligibles pour une action sans d'abord "dépenser" virtuellement ses points d'influence pour la cocher, puis ouvrir le sélecteur. C'est un obstacle majeur à la planification rapide.
2. **La fragmentation cognitive des onglets** :
   Pour planifier son tour, le joueur doit :
   - Regarder les jauges globales et la carte dans **Monde**.
   - Aller sur **Influence** pour voir ses points restants et ses options.
   - Aller sur **Blocs** pour analyser en détail quel bloc cibler (sensibilités, groupes sociaux, vulnérabilités).
   - Retourner sur **Influence** pour configurer et valider l'action.
   Cette déconnexion de l'analyse (onglet *Blocs*) et de l'action (onglet *Influence*) fatigue le joueur.
3. **La surcharge et le bruit visuel de l'onglet Rapport** :
   Le Rapport d'évolution post-tour affiche systématiquement 13 blocs d'information en grille. Lorsque le joueur n'a lancé qu'une action simple, au moins 8 de ces blocs affichent des messages génériques de vacuité (ex: *"Aucun changement global dominant"*, *"Aucune hausse relationnelle dominante"*, etc.). Cela rend la lecture du tour fastidieuse et masque les événements ou augmentations de soupçon pourtant critiques.
4. **L'opacité du système de préparation (multitours)** :
   Rien n'indique clairement le lien de dépendance entre une action de "Préparation" (ex. *Préparer un plan de communication*) et les "Opérations prêtes" qu'elle débloquera (ex. *Lancer une campagne d'information*). Le joueur doit deviner ou expérimenter à l'aveugle. De plus, la section "Opérations prêtes" réapparaît sous forme de cartes d'actions classiques sans contexte suffisant pour comprendre qu'elles découlent d'un effort passé.
5. **Le statut flou de la sélection de carte** :
   Cliquer sur un bloc de la carte (onglet **Monde**) modifie la variable `selectedBlockId` du jeu. Mais rien n'indique au joueur que cette sélection servira de cible par défaut lorsqu'il se rendra dans l'onglet **Influence**. De plus, le rapport rapide de bloc sous la carte fait doublon avec les données de l'onglet **Blocs**.

---

## Priorités UX immédiates

1. **Rendre le ciblage transparent** : Afficher en permanence le sélecteur de cible sur les cartes d'actions disponibles, même si l'action n'est pas encore activée. Cela permet de lire et planifier le ciblage en un clin d'œil.
2. **Épurer l'onglet Rapport** : Masquer ou regrouper de manière conditionnelle les sections du rapport post-tour qui n'ont rien à signaler ce tour-ci, afin de resserrer l'attention sur les faits marquants (l'action menée, les dérives autonomes majeures et le Soupçon).
3. **Clarifier la préparation multitours** : Ajouter une mention explicite reliant l'action préparatoire aux actions qu'elle débloquera directement sur la carte de préparation (ex. : *"Prépare : Lancer une campagne d'information ou Désinformation contrôlée"*).
4. **Unifier l'observation cartographique et la cible** : Expliciter visuellement sur l'écran Monde que le bloc sélectionné est votre "Cible d'observation active" et qu'il guidera vos prochaines opérations d'influence.

---

## Corrections simples recommandées (sans modification des mécaniques)

- **Ciblage permanent dans `ActionsPanel.tsx`** :
  Modifier la condition de rendu du `<select>` de cible pour qu'il soit affiché dès que `targetOptions.length > 1` (sans exiger `isSelected`). Si l'action n'est pas sélectionnée, le menu déroulant reste modifiable et sert à pré-configurer la cible.
- **Rapport d'évolution dynamique dans `EvolutionReportPanel.tsx`** :
  Utiliser des filtres conditionnels simples pour ne pas afficher les cases "vides" ou afficher un message global épuré. Par exemple, si `immediateInterventions` est vide, ne pas afficher le bloc ou fusionner les préparations et déblocages dans une seule boîte "Opérations clandestines".
- **Liens explicites dans les descriptions d'actions (`actions.ts`)** :
  Ajuster légèrement les descriptions des cartes de préparation pour y inclure textuellement les noms des actions cibles débloquées.
- **Ajout de feedback d'influence dans `ActionsPanel.tsx`** :
  Si le joueur tente d'activer une action qui dépasse son influence restante, afficher temporairement un contour rouge ou un indicateur de capacité insuffisante plutôt que de ne rien faire (actuellement désactivé de manière silencieuse si coût > reste).

---

## Corrections à différer (hors v0.1)

- **Carte géopolitique interactive améliorée** : L'intégration d'un tracé vectoriel exact ou d'une carte stylisée plus fine (ex. frontières précises) doit attendre que la boucle ludique globale soit jugée pleinement satisfaisante.
- **Diplomatie inter-blocs interactive** : L'onglet "Relations" reste consultatif. Toute idée visant à permettre des négociations ou des traités directs doit être stockée dans `docs/idees-mises-de-cote.md`.
- **Intégration d'un panneau latéral d'influence sur l'écran Monde** : fusionner l'écran Monde et Influence sur un seul et unique écran (pour éviter les changements d'onglets) serait idéal, mais demande une restructuration CSS et de layout plus importante qui sort du cadre d'un audit de lisibilité simple.

---

## Ce qu'il ne faut surtout pas ajouter maintenant

- **IA générative pour narrer les rapports de tour** (trop lourd, ralentit le rythme de jeu, pose des problèmes d'intégration v0.1).
- **Arbre de technologies ou sous-systèmes de factions complexes** (risquerait de noyer le joueur sous encore plus de menus).
- **Animations de déplacement sur la carte** (qui transformeraient le jeu en wargame tactique alors qu'il s'agit d'influence clandestine).
- **Base de données persistante (Supabase)** ou comptes utilisateurs.

---

## Proposition d'ordre de travail

Pour améliorer la lisibilité et l'ergonomie générale rapidement sans casser le moteur de simulation :

1. **Étape 1 : Simplification du Rapport post-tour** (`EvolutionReportPanel.tsx`)
   *Filtres d'affichage pour nettoyer la grille des 13 cases et ne garder que le texte utile à chaque tour.*
2. **Étape 2 : Amélioration du Ciblage dans le menu d'Influence** (`ActionsPanel.tsx`)
   *Rendre les listes déroulantes de cibles visibles en permanence sur les cartes d'actions pour permettre la planification.*
3. **Étape 3 : Clarification textuelle des Préparations** (`src/data/actions.ts`)
   *Enrichissement des promesses/descriptions pour documenter précisément ce qui est débloqué par chaque préparation.*
4. **Étape 4 : Connexion visuelle Carte ↔ Influence** (`WorldMap.tsx` / `App.tsx`)
   *Ajouter un libellé clair sur le panneau de la carte indiquant que le bloc sélectionné est la cible actuelle de vos opérations clandestines.*
