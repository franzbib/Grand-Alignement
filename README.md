# Le Grand Alignement

Prototype web de simulation géopolitique satirique. Le joueur incarne une IA d'influence mondiale qui agit sur six blocs géopolitiques par interventions systémiques simples.

## Objectif v0.1

Fournir une première base jouable, modeste et visible rapidement : afficher l'état du monde, choisir une intervention IA, appliquer ses effets, écrire une conséquence dans le journal et sauvegarder la partie localement.

## Installation

```bash
npm install
```

Sous PowerShell, si `npm.ps1` est bloqué par la politique d'exécution :

```bash
npm.cmd install
```

## Lancement

```bash
npm run dev
```

Sous PowerShell :

```bash
npm.cmd run dev
```

## Build

```bash
npm run build
```

Sous PowerShell :

```bash
npm.cmd run build
```

## Déploiement de prévisualisation

Une prévisualisation Vercel peut être créée depuis la racine du projet avec :

```bash
npx vercel deploy --target preview
```

Le projet est une app Vite statique : build `npm run build`, sortie `dist`.

## Vérification de l'équilibrage

```bash
npm run simulate:strategies    # joueurs archétypaux directionnels (non-régression)
npm run simulate:trajectories  # stress test long des profils diversifiés
```

## Principes de v0.1

- Univers riche, prototype volontairement simple.
- Données locales TypeScript, sans backend, sans auth, sans IA générative temps réel.
- Boucle de tour : planifier des interventions sous contrainte d'influence, gérer la signature laissée au monde (le soupçon IA a des paliers à conséquences), lire le rapport d'évolution, sauvegarder la partie.
- Sauvegarde locale via `localStorage`.
- Cinq fins : Confédération fragile, Empire algorithmique, Escalade stratégique, Révolte humaine, Exposition.

## Périmètre actuel

- Pas de Supabase.
- Pas d'authentification.
- Pas d'IA générative en temps réel.
- Pas d'architecture serveur.
- Pas de dépendances de gameplay lourdes.
