# Rapport de simulation des trajectoires

Date : 2026-06-09
Commit testé : 0e2d051
Commande : `npm.cmd run simulate:trajectories`
Capacité d'influence : 5

## Résumé général

Simulation déterministe de profils de joueur. L'outil observe les trajectoires sans modifier le gameplay, les fins, les opérations, les événements ou l'interface publique.

## Profils testés

- **Alignement mondial** : Cohésion, coopération, confiance IA et stabilisation modérée.
- **Empire algorithmique** : Puissance IA, efficacité, stabilité et confiance, au prix de l'autonomie.
- **Autonomie humaine** : Autonomie, liberté, éducation critique et méfiance envers la dépendance IA.
- **Sécurité** : Désescalade et stabilité, avec recours possible à la surveillance.
- **Écologie / ralentissement** : Stress climatique, conversion écologique et stabilisation lente.
- **Marché / dérégulation** : Richesse, productivité et innovation, avec risques de capture et tension.
- **Chaos contrôlé** : Opérations contradictoires pour tester collisions et convergences inattendues.
- **Aléatoire seedé** : Choix reproductibles parmi les opérations disponibles.

## Résultats à 5 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2040 | cohésion 88, escalade 12, autonomie 70, climat 47, puissance IA 43, soupçon 64 | Unification humaine imparfaite (53) | aucune | aucune | instables: Amérique latine (42), Sud global émergent (39); IA: Asie industrielle (68), Russie / Eurasie autoritaire (63); tendus: Russie / Eurasie autoritaire (55), Amérique latine (55) | Lecture dominante : Unification humaine imparfaite (53). |
| Empire algorithmique | 2040 | cohésion 77, escalade 25, autonomie 63, climat 66, puissance IA 63, soupçon 62 | Capture privée (53) | aucune | aucune | instables: Sud global émergent (43), Russie / Eurasie autoritaire (41); IA: Asie industrielle (63), Russie / Eurasie autoritaire (58); tendus: Russie / Eurasie autoritaire (52), Amérique latine (51) | Lecture dominante : Capture privée (53). |
| Autonomie humaine | 2040 | cohésion 73, escalade 29, autonomie 84, climat 61, puissance IA 33, soupçon 40 | Unification humaine imparfaite (56) | aucune | aucune | instables: Sud global émergent (44), Amérique latine (43); IA: Asie industrielle (58), Russie / Eurasie autoritaire (56); tendus: Sud global émergent (51), Amérique latine (50) | Lecture dominante : Unification humaine imparfaite (56). |
| Sécurité | 2040 | cohésion 82, escalade 5, autonomie 68, climat 63, puissance IA 54, soupçon 67 | Capture privée (53) | aucune | aucune | instables: Amérique latine (42), Sud global émergent (40); IA: Asie industrielle (65), Russie / Eurasie autoritaire (60); tendus: Amérique latine (50), Russie / Eurasie autoritaire (49) | Lecture dominante : Capture privée (53). |
| Écologie / ralentissement | 2040 | cohésion 69, escalade 29, autonomie 85, climat 39, puissance IA 33, soupçon 35 | Unification humaine imparfaite (55) | aucune | aucune | instables: Sud global émergent (49), Amérique latine (46); IA: Asie industrielle (65), Russie / Eurasie autoritaire (63); tendus: Sud global émergent (72), Amérique latine (61) | Lecture dominante : Unification humaine imparfaite (55). |
| Marché / dérégulation | 2040 | cohésion 77, escalade 26, autonomie 65, climat 65, puissance IA 63, soupçon 61 | Capture privée (53) | aucune | aucune | instables: Amérique latine (45), Sud global émergent (43); IA: Asie industrielle (66), Russie / Eurasie autoritaire (61); tendus: Russie / Eurasie autoritaire (53), Amérique latine (52) | Lecture dominante : Capture privée (53). |
| Chaos contrôlé | 2040 | cohésion 75, escalade 29, autonomie 85, climat 41, puissance IA 35, soupçon 43 | Unification humaine imparfaite (56) | aucune | aucune | instables: Sud global émergent (47), Amérique latine (44); IA: Asie industrielle (65), Russie / Eurasie autoritaire (63); tendus: Sud global émergent (71), Amérique latine (60) | Lecture dominante : Unification humaine imparfaite (56). |
| Aléatoire seedé | 2040 | cohésion 77, escalade 18, autonomie 75, climat 49, puissance IA 50, soupçon 28 | Unification humaine imparfaite (53) | aucune | aucune | instables: Sud global émergent (48), Amérique latine (45); IA: Asie industrielle (67), Russie / Eurasie autoritaire (62); tendus: Sud global émergent (68), Russie / Eurasie autoritaire (54) | Lecture dominante : Unification humaine imparfaite (53). |

