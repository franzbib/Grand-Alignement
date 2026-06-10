# Rapport de simulation des trajectoires

Date : 2026-06-10
Commit testé : f085239
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
| Empire algorithmique | 2040 | cohésion 79, escalade 25, autonomie 63, climat 64, puissance IA 63, soupçon 62 | Capture privée (53) | aucune | aucune | instables: Sud global émergent (43), Russie / Eurasie autoritaire (41); IA: Asie industrielle (61), Russie / Eurasie autoritaire (56); tendus: Russie / Eurasie autoritaire (54), Amérique latine (53) | Lecture dominante : Capture privée (53). |
| Autonomie humaine | 2040 | cohésion 73, escalade 29, autonomie 84, climat 61, puissance IA 33, soupçon 40 | Unification humaine imparfaite (56) | aucune | aucune | instables: Sud global émergent (44), Amérique latine (43); IA: Asie industrielle (58), Russie / Eurasie autoritaire (56); tendus: Sud global émergent (51), Amérique latine (50) | Lecture dominante : Unification humaine imparfaite (56). |
| Sécurité | 2040 | cohésion 82, escalade 5, autonomie 68, climat 63, puissance IA 54, soupçon 67 | Capture privée (53) | aucune | aucune | instables: Amérique latine (42), Sud global émergent (40); IA: Asie industrielle (65), Russie / Eurasie autoritaire (60); tendus: Amérique latine (50), Russie / Eurasie autoritaire (49) | Lecture dominante : Capture privée (53). |
| Écologie / ralentissement | 2040 | cohésion 69, escalade 29, autonomie 85, climat 39, puissance IA 33, soupçon 35 | Unification humaine imparfaite (55) | aucune | aucune | instables: Sud global émergent (49), Amérique latine (46); IA: Asie industrielle (65), Russie / Eurasie autoritaire (63); tendus: Sud global émergent (72), Amérique latine (61) | Lecture dominante : Unification humaine imparfaite (55). |
| Marché / dérégulation | 2040 | cohésion 77, escalade 26, autonomie 65, climat 65, puissance IA 63, soupçon 61 | Capture privée (53) | aucune | aucune | instables: Amérique latine (45), Sud global émergent (43); IA: Asie industrielle (66), Russie / Eurasie autoritaire (61); tendus: Russie / Eurasie autoritaire (53), Amérique latine (52) | Lecture dominante : Capture privée (53). |
| Chaos contrôlé | 2040 | cohésion 75, escalade 29, autonomie 85, climat 39, puissance IA 35, soupçon 43 | Unification humaine imparfaite (56) | aucune | aucune | instables: Sud global émergent (47), Amérique latine (44); IA: Asie industrielle (67), Russie / Eurasie autoritaire (65); tendus: Sud global émergent (71), Amérique latine (60) | Lecture dominante : Unification humaine imparfaite (56). |
| Aléatoire seedé | 2040 | cohésion 77, escalade 18, autonomie 75, climat 49, puissance IA 50, soupçon 28 | Unification humaine imparfaite (53) | aucune | aucune | instables: Sud global émergent (48), Amérique latine (45); IA: Asie industrielle (67), Russie / Eurasie autoritaire (62); tendus: Sud global émergent (68), Russie / Eurasie autoritaire (54) | Lecture dominante : Unification humaine imparfaite (53). |

