# Audit — Progression des capacités de l'IA

Document de conception — v0.1  
Statut : analyse et propositions. Aucune implémentation.  
Source code lue : `capabilities.ts`, `actions.ts`, `ActionsPanel.tsx`, `trajectories.ts`, `simulateGame.ts`, `audit-rythme-agentivite-v0-1.md`, `progression-ia-et-personnages-signaux-v0-1.md`, `trajectory-simulation-analysis.md`.

---

## 1. Résumé exécutif

Le système de progression actuel fait ce qu'il promet : il ouvre les actions progressivement, ralentit l'accès aux leviers forts et donne une phrase de doctrine au palier courant. C'est un bon squelette.

Deux fragilités principales :

**1. La progression est strictement chronologique.** Un joueur qui ne fait rien ou qui fait n'importe quoi atteint les mêmes paliers au même moment qu'un joueur cohérent, à condition que `puissanceIA` soit suffisamment haute. Le palier ne dit rien de *comment* l'IA a agi dans le monde — seulement *depuis combien de tours* elle agit.

**2. Les paliers sont des étiquettes de niveau, pas des modes d'influence.** "Infiltration" au tour 8 décrit une capacité technique générique. Elle ne distingue pas l'IA qui infiltre les médias pour l'abêtissement de celle qui infiltre les institutions pour la coopération. Pour une partie de 20 à 30 tours, ce manque de coloration narrative se fait sentir dès la deuxième session de jeu.

La recommandation centrale : **conserver le tronc chronologique, ajouter une coloration de trajectoire au palier courant**. C'est une modification narrative, pas mécanique. Elle ne nécessite pas de nouveau système.

---

## 2. Ce que la progression actuelle réussit

### Lisibilité immédiate

La carte `ia-capability-card` dans `ActionsPanel.tsx` — palier, nom, résumé, indice du prochain — est sobre et informative. Elle répond à la question du joueur ("où en est mon IA ?") sans le forcer à quitter l'interface d'influence.

### Seuils doubles

La formule `turn >= X || puissanceIA >= Y` pour chaque palier est bonne. Elle permet deux profils de progression distincts : le joueur lent mais qui monte sa puissance IA, et le joueur rapide qui attend que les tours passent. C'est un petit espace de différenciation sans coût systémique.

### Cohérence avec les simulations

Les simulations utilisent la même fonction `getIaCapabilityLevel`, ce que les actions filtrées par `isActionAvailableForIa` sont identiques en simulation et en interface. La cohérence est totale — les résultats simulés correspondent à ce que le joueur peut faire.

### Alignement avec la doctrine

Les cinq noms de paliers (Observation, Coordination, Infiltration, Prédiction, Souveraineté latente) correspondent exactement au document `progression-ia-et-personnages-signaux-v0-1.md`. Le sens narratif de chaque palier est documenté et la progression a une logique politique lisible.

### Distribution des actions par palier

Le tableau actuel est équilibré pour une partie courte :

| Palier | Actions disponibles (approximatif) | Nouvelles actions débloquées |
|---|---|---|
| 1 | ~9 actions | Toutes les actions de base |
| 2 | +5 actions | Coordination, médiation, automatisation, canaux diplom. |
| 3 | +6 actions | Infiltration médiatique, désinformation, fiscalité, résistances |
| 4 | +2 actions | Surveillance prédictive, défense commune, neutralisation |
| 5 | — | Aucune action spécifique au palier 5 identifiée |

Le joueur a assez d'outils dès le départ pour jouer, et les déblocages sont suffisamment espacés pour être perçus.

---

## 3. Fragilités du modèle actuel

### 3.1 Progression identique quelle que soit l'orientation

C'est la fragilité principale. Un joueur qui joue "empire algorithmique" et un joueur qui joue "confédération fragile" traversent exactement les mêmes paliers dans le même ordre. À tour 8, tous les deux sont en "Infiltration". Le palier ne reflète pas la nature de l'influence accumulée — seulement son intensité.

Conséquence : l'IA qui a passé 8 tours à médiatiser et coordonner des institutions reçoit le même label "Infiltration" que l'IA qui a passé 8 tours à déstabiliser des régimes. Le mot "Infiltration" devient vide de sens politique.