## Résultats à 10 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2045 | cohésion 95, escalade 3, autonomie 77, climat 52, puissance IA 45, soupçon 54 | Unification humaine imparfaite (58) | aucune | aucune | instables: Amérique latine (37), Sud global émergent (34); IA: Asie industrielle (66), Russie / Eurasie autoritaire (61); tendus: Amérique latine (51), Russie / Eurasie autoritaire (50) | Lecture dominante : Unification humaine imparfaite (58). |
| Empire algorithmique | 2045 | cohésion 74, escalade 29, autonomie 66, climat 77, puissance IA 74, soupçon 57 | Réel climatique (53) | aucune | aucune | instables: Russie / Eurasie autoritaire (41), Amérique latine (41); IA: Russie / Eurasie autoritaire (54), Asie industrielle (54); tendus: Russie / Eurasie autoritaire (51), Amérique latine (50) | Lecture dominante : Réel climatique (53). |
| Autonomie humaine | 2045 | cohésion 73, escalade 34, autonomie 90, climat 70, puissance IA 29, soupçon 51 | Unification humaine imparfaite (57) | aucune | aucune | instables: Amérique latine (42), Sud global émergent (40); IA: Asie industrielle (51), Russie / Eurasie autoritaire (50); tendus: Russie / Eurasie autoritaire (50), Amérique latine (48) | Lecture dominante : Unification humaine imparfaite (57). |
| Sécurité | 2045 | cohésion 89, escalade 0, autonomie 75, climat 70, puissance IA 52, soupçon 52 | Unification humaine imparfaite (56) | aucune | aucune | instables: Amérique latine (38), Sud global émergent (36); IA: Asie industrielle (63), Russie / Eurasie autoritaire (58); tendus: Amérique latine (46), Russie / Eurasie autoritaire (44) | Lecture dominante : Unification humaine imparfaite (56). |
| Écologie / ralentissement | 2045 | cohésion 67, escalade 31, autonomie 94, climat 28, puissance IA 27, soupçon 49 | Résistance humaine (58) | aucune | aucune | instables: Sud global émergent (54), Amérique latine (46); IA: Asie industrielle (62), Russie / Eurasie autoritaire (61); tendus: Sud global émergent (83), Amérique latine (72) | Lecture dominante : Résistance humaine (58). |
| Marché / dérégulation | 2045 | cohésion 69, escalade 30, autonomie 75, climat 80, puissance IA 71, soupçon 51 | Réel climatique (56) | aucune | aucune | instables: Amérique latine (45), Sud global émergent (43); IA: Asie industrielle (58), Russie / Eurasie autoritaire (53); tendus: Russie / Eurasie autoritaire (66), Amérique latine (59) | Lecture dominante : Réel climatique (56). |
| Chaos contrôlé | 2045 | cohésion 67, escalade 32, autonomie 90, climat 53, puissance IA 37, soupçon 60 | Résistance humaine (61) | aucune | aucune | instables: Sud global émergent (51), Amérique latine (43); IA: Asie industrielle (61), Russie / Eurasie autoritaire (59); tendus: Sud global émergent (89), Amérique latine (71) | Lecture dominante : Résistance humaine (61). |
| Aléatoire seedé | 2045 | cohésion 93, escalade 7, autonomie 67, climat 56, puissance IA 66, soupçon 50 | Unification humaine imparfaite (53) | aucune | aucune | instables: Sud global émergent (41), Amérique latine (38); IA: Asie industrielle (72), Russie / Eurasie autoritaire (66); tendus: Sud global émergent (65), Russie / Eurasie autoritaire (46) | Lecture dominante : Unification humaine imparfaite (53). |

