# Reprise du projet

## État du projet

Le dépôt contient une première version jouable du prototype React + TypeScript avec Vite. La simulation repose sur des données locales, un moteur de tour compact, des sensibilités différenciées par bloc, des événements systémiques courts et une sauvegarde `localStorage`.

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
- Déclenchement d'un événement conditionnel par tour quand les seuils s'y prêtent.
- Journal des conséquences.
- Sauvegarde automatique dans `localStorage`.
- Réinitialisation de la partie.
- Quatre fins diagnostiques : Confédération fragile, Empire algorithmique, Escalade stratégique, Révolte humaine.

## Dernière modification utile

Ajout d'événements systémiques conditionnels et de fins enrichies. Le journal peut désormais ajouter une conséquence courte liée aux seuils globaux, aux moyennes des blocs ou à l'action jouée.

Les événements restent courts et mécaniques : ils donnent un signal politique ou moral sans transformer le journal en roman.

## Ce qui reste à faire

- Équilibrer les valeurs après quelques sessions de test.
- Ajouter davantage de variations de journal après playtest.
- Ajouter quelques tests unitaires du moteur de jeu.

## Prochaine action recommandée

Préparer la carte mondiale stylisée comme surface d'observation, sans en faire un wargame.

## Hors périmètre actuel

- Supabase.
- Authentification.
- IA générative en temps réel.
- Backend.
- Système complexe de ressources, factions ou diplomatie.
- Complexification sociale ou militaire détaillée.
- Événements longs ou rares nécessitant une encyclopédie interne.
- Architecture lourde.

## Lignes directrices

- Univers riche, prototype simple.
- Jeu de conséquences : chaque action doit produire un effet lisible et une trace narrative.
- Pas d'infrastructure prématurée.
- Carte mondiale stylisée prévue plus tard, pas dans la v0.1.
- Satire systémique plutôt que blagues isolées.
- L'autonomie humaine doit rester un enjeu moral central.
- Les profils de blocs doivent rester simples : ils servent à donner du relief, pas à simuler le monde de façon réaliste.
