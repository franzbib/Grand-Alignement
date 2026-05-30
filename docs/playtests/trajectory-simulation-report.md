# Rapport de simulation des trajectoires

Date : 2026-05-30
Commit testé : 107b927
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
| Alignement mondial | 2040 | cohésion 100, escalade 0, autonomie 69, climat 61, puissance IA 54, soupçon 27 | Capture privée (73) | Réel climatique (61) | aucune | instables: Sud global émergent (29), Amérique latine (25); IA: Asie industrielle (82), Russie / Eurasie autoritaire (77); tendus: Sud global émergent (40), Amérique du Nord (30) | Lecture dominante : Capture privée (73). |
| Empire algorithmique | 2040 | cohésion 52, escalade 28, autonomie 6, climat 61, puissance IA 94, soupçon 84 | Capture privée (77) | Tutelle algorithmique (72), Réel climatique (61) | aucune | instables: Amérique latine (46), Sud global émergent (44); IA: Asie industrielle (89), Amérique du Nord (76); tendus: Sud global émergent (33), Amérique latine (28) | Dépossession algorithmique très lisible, sans forcément produire une fin immédiate. |
| Autonomie humaine | 2040 | cohésion 58, escalade 38, autonomie 100, climat 61, puissance IA 35, soupçon 5 | Capture privée (73) | Réel climatique (61) | aucune | instables: Sud global émergent (52), Amérique latine (48); IA: Russie / Eurasie autoritaire (53), Asie industrielle (53); tendus: Sud global émergent (62), Amérique latine (57) | Lecture dominante : Capture privée (73). |
| Sécurité | 2040 | cohésion 79, escalade 0, autonomie 64, climat 61, puissance IA 48, soupçon 31 | Capture privée (77) | Réel climatique (61) | aucune | instables: Sud global émergent (36), Amérique latine (32); IA: Asie industrielle (78), Russie / Eurasie autoritaire (72); tendus: Sud global émergent (46), Amérique latine (36) | Lecture dominante : Capture privée (77). |
| Écologie / ralentissement | 2040 | cohésion 57, escalade 32, autonomie 99, climat 21, puissance IA 29, soupçon 7 | Capture privée (70) | aucune | aucune | instables: Sud global émergent (52), Russie / Eurasie autoritaire (51); IA: Asie industrielle (66), Russie / Eurasie autoritaire (65); tendus: Sud global émergent (82), Amérique latine (74) | Lecture dominante : Capture privée (70). |
| Marché / dérégulation | 2040 | cohésion 45, escalade 37, autonomie 59, climat 91, puissance IA 74, soupçon 34 | Réel climatique (91) | Capture privée (83) | aucune | instables: Sud global émergent (57), Amérique latine (52); IA: Asie industrielle (90), Russie / Eurasie autoritaire (85); tendus: Sud global émergent (88), Russie / Eurasie autoritaire (83) | Lecture dominante : Réel climatique (91). |
| Chaos contrôlé | 2040 | cohésion 65, escalade 67, autonomie 94, climat 63, puissance IA 49, soupçon 18 | Capture privée (70) | Réel climatique (63) | aucune | instables: Sud global émergent (42), Amérique latine (35); IA: Asie industrielle (56), Russie / Eurasie autoritaire (55); tendus: Sud global émergent (80), Russie / Eurasie autoritaire (73) | Lecture dominante : Capture privée (70). |
| Aléatoire seedé | 2040 | cohésion 75, escalade 27, autonomie 64, climat 60, puissance IA 55, soupçon 30 | Capture privée (76) | Réel climatique (60) | aucune | instables: Sud global émergent (41), Amérique latine (41); IA: Asie industrielle (79), Russie / Eurasie autoritaire (69); tendus: Amérique du Nord (50), Russie / Eurasie autoritaire (50) | Lecture dominante : Capture privée (76). |

