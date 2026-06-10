# Passe « Rapport lisible » — v0.1

## 1. Statut du document

Passe d'architecture d'interface, suite directe de la passe « Textes digestes » qui avait identifié le gisement : le rapport d'évolution étalait quatorze rubriques (~280 mots) à chaque tour. Périmètre volontairement étroit : un seul composant (`src/components/EvolutionReportPanel.tsx`) et ses styles. Aucune modification du moteur ni des données.

## 2. Principe : hiérarchiser, pas amputer

Le rapport passe en deux étages. Toujours visibles : le tour et l'opération (une ligne), la synthèse, la note de soupçon — remontée du pied de page où elle était enterrée alors qu'elle est l'information la plus stratégique du jeu —, l'alerte d'événement systémique et les signaux du monde (crises, motifs détectés), plafonnés à trois. Le reste vit dans cinq tiroirs `<details>` natifs : Vos opérations, Jauges et blocs, Relations entre blocs, Lecture historique, Signaux faibles.

La règle qui fait la différence : **l'intitulé du tiroir porte déjà l'information clé**. « Relations entre blocs — 4 mouvements · tension en tête », « Lecture historique — Tutelle algorithmique (64) ». Le rapport fermé renseigne ; le rapport ouvert détaille. Seul cas d'ouverture automatique : « Vos opérations » quand de nouvelles opérations viennent d'être débloquées, parce que c'est une nouvelle, pas un rappel.

## 3. Résultat mesuré

Texte visible par défaut sur un tour ordinaire : ~54 mots, contre ~278 tout déplié (-80 %). Aucune information supprimée : les filtres anti-bruit existants (valeurs neutres, signaux par défaut) sont conservés à l'identique, et tout le contenu antérieur reste à un clic, derrière des `<details>` natifs — accessibles au clavier, sans état React, sans dépendance.

## 4. Choix techniques

`<details>/<summary>` natifs plutôt qu'un accordéon maison : zéro état, accessibilité gratuite, ouverture mémorisée par le navigateur pendant la session de lecture. Un composant interne `ReportList` remplace les huit blocs titre+liste dupliqués. La grille deux colonnes disparaît au profit d'une pile de tiroirs : l'ordre de lecture redevient linéaire, du plus important au plus optionnel.

## 5. Vérification

Compilation et build verts ; `simulate:strategies` et `simulate:trajectories` inchangés (la passe ne touche pas le moteur). La vérification visuelle fine (densité, états ouverts/fermés, mobile) reste à faire en jeu : c'est le premier candidat du prochain playtest humain.
