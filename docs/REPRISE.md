# Reprise du projet

## État du projet

Le dépôt contient une première version jouable du prototype React + TypeScript avec Vite. La simulation repose sur des données locales, un moteur de tour compact, des sensibilités différenciées par bloc, des événements systémiques courts, une carte mondiale stylisée et une sauvegarde `localStorage`.

Une première passe d'audit de jouabilité et d'UX v0.1 est disponible dans `docs/audits/audit-jouabilite-ux-v0-1.md`. Un test de trajectoires 10-20 tours est disponible dans `docs/audits/test-partie-10-20-tours-v0-1.md`.

Les futurs agents doivent aussi lire `docs/AGENTS.md`, `docs/reference/brief-projet-pour-agents.md` et `docs/reference/garde-fous-v0-1.md` avant toute intervention structurante.

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

Préparation d'un déploiement Vercel de démo. Le build local et le build Vercel sont verts.

Preview Vercel : `https://grand-alignement-bd34k6p10-franzbib-6925s-projects.vercel.app`

Alias public vérifié : `https://grand-alignement.vercel.app`

## Ce qui reste à faire

- Équilibrer les valeurs après quelques sessions de test.
- Jouer manuellement une partie complète.
- Ajouter davantage de variations de journal après playtest.
- Ajouter quelques tests unitaires du moteur de jeu.

## Prochaine action recommandée

Jouer manuellement une partie complète sur la démo Vercel et comparer le ressenti aux trajectoires simulées.

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