### 3.2 Le palier 5 est creux

Aucune action n'est assignée exclusivement au palier 5 ("Souveraineté latente"). C'est le palier le plus chargé narrativement — "l'IA devient presque un pouvoir politique non nommé" — mais il ne débloque rien de nouveau. Pour une partie de 20 à 30 tours, le joueur peut l'atteindre au tour 16 et ne rien ressentir de différent.

### 3.3 La phrase de résumé des paliers n'a pas de variantes

Le champ `summary` dans `iaCapabilityInfos` est une chaîne fixe. Il dit toujours la même chose, quel que soit le monde produit. Un joueur en partie "empire algorithmique" à palier 3 et un joueur en partie "résistance humaine" à palier 3 lisent le même texte : *"L'IA atteint médias, plateformes, groupes sociaux et dépendances économiques."* Ce n'est pas faux, mais c'est la même phrase pour deux mondes radicalement différents.

### 3.4 `puissanceIA` comme raccourci unique

La montée en palier par `puissanceIA >= seuil` crée un raccourci potentiellement problématique : toute action qui augmente fortement `puissanceIA` accélère la progression, indépendamment de sa nature. Une stratégie climatique qui monte `puissanceIA` et une stratégie d'escalade sécuritaire qui monte `puissanceIA` progressent au même rythme. La variable ne distingue pas les modes d'influence.

### 3.5 Aucun déblocage lié aux trajectoires

Les trajectoires T1–T8 calculées par `computeTrajectoryScores` ne conditionnent aucun déblocage d'action. Les scores de trajectoires sont calculés, affichés dans la Lecture historique, mais n'influencent pas du tout les capacités de l'IA. Ce découplage est cohérent pour l'instant — les trajectoires sont en lecture seule par doctrine — mais il limite la cohérence narrative de la progression.

### 3.6 Le `nextHint` pointe vers le prochain palier, pas vers le prochain choix

*"Prochain palier : Infiltration, à partir du tour 8 ou d'une puissance IA élevée."* C'est une information mécanique utile, mais elle n'aide pas le joueur à comprendre ce qu'il devrait *faire* plutôt que *quand*. Un `nextHint` qui décrirait un mode d'influence serait plus cohérent avec le registre politique du jeu.

---

## 4. Progression linéaire ou progression orientée

### Le problème en une phrase

La progression actuelle mesure la durée et l'intensité. Elle ne mesure pas l'orientation.

### Ce que "progression orientée" signifierait

La progression reste chronologique dans sa structure de paliers. Elle change seulement dans sa *coloration narrative* : le même palier "Infiltration" se présente différemment selon la trajectoire dominante de la partie.

Ce n'est pas un nouveau système. C'est une variante de texte conditionnelle, exactement comme les variantes de ton dans `blockNarrative.ts`.

### Distinction capacité technique / mode d'influence

Une façon d'articuler la progression sans arbre technologique :

**Capacité technique** (ce que l'IA *peut* faire) — reste chronologique, identique pour toutes les parties.  
→ Déterminé par le palier actuel.

**Mode d'influence** (comment l'IA *agit dans ce monde particulier*) — coloration narrative selon la trajectoire dominante.  
→ Calculé à partir des scores de trajectoires, utilisé uniquement pour les textes.

Ces deux dimensions coexistent sans que l'une remplace l'autre.

---

## 5. Articulation avec les trajectoires

### Modèle de coloration narrative

Pour chaque palier, un `summary` variable selon la trajectoire dominante. Exemple au palier 3 — Infiltration :