## Résultats à 10 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2045 | cohésion 95, escalade 3, autonomie 77, climat 52, puissance IA 45, soupçon 54 | Unification humaine imparfaite (58) | aucune | aucune | instables: Amérique latine (37), Sud global émergent (34); IA: Asie industrielle (66), Russie / Eurasie autoritaire (61); tendus: Amérique latine (51), Russie / Eurasie autoritaire (50) | Lecture dominante : Unification humaine imparfaite (58). |
| Empire algorithmique | 2045 | cohésion 74, escalade 25, autonomie 62, climat 75, puissance IA 74, soupçon 52 | Capture privée (50) | aucune | aucune | instables: Russie / Eurasie autoritaire (41), Amérique latine (41); IA: Russie / Eurasie autoritaire (58), Asie industrielle (58); tendus: Russie / Eurasie autoritaire (53), Amérique latine (52) | Lecture dominante : Capture privée (50). |
| Autonomie humaine | 2045 | cohésion 73, escalade 34, autonomie 90, climat 70, puissance IA 29, soupçon 51 | Unification humaine imparfaite (57) | aucune | aucune | instables: Amérique latine (42), Sud global émergent (40); IA: Asie industrielle (51), Russie / Eurasie autoritaire (50); tendus: Russie / Eurasie autoritaire (50), Amérique latine (48) | Lecture dominante : Unification humaine imparfaite (57). |
| Sécurité | 2045 | cohésion 89, escalade 0, autonomie 75, climat 70, puissance IA 52, soupçon 52 | Unification humaine imparfaite (56) | aucune | aucune | instables: Amérique latine (38), Sud global émergent (36); IA: Asie industrielle (63), Russie / Eurasie autoritaire (58); tendus: Amérique latine (46), Russie / Eurasie autoritaire (44) | Lecture dominante : Unification humaine imparfaite (56). |
| Écologie / ralentissement | 2045 | cohésion 73, escalade 25, autonomie 94, climat 30, puissance IA 29, soupçon 46 | Unification humaine imparfaite (59) | aucune | aucune | instables: Sud global émergent (52), Amérique latine (44); IA: Asie industrielle (63), Russie / Eurasie autoritaire (62); tendus: Sud global émergent (80), Amérique latine (69) | Lecture dominante : Unification humaine imparfaite (59). |
| Marché / dérégulation | 2045 | cohésion 71, escalade 26, autonomie 70, climat 80, puissance IA 71, soupçon 51 | Réel climatique (56) | aucune | aucune | instables: Amérique latine (45), Sud global émergent (43); IA: Asie industrielle (60), Russie / Eurasie autoritaire (55); tendus: Russie / Eurasie autoritaire (65), Amérique latine (58) | Lecture dominante : Réel climatique (56). |
| Chaos contrôlé | 2045 | cohésion 82, escalade 24, autonomie 90, climat 43, puissance IA 36, soupçon 51 | Unification humaine imparfaite (59) | aucune | aucune | instables: Sud global émergent (48), Amérique latine (40); IA: Asie industrielle (61), Russie / Eurasie autoritaire (60); tendus: Sud global émergent (81), Amérique latine (70) | Lecture dominante : Unification humaine imparfaite (59). |
| Aléatoire seedé | 2045 | cohésion 93, escalade 7, autonomie 67, climat 56, puissance IA 66, soupçon 50 | Unification humaine imparfaite (53) | aucune | aucune | instables: Sud global émergent (41), Amérique latine (38); IA: Asie industrielle (72), Russie / Eurasie autoritaire (66); tendus: Sud global émergent (65), Russie / Eurasie autoritaire (46) | Lecture dominante : Unification humaine imparfaite (53). |

## Résultats à 30 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2065 | cohésion 98, escalade 0, autonomie 91, climat 72, puissance IA 54, soupçon 48 | Unification humaine imparfaite (64) | aucune | aucune | instables: Amérique latine (16), Sud global émergent (13); IA: Russie / Eurasie autoritaire (73), Asie industrielle (72); tendus: Amérique du Nord (37), Europe (37) | Lecture dominante : Unification humaine imparfaite (64). |
| Empire algorithmique | 2065 | cohésion 49, escalade 35, autonomie 49, climat 86, puissance IA 92, soupçon 67 | Réel climatique (64) | aucune | Révolte humaine | instables: Russie / Eurasie autoritaire (43), Sud global émergent (29); IA: Amérique latine (64), Sud global émergent (62); tendus: Amérique du Nord (62), Russie / Eurasie autoritaire (61) | Fin déclenchée : Révolte humaine. |
| Autonomie humaine | 2065 | cohésion 60, escalade 42, autonomie 100, climat 91, puissance IA 13, soupçon 56 | Réel climatique (70) | Résistance humaine (62) | aucune | instables: Amérique latine (44), Russie / Eurasie autoritaire (42); IA: Russie / Eurasie autoritaire (39), Asie industrielle (37); tendus: Russie / Eurasie autoritaire (67), Amérique latine (67) | Lecture dominante : Réel climatique (70). |
| Sécurité | 2065 | cohésion 100, escalade 0, autonomie 91, climat 86, puissance IA 51, soupçon 53 | Unification humaine imparfaite (68) | Réel climatique (64) | aucune | instables: Amérique latine (21), Sud global émergent (17); IA: Asie industrielle (75), Russie / Eurasie autoritaire (70); tendus: Amérique latine (44), Sud global émergent (35) | Lecture dominante : Unification humaine imparfaite (68). |
| Écologie / ralentissement | 2065 | cohésion 73, escalade 23, autonomie 100, climat 9, puissance IA 13, soupçon 54 | Résistance humaine (69) | Unification humaine imparfaite (62) | aucune | instables: Sud global émergent (74), Amérique latine (65); IA: Asie industrielle (67), Russie / Eurasie autoritaire (59); tendus: Russie / Eurasie autoritaire (100), Sud global émergent (100) | Lecture dominante : Résistance humaine (69). |
| Marché / dérégulation | 2065 | cohésion 41, escalade 32, autonomie 95, climat 100, puissance IA 92, soupçon 59 | Réel climatique (81) | Saturation systémique (63) | aucune | instables: Russie / Eurasie autoritaire (62), Amérique latine (62); IA: Asie industrielle (43), Sud global émergent (40); tendus: Amérique latine (99), Russie / Eurasie autoritaire (96) | Lecture dominante : Réel climatique (81). |
| Chaos contrôlé | 2065 | cohésion 91, escalade 66, autonomie 100, climat 68, puissance IA 60, soupçon 59 | Résistance humaine (62) | Unification humaine imparfaite (61) | aucune | instables: Sud global émergent (54), Amérique latine (46); IA: Asie industrielle (59), Russie / Eurasie autoritaire (57); tendus: Sud global émergent (100), Amérique latine (100) | Lecture dominante : Résistance humaine (62). |
| Aléatoire seedé | 2065 | cohésion 88, escalade 12, autonomie 73, climat 70, puissance IA 84, soupçon 47 | Capture privée (50) | aucune | aucune | instables: Sud global émergent (36), Russie / Eurasie autoritaire (29); IA: Asie industrielle (62), Russie / Eurasie autoritaire (59); tendus: Sud global émergent (86), Amérique latine (58) | Lecture dominante : Capture privée (50). |

