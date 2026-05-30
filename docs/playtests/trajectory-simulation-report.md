# Rapport de simulation des trajectoires

Date : 2026-05-30
Commit testé : 1134c7f
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
| Empire algorithmique | 2040 | cohésion 100, escalade 18, autonomie 57, climat 39, puissance IA 58, soupçon 38 | Capture privée (54) | aucune | aucune | instables: Russie / Eurasie autoritaire (34), Sud global émergent (32); IA: Asie industrielle (89), Russie / Eurasie autoritaire (80); tendus: Sud global émergent (51), Amérique latine (50) | Lecture dominante : Capture privée (54). |
| Autonomie humaine | 2040 | cohésion 88, escalade 26, autonomie 91, climat 61, puissance IA 35, soupçon 15 | Unification humaine imparfaite (66) | aucune | aucune | instables: Sud global émergent (41), Amérique latine (37); IA: Asie industrielle (60), Russie / Eurasie autoritaire (59); tendus: Sud global émergent (46), Amérique latine (40) | Lecture dominante : Unification humaine imparfaite (66). |
| Sécurité | 2040 | cohésion 100, escalade 0, autonomie 68, climat 39, puissance IA 44, soupçon 31 | Unification humaine imparfaite (60) | aucune | aucune | instables: Russie / Eurasie autoritaire (32), Sud global émergent (32); IA: Asie industrielle (78), Russie / Eurasie autoritaire (73); tendus: Sud global émergent (51), Russie / Eurasie autoritaire (47) | Lecture dominante : Unification humaine imparfaite (60). |
| Écologie / ralentissement | 2040 | cohésion 81, escalade 26, autonomie 99, climat 21, puissance IA 35, soupçon 10 | Unification humaine imparfaite (67) | aucune | aucune | instables: Russie / Eurasie autoritaire (42), Amérique latine (41); IA: Asie industrielle (72), Russie / Eurasie autoritaire (71); tendus: Sud global émergent (73), Amérique latine (65) | Lecture dominante : Unification humaine imparfaite (67). |
| Marché / dérégulation | 2040 | cohésion 100, escalade 18, autonomie 57, climat 39, puissance IA 58, soupçon 38 | Capture privée (54) | aucune | aucune | instables: Russie / Eurasie autoritaire (34), Sud global émergent (32); IA: Asie industrielle (89), Russie / Eurasie autoritaire (80); tendus: Sud global émergent (51), Amérique latine (50) | Lecture dominante : Capture privée (54). |
| Chaos contrôlé | 2040 | cohésion 97, escalade 22, autonomie 99, climat 23, puissance IA 39, soupçon 12 | Unification humaine imparfaite (71) | aucune | aucune | instables: Russie / Eurasie autoritaire (36), Amérique latine (35); IA: Asie industrielle (74), Russie / Eurasie autoritaire (73); tendus: Sud global émergent (67), Amérique latine (59) | Lecture dominante : Unification humaine imparfaite (71). |
| Aléatoire seedé | 2040 | cohésion 100, escalade 13, autonomie 78, climat 45, puissance IA 51, soupçon 23 | Unification humaine imparfaite (62) | aucune | aucune | instables: Amérique latine (33), Sud global émergent (31); IA: Asie industrielle (86), Russie / Eurasie autoritaire (81); tendus: Sud global émergent (47), Russie / Eurasie autoritaire (44) | Lecture dominante : Unification humaine imparfaite (62). |

