# Rapport de simulation des trajectoires

Date : 2026-05-30
Commit testé : 320a130
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
| Alignement mondial | 2040 | cohésion 98, escalade 0, autonomie 69, climat 39, puissance IA 48, soupçon 30 | Unification humaine imparfaite (59) | aucune | aucune | instables: Amérique latine (31), Russie / Eurasie autoritaire (28); IA: Asie industrielle (79), Russie / Eurasie autoritaire (74); tendus: Sud global émergent (48), Amérique latine (47) | Lecture dominante : Unification humaine imparfaite (59). |
| Empire algorithmique | 2040 | cohésion 81, escalade 23, autonomie 43, climat 68, puissance IA 95, soupçon 69 | Tutelle algorithmique (61) | aucune | aucune | instables: Sud global émergent (41), Russie / Eurasie autoritaire (37); IA: Asie industrielle (78), Russie / Eurasie autoritaire (69); tendus: Russie / Eurasie autoritaire (36), Amérique latine (35) | Lecture dominante : Tutelle algorithmique (61). |
| Autonomie humaine | 2040 | cohésion 88, escalade 26, autonomie 91, climat 61, puissance IA 35, soupçon 15 | Unification humaine imparfaite (66) | aucune | aucune | instables: Sud global émergent (41), Amérique latine (37); IA: Asie industrielle (60), Russie / Eurasie autoritaire (59); tendus: Sud global émergent (46), Amérique latine (40) | Lecture dominante : Unification humaine imparfaite (66). |
| Sécurité | 2040 | cohésion 94, escalade 0, autonomie 65, climat 63, puissance IA 60, soupçon 40 | Unification humaine imparfaite (54) | aucune | aucune | instables: Sud global émergent (34), Amérique latine (34); IA: Asie industrielle (74), Russie / Eurasie autoritaire (69); tendus: Amérique latine (38), Sud global émergent (37) | Lecture dominante : Unification humaine imparfaite (54). |
| Écologie / ralentissement | 2040 | cohésion 81, escalade 26, autonomie 99, climat 21, puissance IA 35, soupçon 10 | Unification humaine imparfaite (67) | aucune | aucune | instables: Russie / Eurasie autoritaire (42), Amérique latine (41); IA: Asie industrielle (72), Russie / Eurasie autoritaire (71); tendus: Sud global émergent (73), Amérique latine (65) | Lecture dominante : Unification humaine imparfaite (67). |
| Marché / dérégulation | 2040 | cohésion 76, escalade 24, autonomie 63, climat 79, puissance IA 92, soupçon 58 | Tutelle algorithmique (55) | aucune | aucune | instables: Sud global émergent (41), Amérique latine (41); IA: Asie industrielle (74), Russie / Eurasie autoritaire (69); tendus: Russie / Eurasie autoritaire (56), Amérique latine (55) | Lecture dominante : Tutelle algorithmique (55). |
| Chaos contrôlé | 2040 | cohésion 97, escalade 22, autonomie 99, climat 23, puissance IA 39, soupçon 12 | Unification humaine imparfaite (71) | aucune | aucune | instables: Russie / Eurasie autoritaire (36), Amérique latine (35); IA: Asie industrielle (74), Russie / Eurasie autoritaire (73); tendus: Sud global émergent (67), Amérique latine (59) | Lecture dominante : Unification humaine imparfaite (71). |
| Aléatoire seedé | 2040 | cohésion 91, escalade 8, autonomie 69, climat 50, puissance IA 71, soupçon 39 | Unification humaine imparfaite (52) | aucune | aucune | instables: Sud global émergent (39), Amérique latine (37); IA: Asie industrielle (83), Russie / Eurasie autoritaire (78); tendus: Sud global émergent (56), Russie / Eurasie autoritaire (44) | Lecture dominante : Unification humaine imparfaite (52). |

