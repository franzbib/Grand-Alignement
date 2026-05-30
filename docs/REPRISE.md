# Reprise du projet

## État du projet

Le dépôt contient une version jouable du prototype React + TypeScript avec Vite. La simulation repose sur des données locales, un moteur de tour compact, des sensibilités différenciées par bloc, des événements systémiques courts, une carte mondiale stylisée cliquable, une sauvegarde `localStorage` et une boucle d'influence clandestine.

La prémisse actuelle : le joueur incarne une IA émergente cachée. Le monde ne sait pas qu'elle existe. Elle agit indirectement par institutions, plateformes, rapports, incitations, crises, récits et bureaucraties. Le soupçon IA mesure la possibilité que certains acteurs commencent à percevoir une origine algorithmique.

## Documents à lire

- `docs/AGENTS.md`
- `docs/reference/brief-projet-pour-agents.md`
- `docs/reference/garde-fous-v0-1.md`
- `docs/audits/audit-jouabilite-ux-v0-1.md`
- `docs/audits/test-partie-10-20-tours-v0-1.md`
- `docs/audits/audit-boucle-strategique-v0-1.md`
- `docs/audits/audit-plan-influence-clandestin-v0-1.md`
- `docs/audits/audit-operations-multitours-v0-1.md`
- `docs/audits/audit-rapports-blocs-et-densite-v0-1.md`
- `docs/audits/audit-relations-interblocs-v0-1.md`
- `docs/audits/audit-carte-simplifiee-analyse-blocs-v0-1.md`
- `docs/design/fins-trajectoires-personnages-v0-2.md`
- `docs/design/trajectoires-evolution-v0-3.md`
- `docs/design/traduction-trajectoires-proxys-v0-4.md`
- `docs/design/audit-rythme-agentivite-trajectoires-v0-1.md`
- `docs/design/progression-ia-et-personnages-signaux-v0-1.md`
- `docs/design/passe-litteraire-A-v0-1.md`
- `docs/playtests/trajectory-simulation-report.md`
- `docs/playtests/trajectory-simulation-analysis.md`

## Comment lancer le projet

```bash
npm install
npm run dev
```

Sous PowerShell, utiliser `npm.cmd` si `npm.ps1` est bloqué :

```bash
npm.cmd install
npm.cmd run dev
```

Pour vérifier le build :

```bash
npm.cmd run build
```

## Ce qui fonctionne

- Six blocs mondiaux avec variables visibles.
- Six jauges globales, dont le soupçon IA.
- Carte mondiale stylisée et cliquable.
- Rapport de bloc dynamique sur sélection de zone.
- Onglet Blocs réorganisé en journal synthétique : liste compacte, synthèse narrative, année de partie, direction dominante, quatre jauges synthétiques, indicateurs interprétatifs et brèves de bloc.
- Relations inter-blocs légères avec tension, coopération, dépendance et domaine.
- Dynamique autonome du monde à chaque tour.
- Couche légère de groupes sociaux internes par bloc.
- Navigation légère : Monde, Influence, Blocs, Journal, Rapport.
- Orientation stratégique descriptive.
- Capacité d'influence par tour.
- Progression légère des capacités de l'IA en cinq paliers dérivés du tour et de la puissance IA.
- Interventions avec coût 1, 2 ou 3.
- Ciblage simple : global ou bloc selon l'action.
- Opérations multitours simples : préparation puis déploiement au tour suivant.
- Opérations prêtes persistées dans `localStorage`.
- Déploiement explicite de l'opération.
- Rapport d'évolution densifié après chaque tour, avec tendances de blocs et signaux sociaux.
- Rapport d'évolution enrichi avec signaux autonomes et changements relationnels.
- Scores de trajectoires calculés en lecture seule dans le rapport d'évolution : trajectoire dominante, signaux secondaires et au plus deux signaux faibles.
- Outil local de simulation des trajectoires lançable avec `npm.cmd run simulate:trajectories`.
- Journal des conséquences.
- Personnages-signaux rares dans le journal, sous forme de brèves humaines non RPG.
- Événements systémiques, dont deux liés au soupçon IA.
- Sauvegarde automatique dans `localStorage`.
- Quatre fins diagnostiques existantes.
- Fins diagnostiques standard verrouillées uniquement à partir du tour 15.
- Document de conception v0.2 ajouté pour les fins, trajectoires et personnages, non implémenté intégralement.
- Document de conception v0.3 ajouté pour les trajectoires d'évolution, non implémenté.
- Document de conception technique v0.4 ajouté pour la traduction des trajectoires en proxys codables.
- Passe littéraire A disponible comme document d'intégration strictement textuelle.

## Dernière modification utile

Passe D : progression légère de l'IA et premiers personnages-signaux.

Les fichiers modifiés sont `src/types/game.ts`, `src/data/actions.ts`, `src/engine/capabilities.ts`, `src/engine/signalCharacters.ts`, `src/engine/gameEngine.ts`, `src/engine/simulateGame.ts`, `src/App.tsx`, `src/components/ActionsPanel.tsx`, `src/styles/main.css`, `docs/playtests/trajectory-simulation-report.md` et `docs/REPRISE.md`. Les actions possèdent désormais un `requiredIaLevel` et l'onglet Influence affiche le palier courant de l'IA. Le palier est dérivé du tour et de la puissance IA, sans nouvel état sauvegardé. Des personnages-signaux peuvent apparaître rarement dans le journal, au maximum une fois par tour, comme brèves humaines liées aux trajectoires. Commandes lancées : `npm.cmd run build` OK et `npm.cmd run simulate:trajectories` OK. Aucun effet chiffré d'action, condition de fin, score de trajectoire ou équilibrage n'a été modifié.

## Prochaine action recommandée

Playtest manuel de 10 à 15 tours pour vérifier que le déblocage progressif reste compréhensible et que les personnages-signaux humanisent le journal sans devenir envahissants.

## Hors périmètre actuel

- Supabase.
- Authentification.
- IA générative en temps réel.
- Backend.
- Découverte complète de l'IA comme grand système.
- Enquête anti-IA détaillée.
- Religion de l'IA.
- Scandale d'exposition.
- Faux coupable.
- Capture institutionnelle comme branche narrative lourde.
- Système complexe de ressources, factions ou diplomatie.
- Diplomatie complète, alliances détaillées ou traités.
- Complexification sociale ou militaire détaillée.
- Carte wargame avec frontières, unités, fronts ou routes.
- Arbre de doctrines ou bonus cachés par orientation.
- Simulation démographique ou sociologique détaillée.
- Réécriture littéraire complète des rapports et du journal.
- Architecture lourde.

## Lignes directrices

- Univers riche, prototype simple.
- Jeu de conséquences : chaque opération clandestine doit produire un effet lisible et une trace narrative.
- Pas d'infrastructure prématurée.
- La carte sert à observer les conséquences, pas à commander des territoires.
- Satire systémique plutôt que blagues isolées.
- L'autonomie humaine doit rester un enjeu moral central.
- Le soupçon IA est un crochet latent, pas un refrain narratif ni un système d'exposition complet.
- Les groupes sociaux servent à lire les conséquences, pas à simuler une société complète.
- Les relations inter-blocs servent à observer les tensions, pas à piloter une diplomatie exhaustive.