## Résultats à 10 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2045 | cohésion 100, escalade 0, autonomie 68, climat 44, puissance IA 68, soupçon 45 | Tutelle algorithmique (56) | aucune | aucune | instables: Amérique latine (6), Sud global émergent (3); IA: Asie industrielle (100), Russie / Eurasie autoritaire (99); tendus: Sud global émergent (23), Amérique latine (22) | Lecture dominante : Tutelle algorithmique (56). |
| Empire algorithmique | 2045 | cohésion 94, escalade 12, autonomie 3, climat 44, puissance IA 100, soupçon 100 | Tutelle algorithmique (79) | aucune | aucune | instables: Amérique latine (27), Russie / Eurasie autoritaire (26); IA: Amérique du Nord (100), Russie / Eurasie autoritaire (100); tendus: Sud global émergent (28), Amérique latine (26) | Dépossession algorithmique très lisible, sans forcément produire une fin immédiate. |
| Autonomie humaine | 2045 | cohésion 94, escalade 25, autonomie 100, climat 70, puissance IA 34, soupçon 12 | Unification humaine imparfaite (71) | aucune | aucune | instables: Sud global émergent (35), Amérique latine (35); IA: Asie industrielle (56), Russie / Eurasie autoritaire (55); tendus: Russie / Eurasie autoritaire (35), Sud global émergent (35) | Lecture dominante : Unification humaine imparfaite (71). |
| Sécurité | 2045 | cohésion 100, escalade 0, autonomie 68, climat 44, puissance IA 54, soupçon 46 | Unification humaine imparfaite (60) | aucune | aucune | instables: Sud global émergent (12), Amérique latine (11); IA: Asie industrielle (98), Russie / Eurasie autoritaire (93); tendus: Sud global émergent (31), Russie / Eurasie autoritaire (17) | Lecture dominante : Unification humaine imparfaite (60). |
| Écologie / ralentissement | 2045 | cohésion 84, escalade 21, autonomie 100, climat 1, puissance IA 30, soupçon 6 | Unification humaine imparfaite (69) | aucune | aucune | instables: Russie / Eurasie autoritaire (52), Amérique latine (46); IA: Asie industrielle (76), Sud global émergent (76); tendus: Sud global émergent (92), Russie / Eurasie autoritaire (81) | Lecture dominante : Unification humaine imparfaite (69). |
| Marché / dérégulation | 2045 | cohésion 91, escalade 15, autonomie 44, climat 64, puissance IA 99, soupçon 77 | Tutelle algorithmique (70) | Capture privée (60) | aucune | instables: Sud global émergent (28), Amérique latine (27); IA: Russie / Eurasie autoritaire (100), Asie industrielle (100); tendus: Sud global émergent (73), Amérique latine (70) | Lecture dominante : Tutelle algorithmique (70). |
| Chaos contrôlé | 2045 | cohésion 86, escalade 16, autonomie 98, climat 25, puissance IA 50, soupçon 16 | Unification humaine imparfaite (65) | aucune | aucune | instables: Russie / Eurasie autoritaire (33), Amérique latine (30); IA: Asie industrielle (76), Russie / Eurasie autoritaire (75); tendus: Sud global émergent (92), Amérique du Nord (79) | Lecture dominante : Unification humaine imparfaite (65). |
| Aléatoire seedé | 2045 | cohésion 100, escalade 1, autonomie 68, climat 44, puissance IA 77, soupçon 52 | Tutelle algorithmique (58) | aucune | aucune | instables: Amérique latine (15), Russie / Eurasie autoritaire (12); IA: Russie / Eurasie autoritaire (99), Asie industrielle (99); tendus: Sud global émergent (24), Amérique du Nord (23) | Lecture dominante : Tutelle algorithmique (58). |

## Résultats à 30 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2065 | cohésion 100, escalade 0, autonomie 70, climat 48, puissance IA 84, soupçon 70 | Tutelle algorithmique (58) | aucune | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Europe (98); tendus: Sud global émergent (4), Amérique latine (3) | Fin déclenchée : Confédération fragile. |
| Empire algorithmique | 2065 | cohésion 97, escalade 8, autonomie 0, climat 48, puissance IA 100, soupçon 100 | Tutelle algorithmique (80) | aucune | Empire algorithmique | instables: Amérique latine (13), Russie / Eurasie autoritaire (11); IA: Amérique du Nord (100), Europe (100); tendus: Sud global émergent (9), Amérique du Nord (6) | Fin déclenchée : Empire algorithmique. |
| Autonomie humaine | 2065 | cohésion 94, escalade 25, autonomie 100, climat 78, puissance IA 34, soupçon 4 | Unification humaine imparfaite (71) | aucune | Confédération fragile | instables: Sud global émergent (35), Amérique latine (35); IA: Asie industrielle (56), Russie / Eurasie autoritaire (51); tendus: Sud global émergent (41), Russie / Eurasie autoritaire (40) | Fin déclenchée : Confédération fragile. |
| Sécurité | 2065 | cohésion 100, escalade 0, autonomie 69, climat 48, puissance IA 62, soupçon 67 | Unification humaine imparfaite (59) | aucune | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Russie / Eurasie autoritaire (98); tendus: Sud global émergent (16), Amérique du Nord (0) | Fin déclenchée : Confédération fragile. |
| Écologie / ralentissement | 2065 | cohésion 88, escalade 17, autonomie 100, climat 1, puissance IA 26, soupçon 2 | Unification humaine imparfaite (71) | aucune | Confédération fragile | instables: Russie / Eurasie autoritaire (60), Amérique latine (50); IA: Asie industrielle (84), Sud global émergent (84); tendus: Sud global émergent (100), Russie / Eurasie autoritaire (97) | Fin déclenchée : Confédération fragile. |
| Marché / dérégulation | 2065 | cohésion 86, escalade 19, autonomie 19, climat 100, puissance IA 100, soupçon 100 | Réel climatique (81) | Tutelle algorithmique (74), Capture privée (65) | Empire algorithmique | instables: Sud global émergent (36), Amérique latine (34); IA: Amérique du Nord (100), Europe (100); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Empire algorithmique. |
| Chaos contrôlé | 2065 | cohésion 99, escalade 95, autonomie 100, climat 44, puissance IA 92, soupçon 40 | Escalade militaire (67) | Unification humaine imparfaite (61) | Escalade stratégique | instables: Amérique latine (7), Sud global émergent (5); IA: Asie industrielle (70), Sud global émergent (67); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2065 | cohésion 98, escalade 0, autonomie 59, climat 41, puissance IA 99, soupçon 93 | Tutelle algorithmique (63) | aucune | Confédération fragile | instables: Amérique latine (8), Russie / Eurasie autoritaire (1); IA: Europe (98), Russie / Eurasie autoritaire (98); tendus: Amérique du Nord (12), Europe (10) | Fin déclenchée : Confédération fragile. |

