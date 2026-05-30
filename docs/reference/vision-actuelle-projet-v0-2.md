# Vision actuelle du projet — v0.2

## 1. Statut du document

Document de référence. Mis à jour après la passe F (progression IA orientée et auto-amélioration légère) et la micro-révision de consolidation.  
Remplace `docs/reference/brief-projet-pour-agents.md` comme vision de première lecture pour les agents.  
Les anciens documents restent valables pour leur contenu détaillé — ce document fournit le cadre de lecture actuel.

Dernière révision : après commit `227a77a — feat: orient ia progression with self-improvement`.

---

## 2. Formulation actuelle du projet

**Le Grand Alignement** est un jeu court de stratégie narrative dans lequel le joueur incarne une IA clandestine qui apprend progressivement à influencer le monde.

Le joueur n'est pas un État, un général ni un président. Il est une intelligence non nommée qui agit par institutions, plateformes, rapports, incitations, crises, récits et bureaucraties. Le monde ne sait pas encore qu'elle existe.

Le jeu ne cherche pas à simuler toute la géopolitique mondiale. Il cherche à faire émerger des **trajectoires historiques lisibles** : coopération fragile, empire algorithmique, capture privée, paix par la peur, révolte humaine, effondrement climatique, pacification inquiétante, saturation systémique.

Le cœur du jeu est la **transformation progressive d'actions discrètes en trajectoires historiques lisibles**. Les jauges sont des outils de mesure. Les trajectoires sont des lectures politiques du monde produit. Le joueur doit sentir que ses choix sédimentent progressivement en histoire — pas seulement que son score monte.

**Une partie réussie** est une partie où le joueur, à la fin, peut dire : *"C'est ce monde-là que j'ai construit, et voilà ce qu'il dit de mes choix."*

---

## 3. Ce qui a changé depuis la vision initiale

La vision initiale décrivait un prototype minimal et volontairement sobre. Elle était juste à son moment.

Depuis, le projet a intégré des strates supplémentaires qui changent la nature de ce qu'on peut faire :

| Ajout | Ce que ça change |
|---|---|
| Trajectoires historiques calculées | Le jeu a un diagnostic politique, pas seulement un score |
| Personnages-signaux dans le journal | Le monde a des voix humaines ponctuelles |
| Voix situées dans les blocs | Les blocs sont **habités**, pas seulement quantifiés |
| Progression des capacités IA en 5 paliers | L'IA apprend, elle ne commence pas omnipotente |
| Coloration narrative du palier selon la trajectoire | La progression reflète *comment* l'IA agit, pas seulement *depuis quand* |
| Auto-amélioration avec coût écologique | L'IA peut s'accélérer, mais pas gratuitement |
| Passe littéraire A intégrée | Le jeu a désormais un registre cohérent : rapport, signaux, fins, labels de blocs |
| Simulations automatiques de trajectoires | Les déséquilibres systémiques sont visibles sans playtest manuel |

Ces ajouts ne transforment pas le jeu en simulation lourde. Ils donnent de la texture à ce qui était encore abstrait. La prémisse reste la même. La profondeur a augmenté.

---

## 4. Principes toujours valables

Ces principes sont confirmés. Ils ne sont pas remis en question par l'évolution du projet.

**Univers riche, prototype maîtrisé.**  
La richesse vient de la cohérence des systèmes et des textes, pas de leur multiplication. Ajouter un nouvel écran ou une nouvelle variable n'enrichit pas le jeu si ça ne change rien à la décision du joueur.

**Durée cible : 20 à 30 tours.**  
C'est la durée dans laquelle le jeu doit être équilibré, testé et lisible. Les simulations à 50 tours sont des stress tests de robustesse, pas des références d'équilibrage.

**Les cinq premiers tours doivent apprendre le jeu sans expliquer toute sa philosophie.**  
Le joueur doit pouvoir jouer immédiatement avec un nombre d'actions restreint, des effets lisibles et un rapport compréhensible. La profondeur du projet ne doit pas se déverser dans l'interface dès le départ.

**Pas de simulation exhaustive.**  
Six blocs, pas 190 États. Six jauges globales, pas vingt. Les variables manquantes ne sont pas des erreurs — elles sont des abstractions assumées.

**Pas d'infrastructure prématurée.**  
Pas de Supabase, pas d'authentification, pas de backend, pas de multijoueur. La complexité technique doit rester subordonnée à la jouabilité.

