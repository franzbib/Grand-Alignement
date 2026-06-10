# Passe « Cause et effet » — v0.1

## 1. Statut du document

Passe de lisibilité stratégique, en réponse à une critique de playtest : le lien entre le choix et la conséquence n'était pas toujours visible, ni la réciproque (quel levier pour quel résultat). Doctrine adoptée, à graver dans la charte : **le flou légitime porte sur les conséquences de second ordre — ce que le monde fait du geste, les trajectoires, le long terme ; jamais sur l'effet de premier ordre — quelle jauge l'action pousse, et dans quel sens.** Le joueur sait toujours ce qu'il tente ; il découvre ce que le monde en fait. Corollaire : aucune information mécanique ne doit avoir le texte pour seul véhicule.

## 2. Les quatre chantiers

### 2.1 Pastilles d'effets sur chaque carte (`src/engine/actionEffects.ts`)

Chaque carte affiche la direction des jauges qu'elle pousse : « Climat ↓↓ · Cohésion ↑ · Autonomie ↑ », flèche doublée si l'amplitude est forte (≥ 4). Les effets de bloc apparaissent en pastilles secondaires (pointillés). Jamais d'amplitude exacte ni de modificateurs — c'est le territoire du brouillard — à une exception : le **soupçon**, ressource de survie du joueur, est affiché en valeur nette exacte et seul à recevoir une couleur sémantique (ambre s'il monte, vert s'il descend). Pas de coloration morale des autres jauges : pousser l'autonomie dans un sens est une politique, pas une faute.

### 2.2 Attribution « Vous / Le monde » dans le rapport

Le rapport séparait mal ce que le joueur a produit de ce que le monde a fait seul (dérive, érosion, événement, crise) — impossible d'apprendre. Le moteur calcule désormais les deux réalisés (`playerGlobalChanges` à partir des jauges après les seules actions du joueur, `worldGlobalChanges` pour le reste du tour) et le rapport affiche, toujours visible sous la synthèse, la leçon du tour en une ligne : « **Vous :** escalade -9 · climat -8 · cohésion +5 — **Le monde :** cohésion -2 · climat +1 ». Au tour d'observation : « **Vous :** silence ». Le tiroir « Jauges et blocs » détaille les deux listes complètes. Les anciennes sauvegardes restent compatibles (champs optionnels).

### 2.3 Filtre d'intention « Agir sur »

La réciproque demandée — du but vers les leviers. Une rangée de puces au-dessus des interventions : Cohésion, Escalade, Autonomie, Climat, Puissance IA, et « Soupçon ↓ » (seule intention univoque). Sélectionner une jauge ne garde que les actions qui la touchent ; les pastilles de chaque carte disent dans quel sens. Combinable avec les filtres existants.

### 2.4 Deltas du dernier tour dans le bandeau

« Risque d'escalade 42 ▲3 » : trois caractères qui répondent en permanence à « ça marche, ce que je fais ? ». Alimentés par le nouveau champ `previousGlobalStats` (migré à `null` pour les anciennes sauvegardes).

## 3. Ce qui reste volontairement flou

Les amplitudes exactes des effets, les sensibilités de bloc, les multiplicateurs de motif et de ciblage, les seuils des fins et des crises non déclenchées, les conditions des trajectoires. C'est le brouillard qui fait le jeu : le monde interprète, amplifie, résiste — et le joueur l'apprend en jouant, désormais sur des fondations de premier ordre lisibles.

## 4. Vérification

`actionEffects` est un module pur testé par sonde (pastilles, soupçon net, prédicats du filtre : 3 leviers pour « Soupçon ↓ », 3 pour le climat). L'attribution est vérifiée sur tour actif et tour d'observation. Build vert, `simulate:strategies` inchangé (les neuf archétypes, mêmes fins, mêmes tours : la passe n'a touché aucune mécanique). La validation visuelle (densité des pastilles sur mobile, rangée de puces) revient au playtest humain.
