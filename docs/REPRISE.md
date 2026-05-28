# Reprise du projet

## État du projet

Le dépôt contient une version jouable du prototype React + TypeScript avec Vite. La simulation repose sur des données locales, un moteur de tour compact, des sensibilités différenciées par bloc, des événements systémiques courts, une carte mondiale stylisée, une sauvegarde `localStorage` et une boucle stratégique explicite.

Une première passe d'audit de jouabilité et d'UX v0.1 est disponible dans `docs/audits/audit-jouabilite-ux-v0-1.md`. Un test de trajectoires 10-20 tours est disponible dans `docs/audits/test-partie-10-20-tours-v0-1.md`. La refonte légère de boucle stratégique est documentée dans `docs/audits/audit-boucle-strategique-v0-1.md`.

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
- Navigation légère par vues : Monde, Stratégie, Blocs, Journal.
- Sélection de 1 à 3 interventions par tour.
- Validation explicite du tour avant application des conséquences.
- Posture stratégique descriptive, sans bonus caché.
- Modulation légère des effets par bloc via des sensibilités cachées.
- Déclenchement d'un événement conditionnel par tour quand les seuils s'y prêtent.
- Journal des conséquences formulé autour d'un paquet stratégique.
- Sauvegarde automatique dans `localStorage`.
- Réinitialisation de la partie.
- Quatre fins diagnostiques : Confédération fragile, Empire algorithmique, Escalade stratégique, Révolte humaine.

## Dernière modification utile

Introduction d'une boucle de planification stratégique : le joueur observe le monde, choisit une posture descriptive, sélectionne 1 à 3 interventions, puis valide explicitement le tour. Les simulations internes utilisent désormais des paquets d'interventions par tour.

Preview Vercel précédente : `https://grand-alignement-bd34k6p10-franzbib-6925s-projects.vercel.app`

Alias public vérifié précédemment : `https://grand-alignement.vercel.app`

## Ce qui reste à faire

- Jouer manuellement une partie complète avec la nouvelle boucle stratégique.
- Vérifier si les vues réduisent vraiment la surcharge d'information.
- Ajuster le journal si le résumé de paquet et l'événement systémique se confondent.
- Équilibrer les valeurs après quelques sessions de test.
- Ajouter quelques tests unitaires du moteur de jeu.

## Prochaine action recommandée

Faire un playtest manuel complet de la nouvelle boucle stratégique, du premier tour jusqu'à un diagnostic ou à une trajectoire clairement lisible.

## Hors périmètre actuel

- Supabase.
- Authentification.
- IA générative en temps réel.
- Backend.
- Système complexe de ressources, factions ou diplomatie.
- Complexification sociale ou militaire détaillée.
- Événements longs ou rares nécessitant une encyclopédie interne.
- Carte wargame avec frontières, unités, fronts ou routes.
- Arbre de doctrines ou bonus cachés par posture.
- Architecture lourde.

## Lignes directrices

- Univers riche, prototype simple.
- Jeu de conséquences : chaque paquet stratégique doit produire un effet lisible et une trace narrative.
- Pas d'infrastructure prématurée.
- La carte mondiale stylisée sert à observer les conséquences, pas à commander des territoires.
- Satire systémique plutôt que blagues isolées.
- L'autonomie humaine doit rester un enjeu moral central.
- Les profils de blocs doivent rester simples : ils servent à donner du relief, pas à simuler le monde de façon réaliste.
