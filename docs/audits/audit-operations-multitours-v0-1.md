# Audit opérations multitours v0.1

## Retour joueur traité

Le soupçon IA reste une jauge visible, mais il n'est plus commenté à chaque rapport. La boucle clandestine gagne aussi des opérations qui se préparent sur un tour puis se déploient au tour suivant.

## Soupçon latent

Le soupçon d'origine algorithmique est un risque de fond. Le rapport d'évolution ne le mentionne que si :

- la variation est nette ;
- un seuil est franchi ;
- un événement de soupçon est déclenché ;
- le soupçon baisse de manière significative.

Les branches fortes restent différées : enquête anti-IA, religion de l'IA, scandale d'exposition, faux coupable, capture institutionnelle.

## Modèle multitours

Une action peut préparer une ou plusieurs opérations. Elle produit un effet faible ou indirect, puis ajoute une opération prête dans `GameState.preparedOperations`. Cette opération devient sélectionnable au tour suivant, garde sa cible, peut expirer, puis disparaît après usage.

## Chaînes ajoutées

- Préparer un plan de communication -> Lancer une campagne d'information ou Désinformation contrôlée.
- Préparer une médiation institutionnelle -> Activer les relais diplomatiques.
- Cartographier les résistances civiques -> Dialoguer par intermédiaires ou Neutraliser les foyers de résistance.

## Orientation stratégique

Les orientations restent descriptives. Elles n'accordent aucun bonus caché. Les actions compatibles peuvent afficher "Recommandé pour cette orientation" afin de guider la lecture sans automatiser le choix.

## Rapport d'évolution

Le rapport distingue désormais :

- interventions immédiates ;
- préparations du tour ;
- opérations débloquées ;
- changements globaux ;
- événement systémique ;
- note de soupçon seulement si utile.

## Limites actuelles

- Les opérations prêtes sont simples et non scénarisées.
- Le système ne gère pas encore de vraie branche de révélation.
- Les textes restent fonctionnels ; une passe littéraire viendra plus tard.
- L'équilibrage des nouvelles opérations demande un playtest complet.

## Prochain test recommandé

Jouer au moins dix tours en utilisant chaque chaîne multitours une fois, puis vérifier si les opérations prêtes sont comprises sans lire la documentation.
