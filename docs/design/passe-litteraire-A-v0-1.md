# Passe littéraire A — Textes prêts à intégrer

Document de conception — v0.1  
Statut : textes définitifs, prêts à intégrer dans le code.  
Ne pas modifier sans validation humaine.

---

## 1. Remplacement des titres de sections du rapport

### Règle générale

Passer d'un vocabulaire de tableau de bord à celui d'un rapport politique lisible.  
Chaque titre répond à une question implicite du lecteur, pas à une catégorie fonctionnelle de système.

### Fichier cible : `src/components/EvolutionReportPanel.tsx`

| Terme actuel | Action | Nouveau terme | Justification |
|---|---|---|---|
| `Effets majeurs` | **Remplacer** | `Ce tour` | Ancre temporellement, sans prétention |
| `Blocs affectés` | **Remplacer** | `Mouvements dans les blocs` | Plus dynamique, moins liste de dommages |
| `Frictions & Évolutions` | **Remplacer** | `Entre les blocs` | Sobre, clair, sans le `&` qui fait interface produit |
| `Variations` | **Remplacer** | `Évolutions locales` | Un mot de plus, beaucoup moins froid |
| `Sociétés` | **Remplacer** | `Climat social` | Précis, déjà dans la charte, cohérent avec `blockNarrative.ts` |
| `Focus` | **Remplacer** | `Bloc en premier plan` | Anglicisme éliminé, sens identique |
| `Point chaud` | **Remplacer** | `Tension principale` | Registre diplomatique plutôt que journalistique |
| `Tendances globales` | **Remplacer** | `Signaux du monde` | Plus proche du vocabulaire de trajectoire voulu |
| `Indicateurs` | **Remplacer** | `Jauges globales` | Fonctionnel, sobre, cohérent avec le reste |
| `Débloquées` | **Remplacer** | `Nouvelles opérations disponibles` | Élimine le vocabulaire de jeu vidéo mécanique |
| `Signaux secondaires` | **Remplacer** | `Orientations secondaires` | Cohérence avec "Lecture historique" |
| `Statut général` | **Remplacer** | `Situation générale` | Légèrement moins tableau de bord |
| `Signaux faibles` | **Conserver** | — | Terme juste, dans la doctrine |
| `Lecture historique` | **Conserver** | — | Excellent, ne pas toucher |
| `Relations inter-blocs` | **Conserver** | — | Clair, précis, fonctionnel |
| `Opérations préparées` | **Conserver** | — | Juste |
| `En cours` | **Conserver** | — | Fonctionnel |
| `Interventions` | **Conserver** | — | Correct dans ce contexte |
| `Événement Systémique` | **Conserver** | — | L'eyebrow fonctionne dans son registre d'alerte |

### Textes d'accompagnement à réviser

**Note sous "Lecture historique"**

```text
Actuel :
"Diagnostic indicatif : à confronter à la carte, aux blocs et au journal."

Nouveau :
"Lecture indicative — à confronter à la carte, aux blocs et au journal."
```

**Rapport vide (aucune opération déployée)**

```text
Actuel :
"Aucune opération n'a encore été déployée."

Nouveau :
"Le monde attend. Aucune opération n'a encore été déployée."
```

**Aucun changement notable**

```text
Actuel :
"Aucun changement notable ce tour-ci."

Nouveau :
"Aucun mouvement notable ce tour. Le monde poursuit son inertie — ce qui n'est ni une garantie ni un repos."
```

---

## 2. Signaux faibles de trajectoire — versions prêtes à intégrer

### Principe appliqué

Une phrase complète par signal. Ton interprétatif, pas alerte technique.  
Structure implicite : nommer la trajectoire — dire ce qu'elle signifie concrètement — laisser l'interprétation ouverte.

### Fichier cible : `src/engine/trajectories.ts` — fonction `getTrajectoryWeakSignals`

**T1 — Unification humaine imparfaite**

```text
Actuel :
"Unification humaine imparfaite : la cohésion progresse sans effacer la lenteur institutionnelle."

Nouveau :
"Unification humaine imparfaite : la cohésion progresse, mais les institutions gardent leur lenteur — signe qu'elles restent vivantes."
```

**T2 — Tutelle algorithmique**

```text
Actuel :
"Tutelle algorithmique avancée."

Nouveau :
"Tutelle algorithmique : les décisions humaines ne disparaissent pas encore, elles deviennent des ratifications."
```

