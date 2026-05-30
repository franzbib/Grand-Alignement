# Audit rythme, agentivite et trajectoires - v0.1

## 1. Statut du document

Document de reference non implemente. Il sert de doctrine de rythme et d'agentivite pour les futurs agents travaillant sur Le Grand Alignement.

Il ne modifie pas le gameplay, les scores, les fins, les evenements, les actions, l'interface ou les simulations. Il fixe seulement un cadre de lecture : duree cible, moment d'apparition des trajectoires, marge d'inflexion du joueur et coherence entre les ecrans.

## 2. Resume executif

La duree cible du prototype principal est de **20 a 30 tours**.

Les simulations a **50 tours** servent de stress test de robustesse, non de reference principale d'equilibrage.

Le jeu doit permettre au joueur d'inflechir fortement l'histoire dans les dix premiers tours, de payer ses orientations dans les vingt suivants, puis de voir ses choix repetes se transformer en trajectoire historique.

Le risque principal a eviter est double : des trajectoires trop precoces, qui enferment la partie avant que le joueur comprenne ses leviers ; ou des trajectoires trop molles, qui rendent toutes les parties semblables.

## 3. Duree cible du prototype

Decision recommandee :

> La duree cible du prototype principal est de **20 a 30 tours**. Les simulations a **50 tours** servent de stress test de robustesse, non de reference principale d'equilibrage.

En pratique :

- 10 tours doivent deja donner une lecture claire de l'orientation du monde.
- 20 a 30 tours doivent produire une bifurcation lisible.
- 50 tours doivent reveler les saturations, les convergences et les faiblesses du modele, sans devenir la norme de conception.

## 4. Horizons de partie

| Horizon | Fonction ludique | Effet attendu |
| --- | --- | --- |
| 1-5 tours | Installation | Le monde reagit, mais aucune trajectoire ne doit etre trop certaine. |
| 6-10 tours | Orientation | Une direction devient perceptible, sans enfermer encore la partie. |
| 11-30 tours | Bifurcation | Les profils de jeu doivent produire des mondes nettement differents. |
| 31-50 tours | Stress test / histoire longue | Les saturations peuvent apparaitre, mais comme aboutissement, non comme panne du modele. |

### Tours 1 a 5 - Installation

Le joueur decouvre les jauges, les blocs, les relations et le menu Influence. Les signaux doivent rester prudents. Une action peut deja compter, mais aucune lecture finale ne doit sembler acquise.

Objectif : installer le monde et montrer qu'il repond.

### Tours 6 a 10 - Orientation

Les choix repetes commencent a former une direction. Le joueur doit sentir qu'il n'a pas seulement clique sur des boutons, mais qu'il a adopte une maniere d'agir.

Objectif : rendre visible une orientation sans fermer les alternatives.

### Tours 11 a 30 - Bifurcation

C'est le coeur cible du prototype. Les profils doivent diverger : un monde securitaire, un monde pacifie par l'IA, un monde plus autonome mais plus conflictuel, un monde climatique sous tension, etc.

Objectif : transformer les choix repetes en trajectoire historique.

### Tours 31 a 50 - Stress test / histoire longue

Cet horizon sert surtout a observer les limites du modele : jauges qui saturent, trajectoires qui ecrasent les autres, fins trop rares ou trop tardives.

Objectif : tester la robustesse, pas equilibrer toute la v0.1 autour de cette duree.

## 5. Agentivite du joueur

Regle de conception :

> Le joueur doit pouvoir inflechir fortement l'histoire dans les dix premiers tours, payer ses orientations dans les vingt suivants, puis voir ses choix repetes se transformer en trajectoire historique.

| Moment | Puissance d'inflexion du joueur |
| --- | --- |
| Tours 1-5 | Forte : le monde est encore malleable. |
| Tours 6-10 | Forte mais deja contrainte : les premiers choix creent une inertie. |
| Tours 11-30 | Moyenne : le joueur peut inflechir, mais doit payer un cout. |
| Apres 30 tours | Faible a moyenne : il peut corriger, mais pas effacer l'histoire. |