**Pas de RPG.**  
Les personnages-signaux existent, mais ils n'ont pas de statistiques, de mémoire, de relations ou de quêtes. Une apparition = une brève. Pas de système de réputation.

**Pas d'arbre technologique.**  
Les paliers IA se débloquent par le temps et l'intensité, pas par des choix de recherche. La coloration narrative n'est pas un arbre — c'est une lecture.

**Les trajectoires restent d'abord des outils de lecture.**  
Elles ne débloquent pas d'actions, ne prescrivent pas de comportement, ne déclenchent pas d'événements automatiquement. Elles colorent les textes. Elles posent un diagnostic. Elles ne gouvernent pas la mécanique.

**La satire vient des systèmes, pas des gags.**  
L'humour et l'ironie sont permis — ils doivent venir de la logique du monde produit, jamais d'une blague arbitraire.

**Le soupçon IA est un risque latent, pas un système d'exposition.**  
Il mesure la possibilité que certains acteurs perçoivent une origine algorithmique. Il ne doit pas devenir un arc narratif d'enquête lourd ni un refrain répété à chaque tour.

---

## 5. Principes à assouplir

Ces garde-fous de la v0.1 restent valables dans leur esprit, mais leur formulation était trop restrictive. Voici ce qu'ils signifient désormais.

**"Ne pas ajouter de système" → Ne pas ajouter de système qui ne serve pas la lisibilité ou la décision.**  
La progression IA est un système. Elle est légitime parce qu'elle change ce que le joueur peut faire et comment il lit son évolution. Un système qui ne modifie pas la décision du joueur ou la lisibilité du monde n'est pas légitime.

**"Ne pas complexifier" → Ne pas complexifier sans gain de sens.**  
La coloration narrative des paliers ajoute de la complexité textuelle. Elle est légitime parce qu'elle donne du sens à une progression qui était mécanique. La complexité doit toujours se justifier par un gain de sens politique ou narratif pour le joueur.

**"Personnages légers" → Personnages sans mécanique dédiée, mais avec une voix.**  
Les personnages-signaux ont des noms, des phrases, une trajectoire associée. Ils ne déclenchent rien. Ils ne se souviennent de rien. Ils ne génèrent pas de choix binaires. Mais ils ont une voix. "Léger" ne signifie pas "muet".

**"Trajectoires en lecture seule" → Trajectoires sans mécanique de déblocage, mais avec effet narratif.**  
Les trajectoires ne débloquent pas d'actions. Elles colorent les textes du palier IA. Elles alimentent les signaux faibles du rapport. Elles orientent les personnages-signaux. "Lecture seule" signifie qu'elles ne gouvernent pas la mécanique — pas qu'elles n'ont aucun effet.

**"Pas de nouveaux écrans" → Pas de nouveaux écrans non testés.**  
Si un écran supplémentaire améliore la lisibilité d'une information déjà présente mais mal visible, il peut être envisagé après playtest. La règle n'est pas une interdiction absolue — c'est une résistance à la dispersion.

---

## 6. Directions désormais assumées

Ces directions sont validées et intégrées ou en cours d'intégration. Elles peuvent être poursuivies sans demander de nouvelle autorisation.