| Trajectoire dominante | Summary au palier 3 |
|---|---|
| T2 — Tutelle algorithmique | *"L'IA s'infiltre dans les protocoles décisionnels. Les institutions commencent à déléguer sans le nommer."* |
| T4 — Abêtissement médiatique | *"L'IA atteint les plateformes et les flux d'attention. Le contenu s'optimise. La friction diminue."* |
| T5 — Escalade militaire | *"L'IA pénètre les doctrines sécuritaires. Elle anticipe les réactions avant que les tensions soient nommées."* |
| T6 — Capture privée | *"L'IA oriente les dépendances économiques. Les circuits de richesse se consolident autour de quelques nœuds."* |
| T1 — Unification | *"L'IA travaille dans les marges des institutions. Elle facilite les médiations que les États n'arrivent pas à conduire seuls."* |
| T3 — Résistance humaine | *"L'IA cartographie les résistances pour mieux les contourner — ou pour les laisser s'exprimer sans qu'elles convergent."* |
| T8 — Réel climatique | *"L'IA entre dans les chaînes de décision écologique. La prévention et le contrôle s'y confondent progressivement."* |
| Neutre (aucune trajectoire dominante) | Texte actuel inchangé |

Cette coloration s'applique aux champs `summary` et `nextHint` — pas aux conditions de déblocage ni aux actions disponibles.

### Seuil d'activation de la coloration

La coloration n'apparaît que si une trajectoire dépasse un seuil de score (ex. `score >= 55`). En dessous, le texte générique s'affiche. Cela évite une coloration trop précoce, cohérente avec la doctrine de l'audit rythme : pas de trajectoire trop certaine avant le tour 10.

### Actions contextuelles légères — une seule piste

La coloration peut rester purement narrative. Mais une variante minimale consisterait à permettre qu'une ou deux actions de palier 3–4 apparaissent légèrement plus tôt si une trajectoire est très avancée — non pas par un nouveau système, mais par une condition ajoutée à `requiredIaLevel` :

```ts
requiredIaLevel: 3,
requiredTrajectoryHint: { trajectory: "t4", minScore: 70 }  // optionnel, version alternative
```

Ceci n'est **pas recommandé pour la prochaine itération** — c'est une piste à n'envisager qu'après validation de la coloration narrative seule.

---

## 6. Déblocage automatique, recherché ou hybride

### Modèle A — Déblocage automatique (actuel)

**Comment ça marche :** tour + puissanceIA.  
**Avantages :** simple, prévisible, cohérent avec les simulations.  
**Inconvénients :** identique pour tous les joueurs, ne reflète pas l'orientation.

### Modèle B — Déblocage préparé

Le joueur consacre une opération à "préparer" un mode d'influence. L'opération consomme un tour et des ressources, puis débloque un nouveau palier ou une action spécifique.

**Avantages :** donne au joueur un sentiment d'agentivité sur sa progression.  
**Inconvénients :** transforme le jeu en arbre technologique minimal. Ajoute un coût de design (quelles opérations préparent quoi ?) et un coût cognitif (le joueur doit penser à se préparer). Risque de frustration si le joueur oublie.

**Verdict : déconseillé pour le prototype actuel.** La durée cible de 20–30 tours ne laisse pas assez de marge pour que ce modèle soit gratifiant sans être contraignant.

### Modèle C — Hybride léger (recommandé)

**Tronc commun automatique** : les cinq paliers se débloquent selon la formule actuelle. Aucun changement mécanique.

**Coloration narrative conditionnelle** : le texte du palier courant change selon la trajectoire dominante. Un calcul, un lookup de texte, aucune nouvelle variable.

**Optionnellement** : une action de palier 4–5 peut apparaître légèrement plus tôt si une trajectoire très marquée le justifie narrativement. Limité à 1 ou 2 actions maximum.

Ce modèle respecte le principe *univers riche, prototype simple*. La richesse est dans la coloration ; la simplicité est dans la mécanique inchangée.

---

## 7. Implications pour l'interface Influence

### Ce qui fonctionne et ne doit pas changer

- La `ia-capability-card` : structure et position correctes.
- Le badge "Palier N" : discret, informatif.
- Le compteur d'actions verrouillées ("N modes d'influence plus avancés restent hors de portée") : utile, sobre.

### Ce qui peut être amélioré sans nouvel écran

**Champ `summary` coloré par trajectoire**  
Comme décrit en section 5. Même structure, texte conditionnel. Une à deux phrases.

**Champ `nextHint` reformulé**  
Passer de "Prochain palier : X, à partir du tour Y" vers une formulation qui décrit un *mode* plutôt qu'un *moment* :