Le joueur ne doit pas tout controler. Le monde doit garder sa logique propre : rivalites, inerties institutionnelles, dependances, reception sociale, malentendus et effets secondaires.

## 6. Intensite progressive des trajectoires

Doctrine recommandee, non implementee dans le code pour l'instant :

- A 5 tours : **Signal faible** seulement.
- A 10 tours : **Orientation emergente**.
- A 30 tours : **Trajectoire dominante** clairement lisible.
- A 50 tours : **Bascule historique** ou stress test long.

### Signal faible

Indice discret : une jauge, une breve, une relation ou un rapport suggere une possibilite. Le joueur peut encore l'ignorer, l'amplifier ou la contredire.

### Orientation emergente

Plusieurs signaux convergent. Le monde semble prendre une couleur politique, mais une strategie differente peut encore produire une inflexion nette.

### Trajectoire dominante

La partie raconte deja un devenir identifiable : tutelle algorithmique, unification imparfaite, resistance humaine, escalade, capture privee, saturation systemique, etc.

### Bascule historique

Le monde a accumule assez d'inertie pour que les corrections deviennent couteuses. Cette notion doit rester rare dans une partie cible de 20 a 30 tours.

## 7. Inflexion du scenario selon les horizons

Le prototype doit eviter les diagnostics qui deviennent certains trop tot. Un diagnostic precoce doit rester une lecture, pas une condamnation.

Recommandations pour les futures passes :

- Les rapports a 5 tours doivent parler de signaux et de tendances, pas de destin.
- Les rapports a 10 tours doivent nommer l'orientation sans la verrouiller.
- Les rapports a 30 tours doivent assumer une lecture historique plus forte.
- Les tests a 50 tours doivent etre lus comme une alarme de robustesse, pas comme un echec automatique.

## 8. Enseignements des jeux proches

### Reigns

Lecon a retenir : decisions tres simples, profondeur produite par la selection contextuelle des cartes, impression d'agentivite malgre une interface minimale.

Transfert pour Le Grand Alignement :

- Les breves, signaux faibles et rapports doivent parfois reagir aux choix passes.
- Une minorite de signaux vraiment conditionnes peut donner une forte impression de monde vivant.
- Les trajectoires ne doivent pas tout dire trop tot.

### Frostpunk

Lecon a retenir : les choix deviennent moraux parce qu'ils sont accompagnes d'une reception sociale. Les decisions affectent des jauges, mais aussi la maniere dont une population percoit l'action.

Transfert pour Le Grand Alignement :

- Une action doit produire un effet mecanique, un signal narratif et une trace de trajectoire.
- L'onglet Blocs, le Rapport et le Journal doivent faire sentir la reception politique des decisions.
- Les decisions de l'IA doivent avoir un cout humain ou politique lisible.

### Rebel Inc.

Lecon a retenir : l'interet vient de l'equilibre entre priorites civiles, securitaires et politiques. Stabiliser un systeme suppose de gerer plusieurs imperatifs concurrents.

Transfert pour Le Grand Alignement :

- Cohesion, securite, autonomie, lucidite, climat et confiance IA doivent rester en tension.
- Une baisse de tension peut couter en autonomie.
- Une hausse de stabilite peut produire soupcon, dependance ou pacification.
- Aucune action ne doit devenir universellement optimale.

### Plague Inc.

Lecon a retenir : progression systemique mondiale, montee en puissance par seuils, adaptation du monde aux strategies installees.

Transfert pour Le Grand Alignement :

- Une strategie silencieuse doit etre possible, mais produire des signaux adverses.
- Une trajectoire forte doit generer des resistances ou des effets secondaires.
- Le jeu doit eviter qu'une seule methode devienne la solution repetitive.

## 9. Application a Le Grand Alignement

La carte, le rapport d'evolution, l'onglet Blocs, le journal, le menu Influence et les fins doivent raconter le meme monde, chacun avec son registre.

| Ecran | Registre |
| --- | --- |
| Carte | Montre le symptome. |
| Rapport d'evolution | Explique la dynamique. |
| Onglet Blocs | Donne l'etat vecu local. |
| Journal | Donne l'evenement ou l'anecdote. |
| Menu Influence | Donne les moyens d'agir. |
| Fins | Donnent le diagnostic moral et historique. |

