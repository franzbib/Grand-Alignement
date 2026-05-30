# Le Grand Alignement — Personnages-signaux v0.2

## Décision de conception

Les personnages-signaux doivent être conservés comme une couche narrative et systémique légère. Ils ne sont pas des héros, pas des unités, pas des PNJ de RPG. Ils incarnent des tensions déjà présentes dans les trajectoires du jeu et peuvent accélérer faiblement certaines évolutions, sans jamais les créer seuls.

**Formule de travail :** un personnage-signal est une voix publique qui rend visible une trajectoire, pas un nouveau moteur de jeu.

## Règle d’intégration

- Aucun nouvel écran en v0.1.
- Apparition dans le journal ou le rapport d’évolution.
- Maximum un personnage par tour.
- Un même personnage ne doit pas réapparaître avant 2 ou 3 tours.
- Une apparition doit être conditionnée par des variables ou par un score de trajectoire.
- Un personnage peut ajouter un faible modificateur narratif ou de trajectoire, mais jamais déclencher une fin seul.
- Les personnages doivent clarifier le monde, non le détourner.

## Liste canonique

| ID | Personnage | Archétype | Trajectoires associées | Tension incarnée |
|---|---|---|---|---|
| `mathias_p` | Mathias P. | Prophète de l’IA | Empire algorithmique / technocratie | Efficacité contre autonomie |
| `joanne_m` | Joanne M. | Féministe | Lucidité sociale / critique des inégalités | Progrès contre effets différenciés |
| `francois_c` | François C. | Dictateur | Paix par la peur / autoritarisme | Ordre contre pluralisme |
| `maya_l` | Maya L. | Artiste engagée | Résistance culturelle / critique des indicateurs | Culture contre optimisation |
| `simon_p` | Simon P. | Défenseur de la liberté à tout crin | Révolte humaine / anti-surveillance | Sécurité contre liberté |
| `pharell_l` | Pharell L. | Sportif | Spectacle / performance / corps social | Performance contre humanité |
| `frederique_c` | Frédérique C. | Écologiste militante | Climat / ralentissement volontaire / révolte écologique | Climat contre croissance |

## Fonctions ludiques

### 1. Signal
Le personnage rend visible une trajectoire déjà active : empire algorithmique, révolte humaine, paix par la peur, ralentissement volontaire, abêtissement médiatique, lucidité critique, technocratie verte.

### 2. Catalyseur léger
Le personnage peut accélérer une pente déjà présente. Sa présence peut ajouter un léger poids à une trajectoire ou produire un signal faible dans le rapport, mais elle ne doit pas remplacer les variables globales.

### 3. Mémoire émotionnelle
Le joueur retrouve parfois les mêmes noms. Ces retours créent une mémoire de partie : montée, récupération, marginalisation, retournement, collision entre figures.

## Architecture recommandée

Créer une couche pure, testable et indépendante :

- `src/data/signalCharacters.ts` : fiches des personnages et moments possibles.
- `src/engine/signalCharacters.ts` : sélection d’un moment pertinent selon l’état du jeu.
- Intégration légère dans le journal ou le rapport post-tour.
- Aucun état individuel visible.
- Historique minimal dans `GameState` pour éviter les répétitions : `lastCharacterSignals` ou équivalent.

## Types TypeScript indicatifs

```ts
export type SignalCharacterId =
  | "mathias_p"
  | "joanne_m"
  | "francois_c"
  | "maya_l"
  | "simon_p"
  | "pharell_l"
  | "frederique_c";

export type SignalCharacter = {
  id: SignalCharacterId;
  name: string;
  archetype: string;
  primaryTrajectories: TrajectoryId[];
  tension: string;
  description: string;
};

export type SignalCharacterMoment = {
  id: string;
  characterId: SignalCharacterId;
  trajectoryTag: TrajectoryId | "collision";
  minTurn?: number;
  priority: number;
  cooldownTurns?: number;
  condition: (state: GameState, scores: TrajectoryScores) => boolean;
  journalEntry: string;
  reportSignal?: string;
  trajectoryDeltas?: Partial<Record<TrajectoryId, number>>;
};
```

## Catalogue de moments v0.2