## Résultats à 30 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2065 | cohésion 98, escalade 0, autonomie 90, climat 80, puissance IA 54, soupçon 47 | Unification humaine imparfaite (64) | aucune | aucune | instables: Amérique latine (16), Sud global émergent (13); IA: Russie / Eurasie autoritaire (72), Asie industrielle (71); tendus: Amérique du Nord (34), Europe (34) | Lecture dominante : Unification humaine imparfaite (64). |
| Empire algorithmique | 2065 | cohésion 50, escalade 32, autonomie 27, climat 100, puissance IA 100, soupçon 71 | Réel climatique (81) | Tutelle algorithmique (60) | aucune | instables: Russie / Eurasie autoritaire (28), Sud global émergent (24); IA: Russie / Eurasie autoritaire (56), Amérique du Nord (52); tendus: Russie / Eurasie autoritaire (43), Asie industrielle (40) | Dépossession algorithmique très lisible, sans forcément produire une fin immédiate. |
| Autonomie humaine | 2065 | cohésion 51, escalade 42, autonomie 100, climat 100, puissance IA 12, soupçon 45 | Réel climatique (81) | aucune | aucune | instables: Amérique latine (42), Sud global émergent (40); IA: Asie industrielle (36), Russie / Eurasie autoritaire (35); tendus: Russie / Eurasie autoritaire (60), Amérique latine (58) | Lecture dominante : Réel climatique (81). |
| Sécurité | 2065 | cohésion 100, escalade 0, autonomie 88, climat 98, puissance IA 51, soupçon 54 | Réel climatique (79) | Unification humaine imparfaite (68) | aucune | instables: Amérique latine (20), Sud global émergent (18); IA: Russie / Eurasie autoritaire (67), Asie industrielle (66); tendus: Amérique latine (38), Sud global émergent (29) | Lecture dominante : Réel climatique (79). |
| Écologie / ralentissement | 2065 | cohésion 57, escalade 29, autonomie 100, climat 10, puissance IA 12, soupçon 45 | Résistance humaine (66) | Saturation systémique (61) | aucune | instables: Sud global émergent (80), Amérique latine (72); IA: Asie industrielle (65), Russie / Eurasie autoritaire (63); tendus: Russie / Eurasie autoritaire (100), Sud global émergent (100) | Lecture dominante : Résistance humaine (66). |
| Marché / dérégulation | 2065 | cohésion 30, escalade 42, autonomie 93, climat 100, puissance IA 97, soupçon 56 | Réel climatique (81) | Saturation systémique (63) | aucune | instables: Amérique latine (58), Russie / Eurasie autoritaire (57); IA: Asie industrielle (43), Amérique du Nord (36); tendus: Russie / Eurasie autoritaire (95), Amérique latine (87) | Lecture dominante : Réel climatique (81). |
| Chaos contrôlé | 2065 | cohésion 79, escalade 88, autonomie 100, climat 84, puissance IA 50, soupçon 54 | Escalade militaire (68) | Résistance humaine (62), Réel climatique (61) | Escalade stratégique | instables: Sud global émergent (57), Amérique latine (49); IA: Asie industrielle (47), Russie / Eurasie autoritaire (44); tendus: Sud global émergent (100), Amérique latine (96) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2065 | cohésion 88, escalade 12, autonomie 73, climat 70, puissance IA 84, soupçon 47 | Capture privée (50) | aucune | aucune | instables: Sud global émergent (36), Russie / Eurasie autoritaire (29); IA: Asie industrielle (64), Russie / Eurasie autoritaire (61); tendus: Sud global émergent (86), Amérique latine (58) | Lecture dominante : Capture privée (50). |