Si la trajectoire dominante est "Empire algorithmique", elle doit se lire dans la puissance IA, l'autonomie humaine, la confiance envers l'IA, les rapports de blocs, les breves et le diagnostic final. Si elle n'apparait que dans un score cache ou un seul panneau, elle n'est pas encore assez lisible.

## 10. Implications pour les simulations automatiques

Les simulations doivent distinguer les horizons :

- 5 tours : verifier l'absence de diagnostic trop certain.
- 10 tours : verifier que les profils commencent a diverger.
- 30 tours : verifier que les trajectoires dominantes sont plausibles.
- 50 tours : chercher saturations, convergences forcees et scores trop faciles.

Une saturation a 50 tours n'est pas automatiquement grave. Une saturation a 10 tours l'est davantage si elle enferme la partie ou rend une strategie optimale.

## 11. Implications pour l'UX

L'UX doit eviter deux erreurs :

- Tout afficher partout, ce qui transforme le jeu en fiche statistique.
- Tout cacher dans des diagnostics, ce qui rend l'action opaque.

Regle pratique : chaque ecran doit repondre a une question simple.

- Monde : ou sont les symptomes ?
- Blocs : comment vit-on cette trajectoire localement ?
- Influence : que puis-je tenter maintenant ?
- Rapport : qu'est-ce qui vient de changer ?
- Journal : quel fait rend ce changement memorable ?

## 12. Implications pour la narration

La narration doit rester systemique : pas de gag arbitraire, pas de personnage ajoute pour decorer, pas de grand texte qui compense une mecanique muette.

Pistes futures de contre-effets legers, a ne pas implementer immediatement :

- Puissance IA haute -> soupcon, dependance, resistance intellectuelle.
- Cohesion haute + autonomie basse -> pacification inquietante.
- Richesse haute + liberte basse -> capture privee ou contestation.
- Stabilite haute + lucidite basse -> abetissement pacifie.
- Securite haute + militarisation haute -> paix par la peur.

Ces contre-effets doivent etre consideres lors d'une future passe d'equilibrage ou d'evenements, pas ajoutes automatiquement.

## 13. Garde-fous anti-usine a gaz

- Ne pas ajouter de systeme si un seuil, un texte conditionnel ou un rapport suffit.
- Ne pas transformer les trajectoires en branches rigides.
- Ne pas convertir les scores de trajectoire en declencheurs automatiques sans validation humaine.
- Ne pas equilibrer la v0.1 autour de 50 tours.
- Ne pas ajouter de diplomatie complete pour corriger les relations inter-blocs.
- Ne pas ajouter de personnages systemiques avant que les trajectoires soient lisibles.
- Ne pas confondre richesse d'interpretation et complexite de simulation.

## 14. Recommandations operationnelles

1. Valider humainement la duree cible de 20 a 30 tours avant toute passe d'equilibrage.
2. Lire les simulations par horizon, pas seulement par resultat final.
3. Surveiller en priorite les anomalies visibles a 10 tours.
4. Utiliser les scores de trajectoire comme diagnostics de lecture seule tant qu'ils ne sont pas stabilises.
5. Faire converger carte, rapport, Blocs, journal et fins avant d'ajouter de nouveaux grands contenus.
6. Reporter les contre-effets plus ambitieux a une micro-passe dediee.

## 15. Sources et reperes

- Game Developer, "Game Design Deep Dive: Creating an adaptive narrative in Reigns" : https://www.gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i-
- Game Developer, "Frostpunk - An analysis of emotional narrative engagement" : https://www.gamedeveloper.com/design/frostpunk-an-analysis-of-emotional-narrative-engagement
- Ndemic Creations, page officielle de Rebel Inc. : https://www.ndemiccreations.com/en/51-rebel-inc
- Ndemic Creations, page officielle de Plague Inc. : https://www.ndemiccreations.com/en/22-plague-inc

Ces references servent de reperes de conception, pas de modeles a copier.
