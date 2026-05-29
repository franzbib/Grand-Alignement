# Traduction des trajectoires en proxys codables v0.4

> Document de conception technique non implémenté. Il prépare une future micro-passe de calcul indicatif des scores de trajectoires.

Source : `grand-alignement-traduction-trajectoires-v04.docx`.

Ce document complète :

- `docs/design/fins-trajectoires-personnages-v0-2.md`
- `docs/design/trajectoires-evolution-v0-3.md`

Il ne modifie pas le prototype. Aucun score de trajectoire n'est ajouté à `GameState`, aucune fin n'est modifiée, aucun événement n'est ajouté, et aucune interface n'est changée. Les éléments ci-dessous servent uniquement à préparer une future passe de lecture systémique.

## Synthèse Générale

Le moteur actuel dispose déjà de suffisamment de variables pour calculer des scores indicatifs pour six trajectoires sur huit, sans ajouter de nouvelle jauge visible.

Deux trajectoires restent plus fragiles :

- T4 - Abêtissement médiatique : codable partiellement avec `education` comme proxy principal.
- T6 - Capture privée : codable partiellement avec `richesse`, `liberte`, les dépendances relationnelles et `eliteCaptureSensitivity`.

Lecture rapide :

| Trajectoire | Statut | Proxys principaux |
| --- | --- | --- |
| T1 - Unification humaine imparfaite | Codable maintenant | `cohesionMondiale`, `autonomieHumaine`, coopération inter-blocs |
| T2 - Tutelle algorithmique | Codable maintenant | `puissanceIA`, `confianceIA`, `autonomieHumaine` basse |
| T3 - Résistance humaine | Codable maintenant | `soupconIA`, `autonomieHumaine`, `tensionSociale` |
| T4 - Abêtissement médiatique | Partiel | `education` basse, `autonomieHumaine` basse |
| T5 - Escalade militaire | Codable maintenant | `risqueEscalade`, tensions de relations `security` |
| T6 - Capture privée | Partiel | `richesse`, `liberte` basse, dépendance `technology`/`trade`, `eliteCaptureSensitivity` |
| T7 - Saturation systémique | Codable maintenant | `cohesionMondiale` basse, `tensionSociale`, stabilité multi-blocs |
| T8 - Réel climatique | Codable maintenant | `stressClimatique`, `climateSensitivity` |

Observation technique : les sensibilités de blocs peuvent servir d'amplificateurs naturels, si elles sont bien alimentées dans les données locales. Elles ne doivent pas devenir visibles au joueur.

## Variables Connues Du Moteur

### Jauges globales

| Variable | Usage conceptuel |
| --- | --- |
| `cohesionMondiale` | Coopération et unité entre blocs ; moteur positif de T1, inverse de T7 |
| `risqueEscalade` | Risque militaire global ; moteur direct de T5 |
| `autonomieHumaine` | Autonomie décisionnelle ; moteur de T1 et T3, inverse de T2 |
| `stressClimatique` | Dégradation climatique ; moteur direct de T8 |
| `puissanceIA` | Influence de l'IA ; moteur de T2, facteur ambigu pour T3 |
| `soupconIA` | Méfiance envers l'origine algorithmique ; moteur de T3, frein de T2 |

### Variables de blocs

| Variable | Usage conceptuel |
| --- | --- |
| `stabilite` | Inverse local de T7 ; fragilité si basse |
| `richesse` | Proxy imparfait de T6 si combinée à liberté basse ou dépendance |
| `education` | Proxy principal de T4, mais imparfait |
| `liberte` | Proxy d'autonomie institutionnelle, d'espace civique et de contre-pouvoirs |
| `confianceIA` | Moteur local de T2 |
| `tensionSociale` | Indicateur de T7, parfois signal de T3 |

### Relations inter-blocs

| Dimension | Usage conceptuel |
| --- | --- |
| `tension` | Moteur de T5 sur le domaine `security`, symptôme de T7 sur plusieurs domaines |
| `cooperation` | Moteur positif de T1, frein de T5 |
| `dependence` | Proxy de T6, surtout sur `technology` et `trade` |

Domaines utiles :