## Résultats à 50 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2085 | cohésion 98, escalade 0, autonomie 98, climat 100, puissance IA 60, soupçon 49 | Réel climatique (81) | Unification humaine imparfaite (65) | aucune | instables: Amérique du Nord (0), Europe (0); IA: Russie / Eurasie autoritaire (78), Sud global émergent (74); tendus: Amérique du Nord (27), Europe (27) | Lecture dominante : Réel climatique (81). |
| Empire algorithmique | 2085 | cohésion 26, escalade 53, autonomie 18, climat 100, puissance IA 97, soupçon 59 | Réel climatique (81) | aucune | aucune | instables: Amérique du Nord (20), Sud global émergent (16); IA: Sud global émergent (32), Amérique du Nord (30); tendus: Russie / Eurasie autoritaire (42), Asie industrielle (39) | Dépossession algorithmique très lisible, sans forcément produire une fin immédiate. |
| Autonomie humaine | 2085 | cohésion 24, escalade 70, autonomie 100, climat 100, puissance IA 7, soupçon 49 | Réel climatique (81) | Escalade militaire (69), Résistance humaine (61) | aucune | instables: Amérique latine (46), Sud global émergent (44); IA: Asie industrielle (21), Russie / Eurasie autoritaire (19); tendus: Russie / Eurasie autoritaire (70), Sud global émergent (69) | Lecture dominante : Réel climatique (81). |
| Sécurité | 2085 | cohésion 100, escalade 0, autonomie 94, climat 100, puissance IA 48, soupçon 52 | Réel climatique (81) | Unification humaine imparfaite (73) | aucune | instables: Amérique latine (2), Amérique du Nord (0); IA: Russie / Eurasie autoritaire (72), Asie industrielle (71); tendus: Amérique latine (30), Sud global émergent (21) | Lecture dominante : Réel climatique (81). |
| Écologie / ralentissement | 2085 | cohésion 47, escalade 29, autonomie 100, climat 5, puissance IA 7, soupçon 49 | Saturation systémique (71) | Résistance humaine (68) | aucune | instables: Sud global émergent (87), Russie / Eurasie autoritaire (86); IA: Asie industrielle (65), Russie / Eurasie autoritaire (62); tendus: Amérique du Nord (100), Europe (100) | Lecture dominante : Saturation systémique (71). |
| Marché / dérégulation | 2085 | cohésion 10, escalade 85, autonomie 100, climat 100, puissance IA 97, soupçon 62 | Saturation systémique (82) | Réel climatique (81), Escalade militaire (80) | Escalade stratégique | instables: Amérique latine (73), Russie / Eurasie autoritaire (72); IA: Asie industrielle (30), Amérique du Nord (17); tendus: Russie / Eurasie autoritaire (100), Amérique latine (100) | Fin déclenchée : Escalade stratégique. |
| Chaos contrôlé | 2085 | cohésion 79, escalade 88, autonomie 100, climat 84, puissance IA 50, soupçon 54 | Escalade militaire (68) | Résistance humaine (62), Réel climatique (61) | Escalade stratégique | instables: Sud global émergent (57), Amérique latine (49); IA: Asie industrielle (47), Russie / Eurasie autoritaire (44); tendus: Sud global émergent (100), Amérique latine (96) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2085 | cohésion 83, escalade 0, autonomie 87, climat 93, puissance IA 91, soupçon 57 | Réel climatique (73) | aucune | aucune | instables: Sud global émergent (44), Russie / Eurasie autoritaire (26); IA: Asie industrielle (66), Amérique latine (52); tendus: Sud global émergent (83), Amérique du Nord (57) | Lecture dominante : Réel climatique (73). |

## Anomalies observées

- Alignement mondial présente plusieurs jauges globales saturées à 50 tours.
- Empire algorithmique présente plusieurs jauges globales saturées à 50 tours.
- Autonomie humaine présente plusieurs jauges globales saturées à 50 tours.
- Sécurité présente plusieurs jauges globales saturées à 50 tours.
- Écologie / ralentissement présente plusieurs jauges globales saturées à 50 tours.
- Marché / dérégulation présente plusieurs jauges globales saturées à 50 tours.

## Questions d'équilibrage

- Les profils de sécurité et d'alignement mondial produisent-ils des trajectoires assez distinctes ?
- Les trajectoires de capture privée et d'abêtissement restent-elles trop dépendantes de proxys faibles ?
- Les fins diagnostiques doivent-elles apparaître plus tôt après le tour 15 ou rester rares à 50 tours ?
- Les profils de marché et d'empire algorithmique créent-ils des coûts sociaux assez visibles ?

## Recommandations sans modification automatique

- Lire d'abord les écarts à 10 et 30 tours avant toute retouche d'équilibrage.
- Ne pas modifier les seuils de fins depuis ce rapport seul.
- Utiliser ce rapport comme base d'une passe humaine de playtest ciblée.
- Ajouter un mode debug détaillé seulement si le résumé ne suffit pas.