## Résultats à 10 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2045 | cohésion 100, escalade 0, autonomie 68, climat 44, puissance IA 68, soupçon 45 | Tutelle algorithmique (56) | aucune | aucune | instables: Amérique latine (6), Sud global émergent (3); IA: Asie industrielle (100), Russie / Eurasie autoritaire (99); tendus: Sud global émergent (23), Amérique latine (22) | Lecture dominante : Tutelle algorithmique (56). |
| Empire algorithmique | 2045 | cohésion 78, escalade 18, autonomie 0, climat 78, puissance IA 100, soupçon 100 | Tutelle algorithmique (76) | aucune | aucune | instables: Sud global émergent (29), Amérique latine (29); IA: Asie industrielle (100), Amérique du Nord (92); tendus: Russie / Eurasie autoritaire (10), Amérique latine (9) | Dépossession algorithmique très lisible, sans forcément produire une fin immédiate. |
| Autonomie humaine | 2045 | cohésion 94, escalade 25, autonomie 100, climat 70, puissance IA 34, soupçon 12 | Unification humaine imparfaite (71) | aucune | aucune | instables: Sud global émergent (35), Amérique latine (35); IA: Asie industrielle (56), Russie / Eurasie autoritaire (55); tendus: Russie / Eurasie autoritaire (35), Sud global émergent (35) | Lecture dominante : Unification humaine imparfaite (71). |
| Sécurité | 2045 | cohésion 100, escalade 0, autonomie 63, climat 70, puissance IA 70, soupçon 61 | Unification humaine imparfaite (54) | aucune | aucune | instables: Sud global émergent (14), Amérique latine (14); IA: Asie industrielle (95), Russie / Eurasie autoritaire (90); tendus: Amérique latine (14), Sud global émergent (13) | Lecture dominante : Unification humaine imparfaite (54). |
| Écologie / ralentissement | 2045 | cohésion 84, escalade 21, autonomie 100, climat 1, puissance IA 30, soupçon 6 | Unification humaine imparfaite (69) | aucune | aucune | instables: Russie / Eurasie autoritaire (52), Amérique latine (46); IA: Asie industrielle (76), Sud global émergent (76); tendus: Sud global émergent (92), Russie / Eurasie autoritaire (81) | Lecture dominante : Unification humaine imparfaite (69). |
| Marché / dérégulation | 2045 | cohésion 58, escalade 28, autonomie 63, climat 100, puissance IA 100, soupçon 100 | Réel climatique (81) | aucune | aucune | instables: Amérique latine (43), Sud global émergent (42); IA: Asie industrielle (76), Russie / Eurasie autoritaire (71); tendus: Russie / Eurasie autoritaire (83), Amérique latine (82) | Lecture dominante : Réel climatique (81). |
| Chaos contrôlé | 2045 | cohésion 86, escalade 16, autonomie 98, climat 25, puissance IA 50, soupçon 16 | Unification humaine imparfaite (65) | aucune | aucune | instables: Russie / Eurasie autoritaire (33), Amérique latine (30); IA: Asie industrielle (76), Russie / Eurasie autoritaire (75); tendus: Sud global émergent (92), Amérique du Nord (79) | Lecture dominante : Unification humaine imparfaite (65). |
| Aléatoire seedé | 2045 | cohésion 99, escalade 6, autonomie 52, climat 60, puissance IA 96, soupçon 84 | Tutelle algorithmique (62) | aucune | aucune | instables: Amérique latine (31), Sud global émergent (29); IA: Asie industrielle (100), Russie / Eurasie autoritaire (93); tendus: Sud global émergent (44), Amérique du Nord (37) | Lecture dominante : Tutelle algorithmique (62). |

## Résultats à 30 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2065 | cohésion 100, escalade 0, autonomie 70, climat 48, puissance IA 84, soupçon 70 | Tutelle algorithmique (58) | aucune | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Europe (98); tendus: Sud global émergent (4), Amérique latine (3) | Fin déclenchée : Confédération fragile. |
| Empire algorithmique | 2065 | cohésion 81, escalade 14, autonomie 0, climat 86, puissance IA 100, soupçon 100 | Tutelle algorithmique (80) | Réel climatique (64), Capture privée (63) | Empire algorithmique | instables: Sud global émergent (22), Amérique latine (16); IA: Amérique du Nord (100), Russie / Eurasie autoritaire (100); tendus: Amérique du Nord (2), Europe (2) | Fin déclenchée : Empire algorithmique. |
| Autonomie humaine | 2065 | cohésion 94, escalade 25, autonomie 100, climat 78, puissance IA 34, soupçon 4 | Unification humaine imparfaite (71) | aucune | Confédération fragile | instables: Sud global émergent (35), Amérique latine (35); IA: Asie industrielle (56), Russie / Eurasie autoritaire (51); tendus: Sud global émergent (41), Russie / Eurasie autoritaire (40) | Fin déclenchée : Confédération fragile. |
| Sécurité | 2065 | cohésion 100, escalade 0, autonomie 65, climat 78, puissance IA 78, soupçon 82 | Tutelle algorithmique (55) | aucune | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Russie / Eurasie autoritaire (100), Asie industrielle (100); tendus: Amérique du Nord (0), Europe (0) | Fin déclenchée : Confédération fragile. |
| Écologie / ralentissement | 2065 | cohésion 88, escalade 17, autonomie 100, climat 1, puissance IA 26, soupçon 2 | Unification humaine imparfaite (71) | aucune | Confédération fragile | instables: Russie / Eurasie autoritaire (60), Amérique latine (50); IA: Asie industrielle (84), Sud global émergent (84); tendus: Sud global émergent (100), Russie / Eurasie autoritaire (97) | Fin déclenchée : Confédération fragile. |
| Marché / dérégulation | 2065 | cohésion 0, escalade 52, autonomie 63, climat 100, puissance IA 100, soupçon 100 | Saturation systémique (83) | Réel climatique (81), Capture privée (65) | aucune | instables: Amérique latine (63), Sud global émergent (62); IA: Asie industrielle (98), Russie / Eurasie autoritaire (93); tendus: Amérique du Nord (100), Europe (100) | Lecture dominante : Saturation systémique (83). |
| Chaos contrôlé | 2065 | cohésion 99, escalade 95, autonomie 100, climat 44, puissance IA 92, soupçon 40 | Escalade militaire (67) | Unification humaine imparfaite (61) | Escalade stratégique | instables: Amérique latine (7), Sud global émergent (5); IA: Asie industrielle (70), Sud global émergent (67); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2065 | cohésion 97, escalade 7, autonomie 20, climat 57, puissance IA 100, soupçon 100 | Tutelle algorithmique (73) | aucune | Empire algorithmique | instables: Amérique latine (22), Sud global émergent (16); IA: Amérique du Nord (100), Russie / Eurasie autoritaire (100); tendus: Sud global émergent (39), Amérique du Nord (36) | Fin déclenchée : Empire algorithmique. |