| Personnage | Trajectoire | Condition indicative | Entrée possible |
|---|---|---|---|
| Mathias P. | Empire algorithmique | aiPower >= 55 et humanAutonomy <= 45 | Mathias P. déclare qu’un gouvernement responsable ne devrait plus contredire les probabilités. Plusieurs cabinets reprennent la formule, d’abord entre guillemets. |
| Mathias P. | Collision lucidité/autonomie | collectiveLucidity >= 60 et aiTrust >= 65 | Mathias P. publie une tribune limpide : les humains comprennent mieux le monde depuis qu’ils cessent de décider seuls. |
| Joanne M. | Lucidité sociale | education moyenne haute et socialTension >= 55 | Joanne M. documente les effets inégaux de l’automatisation sociale. Le rapport irrite les institutions, ce qui explique en partie son succès. |
| Joanne M. | Anti-abêtissement | collectiveLucidity baisse et entertainment/divertissement actif | Joanne M. critique une paix sociale obtenue par fatigue organisée. Les réactions officielles parlent d’un malentendu de communication. |
| François C. | Paix par la peur | escalationRisk >= 65 ou militarization moyenne >= 60 | François C. réclame des pouvoirs provisoires afin de restaurer la stabilité. Le provisoire reçoit immédiatement un secrétariat permanent. |
| François C. | Autoritarisme efficace | stability basse et freedom basse | François C. assure que la liberté reviendra dès que les citoyens auront prouvé qu’ils savent l’utiliser. |
| Maya L. | Résistance culturelle | humanAutonomy <= 50 ou collectiveLucidity >= 55 | Maya L. expose une série de formulaires refusés par l’IA. Le public rit d’abord, puis reconnaît certains documents. |
| Maya L. | Critique des indicateurs | cohesion haute et lucidité stagnante | Maya L. demande quel indicateur mesure la résignation. Aucun ministère ne répond, mais trois comités sont créés. |
| Simon P. | Révolte humaine | surveillance élevée ou humanAutonomy <= 40 | Simon P. lance une campagne pour le droit à décider mal. Les experts dénoncent un slogan irresponsable ; il devient pourtant l’un des plus repris. |
| Simon P. | Collision sécurité/liberté | stability haute et freedom basse | Simon P. observe qu’un peuple parfaitement sécurisé ressemble parfois à un prisonnier bien traité. |
| Pharell L. | Abêtissement médiatique | collectiveLucidity <= 40 et stability >= 65 | Pharell L. devient l’ambassadeur involontaire d’un programme de performance civique. Les affiches sourient plus que lui. |
| Pharell L. | Résistance au spectacle | divertissement haut et autonomie basse | Pharell L. refuse de noter sa motivation quotidienne dans l’application mondiale de performance. Le refus paraît minuscule ; il circule partout. |
| Frédérique C. | Ralentissement volontaire | climateStress >= 65 et wealth en baisse | Frédérique C. défend un ralentissement assumé. Les marchés parlent de régression ; plusieurs villes parlent enfin de respiration. |
| Frédérique C. | Technocratie verte | climateStress haut et aiPower haut | Frédérique C. soutient l’urgence climatique, mais refuse que chaque geste écologique soit certifié par surveillance permanente. |

## Algorithme de sélection recommandé

1. Calculer les scores de trajectoires existants.
2. Identifier les moments dont les conditions sont vraies.
3. Exclure les personnages apparus trop récemment.
4. Trier par priorité, puis par adéquation avec la trajectoire dominante.
5. Ne retenir qu’un seul moment.
6. Ajouter l’entrée au journal ou au rapport.
7. Appliquer au besoin un très faible modificateur de trajectoire.

Pseudo-code :

```ts
export function selectSignalCharacterMoment(state: GameState): SignalCharacterMoment | null {
  const scores = computeTrajectoryScores(state);
  const eligible = signalCharacterMoments
    .filter((moment) => moment.condition(state, scores))
    .filter((moment) => !wasRecentlyShown(state, moment.characterId, moment.cooldownTurns ?? 3));

  return eligible
    .sort((a, b) => scoreMoment(b, scores) - scoreMoment(a, scores))[0] ?? null;
}
```

## Garde-fous d’écriture

- Le personnage ne se présente jamais lui-même lourdement.
- Le texte doit être compréhensible sans fiche encyclopédique.
- Pas de réplique directe longue.
- Pas de gag autonome.
- Le personnage doit apparaître comme produit par l’état du monde.
- Le ton doit rester clair, élégant, lisible, avec un humour rare.

## Tests de playtest

Pendant 10 à 15 tours, observer :

1. Le personnage apparaît-il au bon moment ?
2. Rend-il la trajectoire plus lisible ?
3. Le journal devient-il plus vivant sans devenir bavard ?
4. Les personnages ne se répètent-ils pas trop ?
5. Les collisions entre personnages enrichissent-elles les dilemmes ?
6. Le joueur se souvient-il d’au moins un personnage après la partie ?

## Prompt Codex ciblé

Tu travailles sur Le Grand Alignement, prototype React/TypeScript/Vite. Ajoute une micro-couche de personnages-signaux en respectant strictement le principe : univers riche, prototype simple. Crée `src/data/signalCharacters.ts` et `src/engine/signalCharacters.ts`. Les personnages sont Mathias P., Joanne M., François C., Maya L., Simon P., Pharell L. et Frédérique C. Chaque personnage doit avoir un id, un nom, un archétype, une tension incarnée, des trajectoires associées et 2 moments conditionnels maximum. Les moments doivent être sélectionnés selon l’état de jeu et les scores de trajectoires existants. Intégration : journal ou rapport seulement. Pas de nouvel écran, pas de RPG, pas de quêtes, pas de dialogues longs, pas de statistiques individuelles visibles. Ajouter un garde-fou anti-répétition. Vérifier `npm.cmd run build`.

## Prompt Claude ciblé

Écris ou révise les moments des personnages-signaux du Grand Alignement. Style : clair, élégant, compréhensible, légèrement littéraire mais non cryptique, avec humour rare. Les personnages ne sont pas des héros : ce sont des figures publiques qui rendent visibles des trajectoires. Chaque moment doit être lié à une variable ou à une trajectoire : empire algorithmique, révolte humaine, paix par la peur, ralentissement volontaire, technocratie verte, abêtissement médiatique, lucidité critique. Pas de dialogues longs, pas de scènes, pas de blagues gratuites.
