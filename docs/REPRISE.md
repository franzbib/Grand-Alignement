# Reprise du projet

## État du projet

Le dépôt contient une première version jouable du prototype React + TypeScript avec Vite. La simulation repose sur des données locales, un moteur de tour compact, des sensibilités différenciées par bloc, des événements systémiques courts, une carte mondiale stylisée et une sauvegarde `localStorage`.

Une première passe d'audit de jouabilité et d'UX v0.1 est disponible dans `docs/audits/audit-jouabilite-ux-v0-1.md`.

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
- Carte mondiale stylisée des six blocs comme surface d'observation.
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

Première passe d'audit jouabilité / UX. Les corrections restent modestes : libellés plus clairs, aide courte sur les actions et ajout de l'état "Résistance" sur la carte.

L'audit confirme que la carte doit rester une surface d'observation : elle aide à lire l'état du monde, mais ne porte pas de territoire détaillé, d'unités, de frontières fines ou de mécaniques de conquête.

## Ce qui reste à faire

- Équilibrer les valeurs après quelques sessions de test.
- Faire une première passe d'audit de jouabilité et d'UX.
- Ajouter davantage de variations de journal après playtest.
- Ajouter quelques tests unitaires du moteur de jeu.

## Prochaine action recommandée

Tester une partie complète sur 10 à 20 tours, puis ajuster les seuils des événements et des fins.

## Hors périmètre actuel

- Supabase.
- Authentification.
- IA générative en temps réel.
- Backend.
- Système complexe de ressources, factions ou diplomatie.
- Complexification sociale ou militaire détaillée.
- Événements longs ou rares nécessitant une encyclopédie interne.
- Carte wargame avec frontières, unités, fronts ou routes.
- Architecture lourde.

## Lignes directrices

- Univers riche, prototype simple.
- Jeu de conséquences : chaque action doit produire un effet lisible et une trace narrative.
- Pas d'infrastructure prématurée.
- La carte mondiale stylisée sert à observer les conséquences, pas à commander des territoires.
- Satire systémique plutôt que blagues isolées.
- L'autonomie humaine doit rester un enjeu moral central.
- Les profils de blocs doivent rester simples : ils servent à donner du relief, pas à simuler le monde de façon réaliste.