## Résultats à 50 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2085 | cohésion 100, escalade 0, autonomie 70, climat 48, puissance IA 84, soupçon 70 | Tutelle algorithmique (58) | aucune | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Europe (98); tendus: Sud global émergent (4), Amérique latine (3) | Fin déclenchée : Confédération fragile. |
| Empire algorithmique | 2085 | cohésion 97, escalade 8, autonomie 0, climat 48, puissance IA 100, soupçon 100 | Tutelle algorithmique (80) | aucune | Empire algorithmique | instables: Amérique latine (13), Russie / Eurasie autoritaire (11); IA: Amérique du Nord (100), Europe (100); tendus: Sud global émergent (9), Amérique du Nord (6) | Fin déclenchée : Empire algorithmique. |
| Autonomie humaine | 2085 | cohésion 94, escalade 25, autonomie 100, climat 78, puissance IA 34, soupçon 4 | Unification humaine imparfaite (71) | aucune | Confédération fragile | instables: Sud global émergent (35), Amérique latine (35); IA: Asie industrielle (56), Russie / Eurasie autoritaire (51); tendus: Sud global émergent (41), Russie / Eurasie autoritaire (40) | Fin déclenchée : Confédération fragile. |
| Sécurité | 2085 | cohésion 100, escalade 0, autonomie 69, climat 48, puissance IA 62, soupçon 67 | Unification humaine imparfaite (59) | aucune | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Russie / Eurasie autoritaire (98); tendus: Sud global émergent (16), Amérique du Nord (0) | Fin déclenchée : Confédération fragile. |
| Écologie / ralentissement | 2085 | cohésion 88, escalade 17, autonomie 100, climat 1, puissance IA 26, soupçon 2 | Unification humaine imparfaite (71) | aucune | Confédération fragile | instables: Russie / Eurasie autoritaire (60), Amérique latine (50); IA: Asie industrielle (84), Sud global émergent (84); tendus: Sud global émergent (100), Russie / Eurasie autoritaire (97) | Fin déclenchée : Confédération fragile. |
| Marché / dérégulation | 2085 | cohésion 86, escalade 19, autonomie 19, climat 100, puissance IA 100, soupçon 100 | Réel climatique (81) | Tutelle algorithmique (74), Capture privée (65) | Empire algorithmique | instables: Sud global émergent (36), Amérique latine (34); IA: Amérique du Nord (100), Europe (100); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Empire algorithmique. |
| Chaos contrôlé | 2085 | cohésion 99, escalade 95, autonomie 100, climat 44, puissance IA 92, soupçon 40 | Escalade militaire (67) | Unification humaine imparfaite (61) | Escalade stratégique | instables: Amérique latine (7), Sud global émergent (5); IA: Asie industrielle (70), Sud global émergent (67); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2085 | cohésion 98, escalade 0, autonomie 59, climat 41, puissance IA 99, soupçon 93 | Tutelle algorithmique (63) | aucune | Confédération fragile | instables: Amérique latine (8), Russie / Eurasie autoritaire (1); IA: Europe (98), Russie / Eurasie autoritaire (98); tendus: Amérique du Nord (12), Europe (10) | Fin déclenchée : Confédération fragile. |

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