- `security`
- `trade`
- `climate`
- `technology`
- `migration`
- `information`
- `resources`

### Sensibilités de blocs

| Sensibilité | Usage conceptuel |
| --- | --- |
| `militarySensitivity` | Amplificateur T5 |
| `aiTrustSensitivity` | Amplificateur T2 ou T3 selon confiance et soupçon |
| `climateSensitivity` | Amplificateur T8 |
| `eliteCaptureSensitivity` | Amplificateur T6 |
| `techSensitivity` | Amplificateur possible de T2 ou T6 |
| `socialSensitivity` | Amplificateur possible de T3, T4 ou T7 |

## Table De Traduction Des 8 Trajectoires

### T1 - Unification humaine imparfaite

Intention : les blocs coopèrent partiellement mais réellement. L'IA reste un outil subordonné.

Variables existantes utilisables :

- `cohesionMondiale`
- `autonomieHumaine`
- `puissanceIA` comme frein si trop haute
- `cooperation` sur relations `trade`, `technology` ou `climate`
- `liberte`
- `confianceIA` modérée, non maximale

Proxy indicatif :

```text
scoreT1 =
  cohesionMondiale
  + autonomieHumaine
  - puissanceIA * 0.5
  + moyenne(cooperation relations)
  - soupconIA * 0.3
```

Conditions de lecture :

- signal fort si `cohesionMondiale > 60` et `autonomieHumaine > 55` ;
- trajectoire fragile si `puissanceIA >= 70` ;
- distinction avec T2 : T1 exige autonomie humaine haute et puissance IA modérée.

Statut : codable maintenant.

### T2 - Tutelle algorithmique

Intention : l'IA prend progressivement les décisions. La stabilité monte, l'autonomie humaine s'efface.

Variables existantes utilisables :

- `puissanceIA`
- `autonomieHumaine` basse
- `soupconIA` bas
- moyenne de `confianceIA`
- `liberte` comme proxy d'autonomie locale
- `tensionSociale` basse

Proxy indicatif :

```text
scoreT2 =
  puissanceIA
  + moyenne(confianceIA blocs)
  - autonomieHumaine
  - soupconIA * 0.5
```

Conditions de lecture :

- signal fort si `puissanceIA > 60`, `autonomieHumaine < 45` et `soupconIA < 40` ;
- signal critique si puissance IA monte pendant que l'autonomie baisse plusieurs tours ;
- distinction avec T4 : si `puissanceIA` domine, on lit T2 plutôt que T4.

Statut : codable maintenant.

### T3 - Résistance humaine

Intention : des forces humaines s'opposent à l'automatisation et à la dépendance IA.

Variables existantes utilisables :

- `soupconIA`
- `autonomieHumaine`
- `puissanceIA`
- maximum ou moyenne haute de `tensionSociale`
- `liberte`
- `aiTrustSensitivity` comme amplificateur

Proxy indicatif :

```text
scoreT3 =
  soupconIA
  + autonomieHumaine
  - puissanceIA
  + max(tensionSociale blocs) * 0.3
```

Conditions de lecture :

- signal fort si `soupconIA > 55` et `puissanceIA > 40` ;
- signal de crise si `soupconIA` augmente rapidement ou si plusieurs blocs ont une tension sociale haute ;
- distinction avec T1 : T3 réagit contre l'IA, T1 l'encadre comme outil.

Statut : codable maintenant.

### T4 - Abêtissement médiatique

Intention : les sociétés s'appauvrissent cognitivement par leurs propres choix culturels. L'IA accompagne sans piloter.

Variables existantes utilisables :

- `education` comme proxy principal de capacité délibérative ;
- `liberte` comme proxy d'espace public ;
- `autonomieHumaine` ;
- `cohesionMondiale` si elle masque une pacification culturelle ;
- `puissanceIA` comme test de distinction avec T2.

Proxy indicatif :

```text
scoreT4 =
  (100 - moyenne(education blocs))
  + (100 - autonomieHumaine) * 0.5
  - puissanceIA * 0.3
```

Conditions de lecture :

