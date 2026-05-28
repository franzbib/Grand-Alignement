# Reprise du projet

## État du projet

Le dépôt contient une première version jouable du prototype React + TypeScript avec Vite. La simulation repose sur des données locales, un moteur de tour compact et une sauvegarde `localStorage`.

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

- Affichage des cinq jauges globales.
- Affichage des six blocs mondiaux et de leurs six variables visibles.
- Liste de douze interventions IA.
- Application des effets à chaque tour.
- Journal des conséquences.
- Sauvegarde automatique dans `localStorage`.
- Réinitialisation de la partie.
- Deux fins provisoires : Empire algorithmique et Guerre mondiale.

## Dernière modification utile

Stabilisation de la base v0.1 : documentation de reprise, rappel du périmètre, garde-fous `.gitignore` et liste des idées mises de côté.

## Ce qui reste à faire

- Différencier les effets par bloc au lieu d'appliquer chaque action uniformément.
- Ajouter des événements conditionnels liés aux seuils de jauges.
- Équilibrer les valeurs après quelques sessions de test.
- Améliorer la lisibilité narrative des fins.
- Ajouter quelques tests unitaires du moteur de jeu.

## Prochaine action recommandée

Créer des effets ciblés par bloc pour que chaque intervention produise des conséquences géopolitiques plus contrastées.

## Hors périmètre actuel

- Supabase.
- Authentification.
- IA générative en temps réel.
- Backend.
- Système complexe de ressources, factions ou diplomatie.
- Architecture lourde.

## Lignes directrices

- Univers riche, prototype simple.
- Jeu de conséquences : chaque action doit produire un effet lisible et une trace narrative.
- Pas d'infrastructure prématurée.
- Carte mondiale stylisée prévue plus tard, pas dans la v0.1.
- Satire systémique plutôt que blagues isolées.
- L'autonomie humaine doit rester un enjeu moral central.
