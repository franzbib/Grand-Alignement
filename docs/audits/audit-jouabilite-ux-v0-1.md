# Audit jouabilité / UX v0.1

## Verdict général

Le prototype est jouable, compréhensible et fidèle à son intention principale : un jeu de conséquences où une IA agit sur des équilibres mondiaux simples. La base reste évolutive sans devenir un wargame ni un tableur géopolitique.

La principale fragilité actuelle est la densité de lecture : le joueur voit beaucoup d'informations dès le premier écran, mais les zones sont suffisamment hiérarchisées pour continuer à jouer.

## Ce qui fonctionne

- La boucle de tour est claire : observer, choisir une action, lire les conséquences.
- Les jauges globales changent de manière perceptible.
- Les blocs ont des profils distincts sans exposer de coefficients.
- Le journal rend les conséquences plus vivantes et reste court.
- La carte aide à percevoir les six blocs et leurs états sans devenir une carte militaire.
- L'autonomie humaine apparaît déjà comme une jauge morale, pas seulement technique.
- La puissance IA produit une ambiguïté lisible : elle peut stabiliser tout en dépossédant.

## Problèmes de jouabilité

- Les actions ne montrent pas encore leurs effets probables avant le clic. C'est acceptable pour v0.1, mais cela peut rendre les premiers tours un peu opaques.
- Les fins semblent atteignables par accumulation de certaines actions, mais elles ne sont pas encore faciles à tester volontairement.
- Le joueur peut manquer d'un signal clair sur l'état de partie après plusieurs tours, au-delà des jauges et du journal.

## Problèmes d'UX

- L'écran est dense sur ordinateur standard : carte, blocs, actions et journal cohabitent correctement, mais la colonne d'actions reste longue.
- Le libellé du bouton de réinitialisation était trop court.
- Le bandeau de fin parlait encore de "fin provisoire", alors que le système porte désormais des diagnostics.
- La carte avait une légende utile, mais ne nommait pas explicitement la résistance humaine.

## Problèmes de cohérence avec le projet

- La carte reste bien une surface d'observation, pas un système de conquête.
- Les événements sont reliés aux variables et aux actions ; ils ne ressemblent pas à des blagues arbitraires.
- Le prototype conserve un horizon riche sans installer d'infrastructure prématurée.
- Le risque principal pour la suite est d'ajouter trop vite des sous-systèmes sociaux, militaires ou territoriaux.

## Corrections effectuées

- Bouton renommé en "Réinitialiser la partie".
- Bandeau de fin renommé en "Diagnostic final".
- Ajout d'une courte aide dans le panneau des interventions IA.
- Ajout d'un état "Résistance" sur la carte quand la confiance IA est basse et la tension sociale active.
- Ajout de la résistance humaine dans la légende de la carte.

## Corrections recommandées mais non faites

- Ajouter un aperçu très compact des effets attendus sur les actions.
- Ajouter un petit mode de test interne pour déclencher rapidement les fins.
- Revoir l'ordre et le regroupement des actions après quelques sessions de jeu.
- Mesurer visuellement la lisibilité mobile avec un vrai navigateur, pas seulement via build.

## Prochaines priorités

1. Tester une partie complète sur 10 à 20 tours.
2. Ajuster les seuils des événements et des fins.
3. Ajouter un aperçu minimal des conséquences probables des actions si l'opacité gêne le jeu.

## Ce qu'il ne faut pas ajouter maintenant

- Carte détaillée à 190 États.
- Unités, fronts, routes ou ressources.
- Sous-systèmes sociaux ou militaires détaillés.
- Arbre narratif complexe.
- IA générative pour bilans de fin.
- Authentification, backend ou Supabase.