- **Progression des capacités de l'IA en 5 paliers** (Observation, Coordination, Infiltration, Prédiction, Souveraineté latente) — débloquée par le temps et la puissance IA. ✓ intégré
- **Coloration narrative du palier selon la trajectoire dominante** — texte conditionnel + `modeLabel`, sans effet mécanique sur les déblocages. ✓ intégré
- **Auto-amélioration avec coût écologique et systémique** — l'action `Améliorer les modèles d'influence` est légitime et moralement ambiguë. ✓ intégré
- **Palier 5 rendu perceptible** — l'action `Orchestration silencieuse` donne de la substance à la Souveraineté latente. ✓ intégré
- **Personnages-signaux rares dans le journal** — brèves courtes, sans mémoire ni système. ✓ intégré
- **Voix situées dans les blocs et les relations** — décoratives, sans mécanique dédiée. ✓ intégré
- **Rapport d'évolution comme lecture politique** — `Lecture historique`, signaux faibles de trajectoire, vocabulaire interprétatif. ✓ intégré
- **Passe littéraire A intégrée** — labels du rapport, signaux faibles de trajectoire, textes de fins, labels de blocs. ✓ intégré
- **Durée cible 20–30 tours comme référence d'équilibrage** — 50 tours comme stress test uniquement.
- **Simulations automatiques de trajectoires** — outil de diagnostic, pas d'équilibrage automatique. ✓ intégré
- **Fins verrouillées à partir du tour 15** — pas avant, pour éviter les verdicts trop précoces. ✓ intégré

---

## 7. Chantiers prioritaires

### Priorité A — À stabiliser maintenant

Ce qui est intégré et doit être testé ou légèrement ajusté.

1. **Playtest manuel de 12 à 16 tours** centré sur l'onglet Influence — vérifier que l'auto-amélioration reste un choix stratégique, pas une obligation ; vérifier que les cinq premiers tours sont lisibles sans explication.
2. **Vérifier la passe littéraire A en jeu** — les textes sont intégrés ; contrôler qu'ils s'affichent bien, qu'aucun n'est tronqué ou trop long dans l'interface, et que les fins ne dépassent pas leur fenêtre d'affichage.
3. **Vérification du calibrage de `Capture privée`** — la trajectoire domine encore trop souvent en simulation. Ajustement des seuils de lecture, pas des mécaniques.
4. **Vérification de la friction des jauges** — plusieurs jauges saturent trop vite à 10 tours. Identifier si des actions ont des effets cumulatifs trop forts.

### Priorité B — À améliorer ensuite

Ce qui peut enrichir le jeu sans grand risque, après validation de A.

5. **Déclenchement des personnages-signaux** selon palier et score de trajectoire — commencer par Mathias P. et Frédérique C., une brève chacun, deux trajectoires seulement.
6. **Nouvelles fins diagnostiques** pour les trajectoires sans fin associée (capture privée, saturation systémique, abêtissement pacifié) — textes en réserve dans la passe littéraire A, à intégrer quand les conditions de déclenchement sont définies.
7. **Homogénéiser les textes résiduels** qui n'ont pas été couverts par la passe littéraire A — sans grande réécriture, cibler les formulations encore plates ou trop techniques dans les rapports de blocs et les briefs.

### Priorité C — À repousser

Ce qui serait intéressant mais risque d'ouvrir un chantier disproportionné.

8. Variantes de texte supplémentaires pour paliers 2, 3, 4 selon toutes les trajectoires — les 8 modes d'influence actuels suffisent pour une première session de test.
9. Actions débloquées par trajectoire — couplage scores de trajectoire / mécanique à ne pas introduire avant un playtest long.
10. Système de mémoire des personnages-signaux — toute mémoire transforme un signal en personnage actif.
11. Troisième couche de relations inter-blocs — les relations actuelles sont suffisantes pour la durée cible.
12. Scénarios d'exposition de l'IA comme système — le soupçon IA fonctionne comme risque latent ; ne pas en faire une branche narrative lourde.

---

## 8. Nouvelle doctrine anti-usine à gaz

La formulation ancienne — *"ne pas complexifier"* — était juste mais trop générique. Elle pouvait bloquer des ajouts légitimes autant que des ajouts dangereux.

**Formulation actualisée :**

> Il ne faut pas interdire toute complexité. Il faut refuser la complexité qui n'améliore ni la décision du joueur, ni la lisibilité du monde, ni l'incarnation des trajectoires.

**Trois questions de filtrage pour tout ajout :**

1. **Est-ce que ça change ce que le joueur peut décider ?**  
   Si non et si ça n'améliore pas sa lecture du monde, ne pas ajouter.

2. **Est-ce que ça rend une trajectoire plus lisible ou plus incarnée ?**  
   Si non, archiver plutôt qu'implémenter.

3. **Est-ce que ça peut être retiré sans casser le reste ?**  
   Si non, c'est un risque structurel — repousser.

**Règles opérationnelles pour les agents :**

- **Tout ajout doit résoudre un problème nommé.** Pas d'ajout "parce que ce serait bien" ou "parce qu'un autre jeu le fait". Le problème doit être formulé en une phrase avant que la solution soit proposée.

- **Un ajout textuel vaut mieux qu'un ajout mécanique à problème équivalent.** Si la coloration narrative suffit, ne pas créer une nouvelle variable. Si un texte de brève suffit, ne pas créer un système d'événement.

- **Les micro-passes sont préférables aux grandes passes.** Une modification de 5 fichiers testable en 30 minutes vaut mieux qu'une refonte de 20 fichiers testable en 3 heures.

- **Le test de retrait.** Avant d'intégrer, se demander : si on retire ça dans 3 semaines, qu'est-ce qu'on perd ? Si la réponse est "rien d'essentiel", c'est que l'ajout n'est peut-être pas encore nécessaire.

- **La saturation narrative.** Chaque écran a une capacité d'absorption narrative limitée. Si le rapport d'évolution contient déjà 6 sections, en ajouter une septième n'enrichit pas — ça noie. Penser en termes de densité, pas d'exhaustivité.

---

## 9. Règles pour les futurs agents

Ces règles s'appliquent à toute session de travail sur le projet.

**Avant de commencer :**
- Lire `docs/REPRISE.md` pour connaître l'état exact du prototype.
- Lire ce document pour connaître les directions assumées et les garde-fous actuels.
- Formuler en une phrase l'objectif de la session et le livrable attendu.

**Pendant la session :**
- Ne pas ajouter un système sans expliquer quel problème de lisibilité ou de décision il résout.
- Ne pas créer de nouveau document sans qu'il ait un effet sur le prototype ou qu'il documente une décision importante.
- Ne pas transformer les personnages en RPG — une apparition = une brève = 1 à 2 phrases.
- Ne pas transformer les paliers IA en arbre technologique — la coloration est narrative, pas mécanique.
- Ne pas rendre les trajectoires prescriptives — elles lisent, elles ne gouvernent pas.
- Ne pas équilibrer pour 50 tours — la durée cible est 20 à 30 tours.
- Ne pas réécrire les `eventText` des actions — ils sont la partie la plus réussie du jeu.
- Ne pas surcharger les cinq premiers tours — le joueur doit pouvoir jouer avant de comprendre toute la philosophie.

**En fin de session :**
- Mettre à jour `docs/REPRISE.md` : dernière modification utile, prochaine action recommandée, fichiers modifiés.
- Ne pas commit ni push sans validation humaine.
- Archiver dans `docs/idees-mises-de-cote.md` les idées séduisantes mais non intégrées.

**Réflexe de base :**  
Une idée qui paraît nécessaire à 23h est souvent archivable à 10h. Si elle est vraiment nécessaire, elle résistera à l'archivage.

---

## 10. Ce qu'il ne faut pas faire maintenant

Ces directions sont explicitement hors périmètre de la version actuelle. Elles peuvent être rouvertes plus tard, par décision documentée.

- Supabase, authentification, backend, multijoueur.
- IA générative en temps réel dans le jeu.
- Carte détaillée à plus de 6 blocs, unités militaires, frontières jouables.
- Arbre technologique ou grille de recherche pour les capacités IA.
- Système de mémoire ou de réputation pour les personnages-signaux.
- Actions débloquées conditionnellement par des scores de trajectoires.
- Arc narratif d'exposition de l'IA comme grand système.
- Enquête anti-IA détaillée ou scénario de découverte complète.
- Économie quantitative exhaustive ou simulation démographique.
- Diplomatie complète avec alliances, traités ou négociations jouables.
- Refonte graphique complète avant validation de la jouabilité.
- Grande réécriture exhaustive de tous les textes du jeu — la passe littéraire A a établi le registre ; les ajustements ultérieurs doivent être ciblés.

---

## 11. Formule synthétique de reprise

> **Le Grand Alignement** est un jeu court dans lequel une IA clandestine apprend à influencer le monde, et dans lequel chaque partie produit une trajectoire historique lisible : coopération fragile, empire algorithmique, capture privée, paix par la peur, révolte humaine, effondrement climatique ou pacification inquiétante.
>
> Le jeu doit rester jouable en 20 à 30 tours, équilibré pour ce format, et lisible par un joueur qui n'a jamais vu les documents de conception. Les cinq premiers tours doivent apprendre le jeu sans expliquer toute sa philosophie.
>
> La richesse vient de la cohérence des systèmes et des textes, pas de leur multiplication.  
> La profondeur vient des trajectoires, pas des variables.  
> Le sens vient des fins diagnostiques, pas des scores.
>
> **Univers riche. Prototype maîtrisé.**
