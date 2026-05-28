# Reprise du projet

## État du projet

Le dépôt contient une première version jouable du prototype React + TypeScript avec Vite. La simulation repose sur des données locales, un moteur de tour compact, des sensibilités différenciées par bloc et une sauvegarde `localStorage`.

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
- Modulation légère des effets par bloc via des sensibilités cachées.
- Journal des conséquences.
- Sauvegarde automatique dans `localStorage`.
- Réinitialisation de la partie.
- Deux fins provisoires : Empire algorithmique et Guerre mondiale.

## Dernière modification utile

Ajout de profils de sensibilités pour les six blocs. Les actions gardent un effet principal commun, puis le moteur ajoute de petites variations selon le profil du bloc : technologie, tensions sociales, climat, militarisation, capture par les élites et confiance envers l'IA.

Ces sensibilités restent cachées ou semi-cachées : le joueur les perçoit par les variations de jauges et par quelques mentions du journal, mais l'interface ne devient pas un tableau de coefficients.

## Ce qui reste à faire

- Ajouter des événements conditionnels liés aux seuils de jauges.
- Équilibrer les valeurs après quelques sessions de test.
- Améliorer la lisibilité narrative des fins.
- Ajouter quelques tests unitaires du moteur de jeu.

## Prochaine action recommandée

Enrichir les événements et les fins pour mieux faire apparaître la philosophie du projet.

## Hors périmètre actuel

- Supabase.
- Authentification.
- IA générative en temps réel.
- Backend.
- Système complexe de ressources, factions ou diplomatie.
- Complexification sociale ou militaire détaillée.
- Architecture lourde.

## Lignes directrices

- Univers riche, prototype simple.
- Jeu de conséquences : chaque action doit produire un effet lisible et une trace narrative.
- Pas d'infrastructure prématurée.
- Carte mondiale stylisée prévue plus tard, pas dans la v0.1.
- Satire systémique plutôt que blagues isolées.
- L'autonomie humaine doit rester un enjeu moral central.
- Les profils de blocs doivent rester simples : ils servent à donner du relief, pas à simuler le monde de façon réaliste.