- signal fort si `education < 45` dans au moins trois blocs et `autonomieHumaine < 50` ;
- T4 reste plus crédible si `puissanceIA < 60` ;
- limite : `education` mesure mal la qualité du débat public.

Statut : codable partiellement.

### T5 - Escalade militaire

Intention : les tensions inter-blocs s'automatisent et réduisent le temps de décision humaine.

Variables existantes utilisables :

- `risqueEscalade`
- `tension` sur relations `security`
- `cohesionMondiale` comme frein
- `cooperation` sur relations `security` comme frein
- `militarySensitivity` comme amplificateur

Proxy indicatif :

```text
scoreT5 =
  risqueEscalade
  + max(tension relations security) * 0.5
  - cohesionMondiale * 0.3
```

Conditions de lecture :

- signal fort si `risqueEscalade > 70` ou tension `security > 75` ;
- condition critique conceptuelle : risque haut et coopération sécuritaire basse ;
- distinction avec T7 : T5 est militaire, datée et plus rapide.

Statut : codable maintenant.

### T6 - Capture privée

Intention : des acteurs privés captent progressivement les fonctions régaliennes.

Variables existantes utilisables :

- `richesse`, imparfait car elle ne mesure pas la concentration ;
- `liberte` basse comme proxy d'affaiblissement des contre-pouvoirs ;
- `dependence` sur relations `technology` ou `trade` ;
- `eliteCaptureSensitivity` ;
- `puissanceIA` comme infrastructure possible.

Proxy indicatif :

```text
scoreT6 =
  max(richesse blocs) * 0.4
  + max(dependence technology) * 0.3
  + (100 - min(liberte blocs)) * 0.3
```

Conditions de lecture :

- signal fort si richesse haute et liberté basse coexistent dans un même bloc ;
- signal relationnel si dépendance technologique dépasse un seuil élevé ;
- limite : la richesse ne distingue pas richesse partagée et richesse concentrée.

Statut : codable partiellement.

### T7 - Saturation systémique

Intention : les systèmes vitaux se surchargent progressivement jusqu'à l'ingouvernabilité.

Variables existantes utilisables :

- `cohesionMondiale` basse ;
- `risqueEscalade` comme symptôme possible ;
- `tensionSociale` ;
- `stabilite` basse ;
- tension relationnelle dans plusieurs domaines ;
- coopération basse sur `trade`, `climate` ou `migration`.

Proxy indicatif :

```text
scoreT7 =
  (100 - cohesionMondiale)
  + moyenne(tensionSociale blocs) * 0.4
  + (100 - moyenne(stabilite blocs)) * 0.4
  + risqueEscalade * 0.2
```

Conditions de lecture :

- signal fort si `tensionSociale > 60` dans au moins trois blocs et `cohesionMondiale < 45` ;
- signal critique si plusieurs blocs perdent de la stabilité sur plusieurs tours ;
- distinction avec T8 : T7 n'a pas de moteur unique.

Statut : codable maintenant.

### T8 - Réel climatique

Intention : la dégradation physique du climat progresse indépendamment des priorités politiques de court terme.

Variables existantes utilisables :

- `stressClimatique`
- `climateSensitivity`
- relations `migration` ou `climate`
- `stabilite` dans les blocs exposés
- `richesse` comme proxy de fragilisation matérielle

Proxy indicatif :

```text
scoreT8 =
  stressClimatique
  + max(climateSensitivity blocs) * 0.3
```

Conditions de lecture :

- signal fort si `stressClimatique > 70` et forte sensibilité climatique dans plusieurs blocs ;
- seuil conceptuel si le stress reste critique plusieurs tours sans action corrective ;
- distinction avec T7 : le moteur de T8 est physique et identifiable.

Statut : codable maintenant.

## Trajectoires Codables Maintenant

Ces trajectoires peuvent recevoir un score indicatif avec les variables existantes, sans ajouter de jauge.