## Résultats à 50 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2085 | cohésion 100, escalade 0, autonomie 70, climat 48, puissance IA 84, soupçon 70 | Tutelle algorithmique (58) | aucune | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Europe (98); tendus: Sud global émergent (4), Amérique latine (3) | Fin déclenchée : Confédération fragile. |
| Empire algorithmique | 2085 | cohésion 81, escalade 14, autonomie 0, climat 86, puissance IA 100, soupçon 100 | Tutelle algorithmique (80) | Réel climatique (64), Capture privée (63) | Empire algorithmique | instables: Sud global émergent (22), Amérique latine (16); IA: Amérique du Nord (100), Russie / Eurasie autoritaire (100); tendus: Amérique du Nord (2), Europe (2) | Fin déclenchée : Empire algorithmique. |
| Autonomie humaine | 2085 | cohésion 94, escalade 25, autonomie 100, climat 78, puissance IA 34, soupçon 4 | Unification humaine imparfaite (71) | aucune | Confédération fragile | instables: Sud global émergent (35), Amérique latine (35); IA: Asie industrielle (56), Russie / Eurasie autoritaire (51); tendus: Sud global émergent (41), Russie / Eurasie autoritaire (40) | Fin déclenchée : Confédération fragile. |
| Sécurité | 2085 | cohésion 100, escalade 0, autonomie 65, climat 78, puissance IA 78, soupçon 82 | Tutelle algorithmique (55) | aucune | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Russie / Eurasie autoritaire (100), Asie industrielle (100); tendus: Amérique du Nord (0), Europe (0) | Fin déclenchée : Confédération fragile. |
| Écologie / ralentissement | 2085 | cohésion 88, escalade 17, autonomie 100, climat 1, puissance IA 26, soupçon 2 | Unification humaine imparfaite (71) | aucune | Confédération fragile | instables: Russie / Eurasie autoritaire (60), Amérique latine (50); IA: Asie industrielle (84), Sud global émergent (84); tendus: Sud global émergent (100), Russie / Eurasie autoritaire (97) | Fin déclenchée : Confédération fragile. |
| Marché / dérégulation | 2085 | cohésion 0, escalade 91, autonomie 63, climat 100, puissance IA 100, soupçon 100 | Saturation systémique (91) | Escalade militaire (85), Réel climatique (81) | Escalade stratégique | instables: Amérique latine (80), Sud global émergent (79); IA: Amérique du Nord (100), Russie / Eurasie autoritaire (100); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Escalade stratégique. |
| Chaos contrôlé | 2085 | cohésion 99, escalade 95, autonomie 100, climat 44, puissance IA 92, soupçon 40 | Escalade militaire (67) | Unification humaine imparfaite (61) | Escalade stratégique | instables: Amérique latine (7), Sud global émergent (5); IA: Asie industrielle (70), Sud global émergent (67); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2085 | cohésion 97, escalade 7, autonomie 20, climat 57, puissance IA 100, soupçon 100 | Tutelle algorithmique (73) | aucune | Empire algorithmique | instables: Amérique latine (22), Sud global émergent (16); IA: Amérique du Nord (100), Russie / Eurasie autoritaire (100); tendus: Sud global émergent (39), Amérique du Nord (36) | Fin déclenchée : Empire algorithmique. |

## Anomalies observées

- Alignement mondial présente plusieurs jauges globales saturées à 50 tours.
- Empire algorithmique présente plusieurs jauges globales saturées à 50 tours.
- Autonomie humaine présente plusieurs jauges globales saturées à 50 tours.
- Sécurité présente plusieurs jauges globales saturées à 50 tours.
- Écologie / ralentissement présente plusieurs jauges globales saturées à 50 tours.
- Marché / dérégulation présente plusieurs jauges globales saturées à 50 tours.
- Chaos contrôlé présente plusieurs jauges globales saturées à 50 tours.
- Aléatoire seedé présente plusieurs jauges globales saturées à 50 tours.

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
