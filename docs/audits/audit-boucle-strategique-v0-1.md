# Audit boucle stratégique v0.1

## Verdict général

La boucle ne repose plus sur un clic d'action isolé. Le joueur observe d'abord l'état du monde, prépare un paquet de 1 à 3 interventions, puis valide explicitement le tour. Cette structure rend l'intention stratégique plus lisible sans ajouter de nouveau système lourd.

## Nouvelle boucle de tour

1. Observer la vue Monde.
2. Ouvrir la vue Stratégie.
3. Choisir une posture descriptive.
4. Sélectionner 1 à 3 interventions.
5. Valider le tour.
6. Lire le paquet stratégique et les réactions dans le Journal.
7. Revenir au Monde ou aux Blocs pour observer les effets.

## Navigation ajoutée

- Monde : jauges globales et carte mondiale stylisée.
- Stratégie : posture, paquet sélectionné, actions et validation.
- Blocs : cartes détaillées des six blocs.
- Journal : conséquences et événements systémiques.

La navigation reste locale à React, sans routeur.

## Corrections effectuées

- Validation explicite du tour.
- Sélection et désélection de 1 à 3 interventions.
- Bouton de validation désactivé si aucune intervention n'est sélectionnée.
- Journal reformulé autour d'un paquet stratégique.
- Cartes d'action enrichies avec promesse, risque et catégorie lisible.
- Simulations mises à jour pour utiliser des paquets d'interventions par tour.

## Posture stratégique

La posture est implémentée comme outil de lecture seulement. Elle ne modifie pas encore les effets. Ce choix évite un système doctrinal opaque et garde le prototype testable.

## Problèmes restants

- La vue Journal reste très synthétique et pourrait mieux distinguer résumé de tour et événement systémique.
- La posture devra être testée : elle aide peut-être la compréhension, mais son effet purement descriptif peut sembler décoratif.
- Le retour visuel après validation pourrait être plus net lors d'une future passe UX.
- Les simulations confirment la compatibilité moteur, mais un playtest humain complet reste nécessaire.

## À ne pas ajouter maintenant

- Arbre de doctrines.
- Bonus cachés par posture.
- Menu complexe.
- Carte interactive de commandement.
- Sous-systèmes sociaux ou militaires.

## Prochaine priorité

Faire un playtest manuel complet avec la nouvelle boucle stratégique et noter les incompréhensions restantes.