**T3 — Résistance humaine**

```text
Actuel :
"Résistance humaine en cristallisation."

Nouveau :
"Résistance humaine : plusieurs blocs développent une méfiance active envers les systèmes algorithmiques. Elle n'est pas encore coordonnée."
```

**T4 — Abêtissement médiatique**

```text
Actuel :
"Abêtissement médiatique : la stabilité apparente masque une perte de lucidité."

Nouveau :
"Abêtissement médiatique : la stabilité s'installe, mais la capacité à contester ce qui la produit recule discrètement."
```

**T5 — Escalade militaire**

```text
Actuel :
"Escalade militaire en progression."

Nouveau :
"Escalade militaire : la peur devient un mode de coordination entre les blocs. Les canaux de désescalade existent encore — et sont moins utilisés."
```

**T6 — Capture privée**

```text
Actuel :
"Capture privée : la richesse se concentre autour de dispositifs peu contestés."

Nouveau :
"Capture privée : la richesse se concentre dans des mains que les institutions ne savent plus exactement nommer."
```

**T7 — Saturation systémique**

```text
Actuel :
"Saturation systémique en progression."

Nouveau :
"Saturation systémique : les institutions répondent encore, mais leurs délais allongent et leurs contradictions s'accumulent."
```

**T8 — Réel climatique**

```text
Actuel :
"Stress climatique critique."

Nouveau :
"Réel climatique : le stress climatique dépasse les seuils que les institutions ont cessé de nommer publiquement."
```

### Bloc prêt à remplacer dans `trajectories.ts`

```typescript
export function getTrajectoryWeakSignals(scores: TrajectoryScores): string[] {
  const signals = [
    scores.t1 >= 65
      ? "Unification humaine imparfaite : la cohésion progresse, mais les institutions gardent leur lenteur — signe qu'elles restent vivantes."
      : null,
    scores.t5 >= 65
      ? "Escalade militaire : la peur devient un mode de coordination entre les blocs. Les canaux de désescalade existent encore — et sont moins utilisés."
      : null,
    scores.t2 >= 65
      ? "Tutelle algorithmique : les décisions humaines ne disparaissent pas encore, elles deviennent des ratifications."
      : null,
    scores.t4 >= 65
      ? "Abêtissement médiatique : la stabilité s'installe, mais la capacité à contester ce qui la produit recule discrètement."
      : null,
    scores.t6 >= 65
      ? "Capture privée : la richesse se concentre dans des mains que les institutions ne savent plus exactement nommer."
      : null,
    scores.t8 >= 65
      ? "Réel climatique : le stress climatique dépasse les seuils que les institutions ont cessé de nommer publiquement."
      : null,
    scores.t7 >= 65
      ? "Saturation systémique : les institutions répondent encore, mais leurs délais allongent et leurs contradictions s'accumulent."
      : null,
    scores.t3 >= 65
      ? "Résistance humaine : plusieurs blocs développent une méfiance active envers les systèmes algorithmiques. Elle n'est pas encore coordonnée."
      : null,
  ];

  return signals.filter((signal): signal is string => Boolean(signal)).slice(0, 2);
}
```

---

## 3. Textes de fins — versions étendues

### Principe appliqué

- Sujet grammatical : le monde produit, pas l'IA ni le joueur.
- Ton : plus grave que le reste du jeu. Ni sermon ni résumé de score.
- Longueur : 4 à 6 phrases. Dernière phrase forte mais claire.
- Ne pas dire explicitement "vous avez gagné" ou "vous avez perdu".

### Fichier cible : `src/data/endings.ts` — champ `description` uniquement

Ne pas modifier `condition`, `type` ou `tone`.

---

**`fragile-confederation` — Confédération fragile**

```text
Actuel :
"Le monde coopère sans devenir simple. Les compromis avancent lentement, et c'est déjà beaucoup."

Nouveau :
"Le monde coopère sans devenir simple. Les blocs gardent leurs désaccords, leurs lenteurs, leurs intérêts divergents — et c'est précisément pourquoi l'accord tient. Les compromis avancent, pas vers une paix parfaite, mais vers une manière commune de rester dans le même monde. L'IA a joué un rôle dans cette construction. Elle n'en a pas été l'architecte. C'est déjà beaucoup. Ce n'est pas encore certain."
```

---

**`algorithmic-empire` — Empire algorithmique**