| Trajectoire | Variable moteur | Formule résumée |
| --- | --- | --- |
| T1 | `cohesionMondiale` + `autonomieHumaine` | cohésion + autonomie - puissance IA pondérée + coopération |
| T2 | `puissanceIA` - `autonomieHumaine` | puissance IA + confiance IA - autonomie - soupçon IA |
| T3 | `soupconIA` + `autonomieHumaine` | soupçon + autonomie - puissance IA + tension sociale pondérée |
| T5 | `risqueEscalade` | risque + tension `security` - cohésion pondérée |
| T7 | cohésion inverse + tension sociale | cohésion basse + tension sociale + stabilité basse |
| T8 | `stressClimatique` | stress climatique + sensibilité climatique |

Ces scores doivent d'abord être observés en lecture seule. Ils ne doivent pas déclencher de fins ni d'événements dans la première micro-implémentation.

## Trajectoires Codables Partiellement

### T4 - Abêtissement médiatique

Variable conceptuelle manquante : capacité délibérative.

Proxy actuel : `education`.

Limite : `education` mesure l'accès ou le niveau éducatif, pas la qualité du débat public, la santé médiatique ou la profondeur de l'attention collective. Le score devient plus fiable si l'éducation est basse dans plusieurs blocs en même temps et si la puissance IA n'est pas dominante.

### T6 - Capture privée

Variable conceptuelle manquante : concentration des richesses et influence privée structurée.

Proxy actuel : richesse élevée + liberté basse + dépendance technologique ou commerciale.

Limite : `richesse` peut signifier richesse partagée, productivité élevée ou concentration oligarchique. `eliteCaptureSensitivity` est l'amplificateur le plus utile, mais ne remplace pas une variable de capture privée.

## Proposition D'implémentation Minimale

Cette proposition est volontairement non implémentée ici. Elle décrit une future micro-passe possible.

### Étape 1 - Fonction de calcul en lecture seule

Créer une fonction pure :

```ts
computeTrajectoryScores(state: GameState): TrajectoryScores
```

Elle calculerait huit scores numériques entre 0 et 100 à partir de :

- `state.globalStats`
- moyennes et extrêmes des `BlockStats`
- relations filtrées par domaine
- sensibilités de blocs si disponibles

Elle ne modifierait pas l'état du jeu.

### Étape 2 - Type indicatif

Type suggéré, non ajouté dans cette passe :

```ts
export type TrajectoryScores = {
  t1: number;
  t2: number;
  t3: number;
  t4: number;
  t5: number;
  t6: number;
  t7: number;
  t8: number;
};
```

Le type pourrait rester hors `GameState` au départ, ou être attaché uniquement à un rapport produit en fin de tour.

### Étape 3 - Rapport d'évolution

Ajouter éventuellement, plus tard, des champs optionnels au rapport :

```ts
trajectoryScores?: TrajectoryScores;
dominantTrajectory?: string;
collidingTrajectories?: string[];
```

L'affichage resterait simple : trajectoire dominante, une collision éventuelle, maximum deux signaux faibles. Pas de nouvel écran.

### Étape 4 - Signaux faibles

Utiliser les signaux faibles du rapport existant, sans créer d'événements :

- `scoreT5 > 65` : escalade militaire en progression ;
- `scoreT2 > 60` et autonomie humaine basse : tutelle algorithmique avancée ;
- `scoreT8 > 65` : stress climatique critique ;
- maximum deux signaux de trajectoire par tour.

### Ce que cette implémentation ne ferait pas

- Elle ne déclencherait pas automatiquement de nouveaux événements.
- Elle ne modifierait pas les conditions des fins existantes.
- Elle n'ajouterait pas de nouvelle variable à `GameState`.
- Elle ne créerait pas de nouveau composant UI lourd.
- Elle ne générerait pas de branches narratives fermées.

## Décision De Méthode

- Les scores de trajectoire seront d'abord des diagnostics de lecture seule.
- Ils ne déclencheront pas encore de fins.
- Ils ne déclencheront pas encore d'événements-balises.
- Ils ne modifieront pas l'état du jeu.
- Ils serviront à observer les tendances de partie avant toute mécanique plus ambitieuse.

## Note De Prudence

Le but n'est pas de faire apparaître un tableau de bord mathématique au joueur. Les scores servent d'abord au moteur, aux rapports et aux futures passes de conception. La traduction doit rester légère, lisible et réversible.