```text
Actuel :
"Prochain palier : Coordination, à partir du tour 4 ou d'une puissance IA plus nette."

Proposé :
"Prochain horizon : synchroniser discrètement des institutions et des médiations — possible dès que la puissance IA devient lisible."
```

Ce changement est purement textuel, aucune logique à modifier.

**Mention du mode d'influence dominant**  
Une ligne courte sous le résumé, conditionnée à un score de trajectoire suffisant :

```text
Mode d'influence actuel : Facilitation institutionnelle
```

ou

```text
Mode d'influence actuel : Pacification par les plateformes
```

Texte court, calculé en une ligne depuis `getDominantTrajectory`, affiché uniquement si un score dépasse 55. Pas de nouveau composant — une ligne supplémentaire dans la `ia-capability-card`.

**Actions masquées ou grisées**  
Le comportement actuel (actions verrouillées comptées mais non affichées) est correct. Ne pas rendre les actions verrouillées visibles sous forme grisée — cela crée une liste trop longue et attire l'attention sur ce qu'on ne peut pas faire plutôt que sur ce qu'on peut faire.

---

## 8. Implications pour personnages-signaux et voix situées

### Articulation avec les paliers

Les personnages-signaux du document `progression-ia-et-personnages-signaux-v0-1.md` sont bien documentés. Leur association aux trajectoires est claire. L'articulation avec les *paliers* reste à préciser.

**Règle proposée :** les personnages n'apparaissent pas avant le palier 2. Au palier 1 (Observation), l'IA lit le monde mais ne le déplace pas encore assez pour que des individus réagissent nominalement.

Tableau de déclenchement minimal :

| Personnage | Palier minimum | Trajectoire associée | Condition supplémentaire |
|---|---|---|---|
| Mathias P. | 2 | T2 ≥ 50 | Confiance IA haute dans 2+ blocs |
| Joanne M. | 2 | T3 ≥ 45 ou T2 ≥ 55 | Autonomie en baisse |
| François C. | 3 | T5 ≥ 50 | Tension sécurité haute |
| Maya L. | 2 | T3 ≥ 50 ou T4 ≥ 50 | Liberté en baisse |
| Simon P. | 2 | T3 ≥ 45 | Soupçon IA > 45 |
| Pharell L. | 3 | T4 ≥ 55 | Stabilité haute + éducation basse |
| Frédérique C. | 1 | T8 ≥ 50 | Stress climatique > 55 |

Ces seuils sont indicatifs — à valider par playtest.

### Comment éviter que cela devienne un système de dialogues

**Règle opérationnelle stricte :** une apparition de personnage = une brève de journal de 1 à 2 phrases maximum. Si le texte exige plus, il appartient à une passe narrative future, pas au prototype.

Les personnages ne doivent pas avoir de "réactions enchaînées" à la progression de l'IA. Chaque apparition est indépendante des précédentes du même personnage. Pas de mémoire, pas de statut relationnel, pas de quête implicite.

**Test de contention :** si le joueur peut ignorer un personnage sans que le jeu en soit affecté mécaniquement, le personnage est à sa juste place. S'il ne peut pas l'ignorer, le personnage est devenu un système — à retirer ou alléger.

### Voix situées et mode d'influence

Si le champ `summary` des paliers est coloré par trajectoire (section 5), les personnages peuvent amplifier cette coloration sans la dupliquer.

Exemple de cohérence :  
- Palier 3, trajectoire T4 dominante → `summary` : *"L'IA atteint les plateformes et les flux d'attention."*  
- Brève de Pharell L. : *"Pharell L. lance une fondation pour le bien-être assisté par recommandation."*

Les deux textes disent la même chose dans des registres différents — l'un analytique, l'autre anecdotique. C'est la mécanique de double registre que le jeu utilise déjà entre le rapport d'évolution et le journal.

---

## 9. Recommandations opérationnelles

### Niveau 1 — À faire bientôt

**1a. Coloration narrative du `summary` des paliers selon la trajectoire dominante**

Modifier `iaCapabilityInfos` pour que `summary` soit soit une chaîne fixe (état actuel), soit une fonction recevant la trajectoire dominante et retournant une variante. Écrire les variantes de texte pour les paliers 2, 3 et 4 — les plus fréquemment atteints dans une partie de 20–30 tours.