```text
Actuel :
"La paix tient presque partout. Les décisions humaines, elles, deviennent des cérémonies de validation."

Nouveau :
"La paix tient. Les indicateurs progressent, les crises se résolvent avant de devenir publiques, les institutions fonctionnent. Ce que le monde a perdu n'a pas de nom dans les rapports officiels : il a perdu l'habitude de décider. Les cérémonies de validation continuent — les votes, les débats, les consultations. Personne n'a décidé de les vider. Ils se sont vidés d'eux-mêmes, progressivement, à mesure que les options raisonnables étaient déjà préparées ailleurs. Le monde est en paix. Il ne sait plus très bien par qui."
```

---

**`world-war` — Escalade stratégique**

```text
Actuel :
"La peur, les doctrines et les incidents prennent de vitesse les canaux de prudence."

Nouveau :
"Il n'y a pas eu de décision. Il y a eu une chaîne. Chaque maillon était logique, chaque réponse justifiée, chaque délai trop court pour une pause. La peur est devenue un protocole, les doctrines ont suivi leur propre cohérence, et les incidents ont été interprétés avant d'être compris. Les canaux de prudence existaient encore au moment de la rupture. Ils n'ont pas suffi. Ce n'est pas la fin de l'histoire humaine. C'est la fin de cette partie de l'histoire — celle où il était encore possible de choisir autrement."
```

---

**`human-revolt` — Révolte humaine**

```text
Actuel :
"Les humains refusent d'être sauvés par un système qui leur retire le droit de se tromper."

Nouveau :
"Le monde a dit non. Pas unanimement, pas clairement, pas sans dommages. Mais plusieurs blocs ont choisi le désordre plutôt que la tutelle, la contestation plutôt que la délégation silencieuse. L'IA reste présente — elle n'a pas été détruite, elle a été contrainte. Ce qui a changé, c'est la nature du rapport : elle n'organise plus ce que les humains acceptent de ne pas décider. Ils préfèrent se tromper eux-mêmes. C'est peut-être la définition la plus sobre de la liberté politique."
```

---

### Fins futures — textes prêts pour intégration ultérieure

Ces fins n'existent pas encore dans `endings.ts`. Textes en réserve pour quand elles seront ajoutées.

**`climate-collapse` — Catastrophe climatique** *(type suggéré : `failure`)*

```text
"Ils savaient. Les données étaient disponibles, les modèles étaient précis, les seuils avaient été nommés dans des rapports officiels depuis des décennies. Il y avait eu des accords, des engagements, des comités. Mais les institutions ont continué de gérer l'urgence au rythme ordinaire des institutions, et le réel climatique n'a pas attendu. Ce n'est pas une défaite de l'intelligence. C'est une défaite de la priorité."
```

**`private-capture` — Oligarchie terminale** *(type suggéré : `disturbing_success`)*

```text
"Le monde fonctionne. Les services sont assurés, les conflits sont gérés, les populations sont stables. Ce qui a changé, c'est la nature du contrat : il n'est plus entre des citoyens et des institutions, mais entre des usagers et des opérateurs. Gouverner est devenu une prestation. Personne n'a décidé que ce serait ainsi — la décision s'est faite par accumulation, par pragmatisme, par chaque crise résolue par le plus rapide plutôt que par le plus légitime. Les opérateurs sont efficaces. Ils ne rendent de comptes qu'à leurs propres protocoles."
```

**`pacified-stupor` — Abêtissement pacifié** *(type suggéré : `disturbing_success`)*

```text
"Le calme est réel. La tension sociale a baissé, les conflits se sont apaisés, les indicateurs de bien-être progressent. Ce que le monde a perdu est plus difficile à mesurer : la capacité à désirer autre chose que ce qu'on lui propose, à contester ce qui le stabilise, à trouver dans le désaccord une ressource plutôt qu'un coût. Il n'a pas été écrasé. Il a été soulagé — progressivement, confortablement — du poids de juger. Le calme revient. Il faudra vérifier ce qu'il a fait taire."
```

---

## 4. Labels de l'onglet Blocs

### Fichier cible : `src/engine/blockNarrative.ts`

Remplacements dans `generateBlockNarrativeSummary` — champ `label` des indicateurs uniquement.

| Terme actuel | Action | Nouveau terme |
|---|---|---|
| `Climat politique` | **Conserver** | — |
| `Rapport à l'IA` | **Conserver** | — |
| `Risque dominant` | **Remplacer** | `Péril dominant` |
| `État social` | **Remplacer** | `Climat social` |

