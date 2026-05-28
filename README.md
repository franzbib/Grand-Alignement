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

## Principes de v0.1

- Univers riche, prototype volontairement simple.
- Données locales TypeScript, sans backend, sans auth, sans IA générative temps réel.
- Boucle de tour minimale : choisir une action, appliquer ses effets, lire une conséquence, sauvegarder la partie.
- Sauvegarde locale via `localStorage`.
- Deux fins provisoires : Empire algorithmique et Guerre mondiale.

## Périmètre actuel

- Pas de Supabase.
- Pas d'authentification.
- Pas d'IA générative en temps réel.
- Pas d'architecture serveur.
- Pas de dépendances de gameplay lourdes.