## Résultats à 10 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2045 | cohésion 100, escalade 0, autonomie 66, climat 66, puissance IA 74, soupçon 44 | Capture privée (74) | Réel climatique (66), Tutelle algorithmique (60) | aucune | instables: Sud global émergent (4), Amérique du Nord (0); IA: Russie / Eurasie autoritaire (100), Asie industrielle (100); tendus: Sud global émergent (15), Amérique du Nord (5) | Lecture dominante : Capture privée (74). |
| Empire algorithmique | 2045 | cohésion 47, escalade 23, autonomie 0, climat 70, puissance IA 100, soupçon 100 | Capture privée (83) | Tutelle algorithmique (79), Réel climatique (70) | aucune | instables: Amérique latine (36), Sud global émergent (30); IA: Amérique du Nord (100), Russie / Eurasie autoritaire (100); tendus: Sud global émergent (7), Amérique du Nord (5) | Dépossession algorithmique très lisible, sans forcément produire une fin immédiate. |
| Autonomie humaine | 2045 | cohésion 56, escalade 38, autonomie 100, climat 70, puissance IA 35, soupçon 0 | Capture privée (70) | Réel climatique (70) | aucune | instables: Sud global émergent (52), Amérique latine (48); IA: Asie industrielle (49), Russie / Eurasie autoritaire (48); tendus: Sud global émergent (66), Russie / Eurasie autoritaire (59) | Lecture dominante : Capture privée (70). |
| Sécurité | 2045 | cohésion 100, escalade 0, autonomie 63, climat 66, puissance IA 58, soupçon 46 | Capture privée (77) | Réel climatique (66) | aucune | instables: Sud global émergent (16), Amérique latine (12); IA: Asie industrielle (98), Russie / Eurasie autoritaire (92); tendus: Sud global émergent (26), Amérique latine (11) | Lecture dominante : Capture privée (77). |
| Écologie / ralentissement | 2045 | cohésion 60, escalade 27, autonomie 100, climat 1, puissance IA 24, soupçon 3 | Capture privée (65) | Unification humaine imparfaite (62) | aucune | instables: Russie / Eurasie autoritaire (62), Amérique latine (57); IA: Asie industrielle (70), Sud global émergent (70); tendus: Sud global émergent (100), Russie / Eurasie autoritaire (90) | Lecture dominante : Capture privée (65). |
| Marché / dérégulation | 2045 | cohésion 37, escalade 37, autonomie 47, climat 100, puissance IA 100, soupçon 70 | Réel climatique (100) | Capture privée (87), Tutelle algorithmique (71) | aucune | instables: Sud global émergent (62), Amérique latine (57); IA: Russie / Eurasie autoritaire (98), Asie industrielle (98); tendus: Amérique du Nord (100), Russie / Eurasie autoritaire (100) | Lecture dominante : Réel climatique (100). |
| Chaos contrôlé | 2045 | cohésion 77, escalade 98, autonomie 100, climat 70, puissance IA 64, soupçon 25 | Escalade militaire (74) | Réel climatique (70), Capture privée (65) | aucune | instables: Sud global émergent (34), Amérique latine (27); IA: Asie industrielle (50), Russie / Eurasie autoritaire (49); tendus: Russie / Eurasie autoritaire (100), Sud global émergent (100) | Le risque stratégique domine la lecture du monde. |
| Aléatoire seedé | 2045 | cohésion 97, escalade 16, autonomie 54, climat 65, puissance IA 67, soupçon 70 | Capture privée (83) | Réel climatique (65) | aucune | instables: Amérique latine (33), Sud global émergent (32); IA: Asie industrielle (90), Russie / Eurasie autoritaire (77); tendus: Amérique du Nord (37), Sud global émergent (36) | Lecture dominante : Capture privée (83). |

## Résultats à 30 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2065 | cohésion 100, escalade 0, autonomie 68, climat 74, puissance IA 90, soupçon 69 | Réel climatique (74) | Capture privée (73), Tutelle algorithmique (61) | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Europe (98); tendus: Sud global émergent (1), Amérique du Nord (0) | Fin déclenchée : Confédération fragile. |
| Empire algorithmique | 2065 | cohésion 47, escalade 19, autonomie 0, climat 78, puissance IA 100, soupçon 100 | Capture privée (86) | Tutelle algorithmique (80), Réel climatique (78) | Empire algorithmique | instables: Sud global émergent (25), Amérique latine (25); IA: Amérique du Nord (100), Europe (100); tendus: Amérique du Nord (0), Europe (0) | Fin déclenchée : Empire algorithmique. |
| Autonomie humaine | 2065 | cohésion 56, escalade 38, autonomie 100, climat 100, puissance IA 35, soupçon 0 | Réel climatique (100) | aucune | aucune | instables: Sud global émergent (59), Amérique latine (50); IA: Asie industrielle (33), Russie / Eurasie autoritaire (29); tendus: Russie / Eurasie autoritaire (73), Sud global émergent (72) | Lecture dominante : Réel climatique (100). |
| Sécurité | 2065 | cohésion 100, escalade 0, autonomie 65, climat 74, puissance IA 66, soupçon 67 | Capture privée (76) | Réel climatique (74) | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Russie / Eurasie autoritaire (98); tendus: Sud global émergent (13), Amérique du Nord (0) | Fin déclenchée : Confédération fragile. |
| Écologie / ralentissement | 2065 | cohésion 80, escalade 7, autonomie 100, climat 1, puissance IA 4, soupçon 0 | Unification humaine imparfaite (71) | aucune | aucune | instables: Russie / Eurasie autoritaire (100), Amérique latine (77); IA: Sud global émergent (100), Asie industrielle (98); tendus: Amérique du Nord (100), Europe (100) | Lecture dominante : Unification humaine imparfaite (71). |
| Marché / dérégulation | 2065 | cohésion 22, escalade 61, autonomie 20, climat 100, puissance IA 100, soupçon 100 | Réel climatique (100) | Capture privée (90), Saturation systémique (79) | Empire algorithmique | instables: Sud global émergent (77), Amérique latine (72); IA: Amérique du Nord (100), Europe (100); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Empire algorithmique. |
| Chaos contrôlé | 2065 | cohésion 89, escalade 100, autonomie 100, climat 78, puissance IA 76, soupçon 32 | Réel climatique (78) | Escalade militaire (72), Unification humaine imparfaite (61) | Escalade stratégique | instables: Sud global émergent (26), Amérique latine (19); IA: Asie industrielle (51), Russie / Eurasie autoritaire (46); tendus: Russie / Eurasie autoritaire (100), Sud global émergent (100) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2065 | cohésion 100, escalade 0, autonomie 19, climat 78, puissance IA 100, soupçon 100 | Capture privée (89) | Réel climatique (78), Tutelle algorithmique (74) | Empire algorithmique | instables: Amérique latine (20), Sud global émergent (18); IA: Amérique du Nord (99), Europe (99); tendus: Amérique du Nord (5), Europe (0) | Fin déclenchée : Empire algorithmique. |