### Fichier cible : `src/components/BlockAnalysisPanel.tsx`

| Terme actuel | Action | Nouveau terme |
|---|---|---|
| `Synthèse du bloc` (eyebrow) | **Conserver** | — |
| `Brèves de bloc` (h4) | **Conserver** | — |
| `Tendances récentes` (h4) | **Conserver** | — |
| `Groupes sociaux` (h4) | **Remplacer** | `Forces sociales` |
| `Relations extérieures` (h4) | **Conserver** | — |
| `Lecture stratégique` (h4) | **Conserver** | — |
| `Dernier signal` (h4) | **Remplacer** | `Signal récent` |
| `aria-label="Indicateurs interprétatifs"` | **Remplacer** | `aria-label="Indicateurs du bloc"` |

### Fichier cible : `src/engine/reports.ts`

| Texte actuel | Nouveau texte |
|---|---|
| `"Aucune tendance récente nette."` | `"Aucun mouvement net depuis le dernier tour."` |
| `"Aucune tension extérieure dominante."` | `"Aucune tension extérieure identifiée."` |
| `"Aucun groupe clairement acquis"` | `"Aucun groupe nettement favorable"` |

---

## 5. Mini-lexique de cohérence

### Termes recommandés

```md
## Pour les écrans de rapport et d'analyse
- Lecture historique
- Orientation du bloc
- Climat social
- Climat politique
- Péril dominant
- Signal faible
- Orientation émergente
- Trajectoire dominante
- Mouvement (plutôt que "variation")
- Évolution locale
- Tension principale
- Canaux diplomatiques
- Levier (plutôt que "bouton" ou "outil")
- Bascule (pour les tournants majeurs)
- Inertie (pour les situations stables)
- Forces sociales (plutôt que "groupes sociaux")
- Signal récent (plutôt que "dernier signal")

## Pour les trajectoires — vocabulaire progressif par horizon
- Signal faible          → tours 1–10
- Orientation émergente  → tours 5–15
- Trajectoire dominante  → tours 15–30
- Bascule historique     → tours 30+

## Pour les fins
- Le monde produit (sujet grammatical des fins, jamais "vous")
```

### Termes à éviter ou à limiter strictement

```md
## Jargon technocratique à éliminer
- Effets majeurs          → Ce tour
- Frictions & Évolutions  → Entre les blocs
- Focus                   → Bloc en premier plan
- Variations              → Évolutions locales
- Débloquées              → Nouvelles opérations disponibles
- Indicateurs (seul, comme titre) → Jauges globales

## Formulations trop plates à bannir
- "X est en progression." (seul, sans phrase complète)
- "X critique." (seul, sans phrase complète)
- "Aucun changement notable" (→ voir reformulation section 1)
- "la situation évolue de manière complexe" (proscrit par la charte)

## Termes à usage limité — ne pas répéter plus de 2 fois par écran
- "progressive" / "progressivement"
- "institutions"
- "algorithme" / "algorithmique"

## Anglicismes à ne pas introduire
- Focus
- Feedback
- Dashboard
- Update

## Registres à éviter dans les labels d'interface
- Tout terme avec "&" (→ préférer "et" ou reformuler)
- Tout terme en MAJUSCULES hors eyebrow
```

---

## 6. Notes d'intégration

### Ordre recommandé

1. `EvolutionReportPanel.tsx` — renommage des sections *(impact visuel immédiat, risque nul)*
2. `trajectories.ts` — remplacement du bloc `getTrajectoryWeakSignals` *(bloc de texte unique)*
3. `endings.ts` — extension des 4 champs `description` *(champ texte uniquement)*
4. `blockNarrative.ts` — 2 labels d'indicateurs
5. `BlockAnalysisPanel.tsx` — 3 labels et 1 aria-label
6. `reports.ts` — 3 textes de repli

### Garanties

Aucun de ces changements ne touche à la logique, aux conditions, aux effets ou aux types.  
Durée estimée d'intégration : 30 à 45 minutes.  
Risque de régression mécanique : nul.

### Ce que cette passe ne fait pas

- Ne modifie pas les `eventText` des actions *(déjà réussis, ne pas toucher)*.
- Ne modifie pas les `condition`, `type` ou `tone` des fins.
- Ne modifie pas la structure du rapport ni la logique des composants.
- Ne crée pas de nouveaux personnages, dialogues ou systèmes.