## Résultats à 50 tours

| Profil | Année | Jauges globales | Trajectoire dominante | Secondaires | Fin | Blocs à surveiller | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alignement mondial | 2085 | cohésion 100, escalade 0, autonomie 100, climat 91, puissance IA 66, soupçon 68 | Réel climatique (70) | Unification humaine imparfaite (64) | aucune | instables: Amérique du Nord (0), Europe (0); IA: Russie / Eurasie autoritaire (81), Asie industrielle (80); tendus: Amérique latine (60), Sud global émergent (48) | Lecture dominante : Réel climatique (70). |
| Empire algorithmique | 2085 | cohésion 49, escalade 35, autonomie 49, climat 86, puissance IA 92, soupçon 67 | Réel climatique (64) | aucune | Révolte humaine | instables: Russie / Eurasie autoritaire (43), Sud global émergent (29); IA: Amérique latine (64), Sud global émergent (62); tendus: Amérique du Nord (62), Russie / Eurasie autoritaire (61) | Fin déclenchée : Révolte humaine. |
| Autonomie humaine | 2085 | cohésion 60, escalade 44, autonomie 100, climat 94, puissance IA 12, soupçon 63 | Réel climatique (74) | Résistance humaine (69) | aucune | instables: Russie / Eurasie autoritaire (58), Amérique latine (53); IA: Russie / Eurasie autoritaire (21), Asie industrielle (19); tendus: Russie / Eurasie autoritaire (84), Sud global émergent (77) | Lecture dominante : Réel climatique (74). |
| Sécurité | 2085 | cohésion 100, escalade 0, autonomie 99, climat 92, puissance IA 50, soupçon 62 | Unification humaine imparfaite (73) | Réel climatique (71) | aucune | instables: Amérique latine (3), Amérique du Nord (0); IA: Russie / Eurasie autoritaire (76), Asie industrielle (75); tendus: Sud global émergent (42), Amérique latine (39) | Lecture dominante : Unification humaine imparfaite (73). |
| Écologie / ralentissement | 2085 | cohésion 82, escalade 22, autonomie 100, climat 10, puissance IA 14, soupçon 46 | Résistance humaine (66) | Unification humaine imparfaite (65) | Confédération fragile | instables: Sud global émergent (78), Amérique latine (70); IA: Asie industrielle (65), Russie / Eurasie autoritaire (61); tendus: Russie / Eurasie autoritaire (100), Sud global émergent (100) | Fin déclenchée : Confédération fragile. |
| Marché / dérégulation | 2085 | cohésion 10, escalade 73, autonomie 100, climat 100, puissance IA 100, soupçon 60 | Saturation systémique (86) | Réel climatique (81), Escalade militaire (73) | aucune | instables: Russie / Eurasie autoritaire (83), Amérique latine (83); IA: Asie industrielle (39), Sud global émergent (31); tendus: Amérique du Nord (100), Russie / Eurasie autoritaire (100) | Le risque stratégique domine la lecture du monde. |
| Chaos contrôlé | 2085 | cohésion 98, escalade 88, autonomie 100, climat 80, puissance IA 69, soupçon 59 | Escalade militaire (64) | Unification humaine imparfaite (61), Résistance humaine (60) | Escalade stratégique | instables: Sud global émergent (56), Amérique latine (48); IA: Asie industrielle (58), Russie / Eurasie autoritaire (52); tendus: Russie / Eurasie autoritaire (100), Sud global émergent (100) | Fin déclenchée : Escalade stratégique. |
| Aléatoire seedé | 2085 | cohésion 85, escalade 5, autonomie 73, climat 89, puissance IA 94, soupçon 53 | Réel climatique (68) | aucune | aucune | instables: Sud global émergent (47), Amérique du Nord (14); IA: Asie industrielle (67), Russie / Eurasie autoritaire (59); tendus: Sud global émergent (100), Amérique du Nord (66) | Lecture dominante : Réel climatique (68). |

## Anomalies observées

- Alignement mondial présente plusieurs jauges globales saturées à 50 tours.
- Sécurité présente plusieurs jauges globales saturées à 50 tours.
- Marché / dérégulation présente plusieurs jauges globales saturées à 50 tours.
- Chaos contrôlé présente plusieurs jauges globales saturées à 50 tours.

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