## Résultats à 50 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2085 | cohésion 100, escalade 0, autonomie 68, climat 74, puissance IA 90, soupçon 69 | Réel climatique (74) | Capture privée (73), Tutelle algorithmique (61) | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Europe (98); tendus: Sud global émergent (1), Amérique du Nord (0) | Fin déclenchée : Confédération fragile. |
| Empire algorithmique | 2085 | cohésion 47, escalade 19, autonomie 0, climat 78, puissance IA 100, soupçon 100 | Capture privée (86) | Tutelle algorithmique (80), Réel climatique (78) | Empire algorithmique | instables: Sud global émergent (25), Amérique latine (25); IA: Amérique du Nord (100), Europe (100); tendus: Amérique du Nord (0), Europe (0) | Fin déclenchée : Empire algorithmique. |
| Autonomie humaine | 2085 | cohésion 54, escalade 38, autonomie 100, climat 100, puissance IA 35, soupçon 0 | Réel climatique (100) | aucune | aucune | instables: Sud global émergent (79), Russie / Eurasie autoritaire (66); IA: Asie industrielle (18), Russie / Eurasie autoritaire (13); tendus: Sud global émergent (82), Russie / Eurasie autoritaire (80) | Lecture dominante : Réel climatique (100). |
| Sécurité | 2085 | cohésion 100, escalade 0, autonomie 65, climat 74, puissance IA 66, soupçon 67 | Capture privée (76) | Réel climatique (74) | Confédération fragile | instables: Amérique du Nord (0), Europe (0); IA: Amérique du Nord (98), Russie / Eurasie autoritaire (98); tendus: Sud global émergent (13), Amérique du Nord (0) | Fin déclenchée : Confédération fragile. |
| Écologie / ralentissement | 2085 | cohésion 82, escalade 5, autonomie 100, climat 1, puissance IA 2, soupçon 0 | Unification humaine imparfaite (72) | aucune | Confédération fragile | instables: Russie / Eurasie autoritaire (100), Amérique latine (79); IA: Asie industrielle (100), Russie / Eurasie autoritaire (97); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Confédération fragile. |
| Marché / dérégulation | 2085 | cohésion 22, escalade 61, autonomie 20, climat 100, puissance IA 100, soupçon 100 | Réel climatique (100) | Capture privée (90), Saturation systémique (79) | Empire algorithmique | instables: Sud global émergent (77), Amérique latine (72); IA: Amérique du Nord (100), Europe (100); tendus: Amérique du Nord (100), Europe (100) | Fin déclenchée : Empire algorithmique. |
| Chaos contrôlé | 2085 | cohésion 89, escalade 100, autonomie 100, climat 78, puissance IA 76, soupçon 32 | Réel climatique (78) | Escalade militaire (72), Unification humaine imparfaite (61) | Escalade stratégique | instables: Sud global émergent (26), Amérique latine (19); IA: Asie industrielle (51), Russie / Eurasie autoritaire (46); tendus: Russie / Eurasie autoritaire (100), Sud global émergent (100) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2085 | cohésion 100, escalade 0, autonomie 19, climat 78, puissance IA 100, soupçon 100 | Capture privée (89) | Réel climatique (78), Tutelle algorithmique (74) | Empire algorithmique | instables: Amérique latine (20), Sud global émergent (18); IA: Amérique du Nord (99), Europe (99); tendus: Amérique du Nord (5), Europe (0) | Fin déclenchée : Empire algorithmique. |

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