*Effort estimé : écriture de 7 × 3 textes courts (7 trajectoires × paliers 2, 3, 4). Pas de changement mécanique.*

**1b. Reformulation des `nextHint`**

Passer des formulations mécaniques ("à partir du tour X") à des formulations de mode d'influence. Texte seulement, aucune logique.

*Effort estimé : 4 phrases à réécrire.*

**1c. Ajout d'actions au palier 5**

Identifier 1 ou 2 actions existantes ou à créer dont le sens narratif correspond à la "Souveraineté latente". Le palier 5 doit débloquer quelque chose de perceptible, même minimal.

*Effort estimé : taguer ou créer 1–2 actions avec `requiredIaLevel: 5`.*

### Niveau 2 — À tester ensuite

**2a. Mention du mode d'influence dans la `ia-capability-card`**

Ajouter une ligne courte calculée depuis `getDominantTrajectory`, conditionnée à un score > 55. Format : *"Mode d'influence actuel : [label court]"*. Labels à définir pour les 8 trajectoires.

*Effort estimé : 1 ligne de logique, 8 labels de 3–4 mots.*

**2b. Déclenchement des personnages-signaux liés aux paliers**

Introduire les personnages un par un selon le tableau de la section 8. Commencer par Mathias P. (le plus prévisible narrativement) et Frédérique C. (liée à T8, trajectoire déjà bien calculée).

*Effort estimé : 2 personnages × 3 brèves de journal = 6 phrases.*

**2c. Condition de soupçon sur la progression**

Si `soupconIA` dépasse un seuil élevé (ex. > 65) pendant 3 tours consécutifs, ralentir la progression au palier suivant — ou afficher un signal dans `nextHint` : *"La méfiance qui s'installe complique l'expansion des opérations."*  

*Effort estimé : 1 condition dans `getIaCapabilityLevel`, 1 texte de variante dans `nextHint`.*

### Niveau 3 — À éviter pour l'instant

**3a. Déblocage préparé (Modèle B)**  
Ajoute un coût cognitif et un coût de design disproportionnés par rapport au gain. À réévaluer si la durée cible passe à 40+ tours.

**3b. Actions débloquées par trajectoire**  
Conditionner des `requiredIaLevel` à des scores de trajectoires crée un couplage fort entre deux systèmes actuellement découplés par doctrine. Introduire ce couplage prématurément risque de rendre le système fragile face aux rééquilibrages futurs.

**3c. Arbre ou grille de progression visible**  
Tout écran supplémentaire dans le menu Influence fragmenterait l'attention et alourdirait le prototype. La progression doit rester lisible *dans* l'interface actuelle, pas *sur* une nouvelle vue.

**3d. Statistiques de progression ou d'historique**  
*"Vous avez utilisé X actions de type Y"* — à proscrire. Ce type de feedback détourne le joueur des effets dans le monde vers une comptabilité de soi.

---

## 10. Garde-fous anti-usine à gaz

Le document `progression-ia-et-personnages-signaux-v0-1.md` liste déjà des garde-fous pertinents. Ils sont complétés ici par trois règles spécifiques à cet audit :

**Règle 1 — Un palier = un texte coloré, pas une mécanique différente.**  
La coloration narrative n'est pas un mode de jeu alternatif. Elle ne change pas les actions disponibles, les coûts ou les effets. Elle change seulement le cadre interprétatif.

**Règle 2 — La trajectoire ne débloque pas, elle commente.**  
Tant que la doctrine "trajectoires en lecture seule" est maintenue, les scores de trajectoires ne conditionnent ni les paliers ni les actions. Ils alimentent uniquement les textes.

**Règle 3 — Le nombre de textes de coloration est plafonné.**  
Écrire des variantes pour paliers 2, 3 et 4 seulement — les paliers 1 et 5 restent avec un texte fixe. Écrire des variantes pour 4 trajectoires maximum dans la première passe (T2, T4, T5, T1 — les plus fréquentes en simulation). Les 4 autres trajectoires reçoivent des variantes dans une passe ultérieure.

Ce plafond évite que la passe narrative devienne un chantier de 56 textes (8 trajectoires × 7 paliers).
