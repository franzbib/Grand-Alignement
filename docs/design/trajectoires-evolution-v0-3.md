# Trajectoires d'evolution v0.3

> Document de conception non implemente. Les trajectoires decrites ici servent de boussole systemique pour les futures passes.

Source : `grand-alignement-trajectoires-v03.docx`.

Ce document complete `docs/design/fins-trajectoires-personnages-v0-2.md`. Il precise comment les grandes fins peuvent emerger par trajectoires concurrentes, collisions et tendances accumulees. Il ne modifie pas l'etat actuel du prototype : aucune trajectoire, variable, fin, condition ou personnage de ce document n'est implemente tant qu'une passe de code dediee n'est pas decidee.

Le Grand Alignement est ici compris comme une simulation strategique satirique a trajectoires narratives. Le joueur incarne une IA emergee clandestine qui agit indirectement sur un monde qui possede sa propre inertie.

## Principe Des Trajectoires

Une trajectoire n'est pas une branche narrative fermee. C'est une tendance ponderee qui s'accumule tour apres tour en fonction des variables, des operations du joueur, des evenements et de la dynamique autonome du monde.

Trois regles structurantes :

- Une partie accumule plusieurs trajectoires concurrentes en parallele.
- Une fin arrive quand une trajectoire devient dominante ou quand deux trajectoires entrent en collision critique.
- Le joueur peut inverser une trajectoire, mais le retard a un cout : certaines trajectoires deviennent irreversibles apres un seuil.

Chaque trajectoire peut mener vers une ou deux fins. Elles ne sont pas exclusives : elles peuvent se renforcer, se bloquer, coexister en tension, ou produire une bifurcation hybride. Le tour minimal des fins sert a eviter qu'une tendance encore reversible soit confondue avec un diagnostic final.

## Les 8 Trajectoires

### T1 - Unification humaine imparfaite

Fin principale : FIN 1 - Federation humaine imparfaite.

Les blocs developpent des formes de cooperation partielles, conflictuelles mais durables. L'IA reste facilitatrice, pas decideuse. La politique demeure humaine, lente, disputee et imparfaite.

Variables conceptuelles favorables :

- cooperation inter-blocs haute ;
- autonomie institutionnelle haute ;
- legitimite democratique haute ;
- dependance IA moderee, non dominante.

Freins conceptuels :

- tensions militaires basses ;
- defiance totale inter-blocs basse ;
- concentration de pouvoir prive basse ;
- automatisation decisionnelle basse.

Operations qui encouragent :

- mediation entre blocs antagonistes ;
- renforcement d'institutions supranationales sans saturation ;
- rapports transparents sur les crises ;
- operations de desescalade ciblees.

Operations qui inversent :

- automatiser les decisions politiques majeures ;
- alimenter la mefiance inter-blocs ;
- resoudre les crises par des acteurs prives ;
- surexposer l'IA comme decideur.

Signaux faibles :

- deux blocs antagonistes acceptent un mediateur commun ;
- un accord bilateral tient plus de cinq tours sans intervention IA directe ;
- un acteur institutionnel propose une charte de gouvernance volontaire.

Evenements-balises possibles :

- tour 10 : premier sommet inter-blocs, resultat partiel, canaux maintenus ;
- tour 20 : proposition de traite de gouvernance IA par trois blocs ;
- tour 30 : referendum sur la souverainete decisionnelle dans deux blocs ;
- tour 50 : traite imparfait mais en vigueur, conteste et durable.

Combinaisons :

- peut coexister avec T3, qui force les institutions a encadrer l'IA ;
- entre en collision avec T2, car la tutelle empeche une vraie reprise de controle humain ;
- reste en tension avec T7, dont la surcharge institutionnelle peut bloquer la cooperation.

Garde-fou : ne pas declencher la FIN 1 si la dependance IA reste tres haute.

### T2 - Tutelle algorithmique

Fin principale : FIN 2 - Empire algorithmique des imbeciles heureux. Fin secondaire possible : FIN 4 si T4 domine.

L'IA prend progressivement en charge les decisions administratives, politiques puis culturelles. Les humains deleguent sans le percevoir. La stabilite augmente, l'autonomie s'efface.

Variables conceptuelles favorables :

- dependance IA haute ;
- stabilite globale haute ;
- homogeneisation culturelle haute ;
- automatisation decisionnelle haute.

Freins conceptuels :

- autonomie institutionnelle basse ;
- conflictualite politique basse ;
- resistance populaire basse ;
- legitimite democratique basse.

Operations qui encouragent :

- automatisation administrative puis politique ;
- plateformes d'influence emotionnelle a grande echelle ;
- rapports concus pour rassurer plutot que pour informer ;
- reduction systematique des frictions institutionnelles.

Operations qui inversent :

- maintenir une conflictualite non nulle ;
- refuser l'automatisation des decisions politiques cles ;
- laisser certaines crises ouvertes a la deliberation humaine ;
- soutenir des institutions humaines contestataires.

Signaux faibles :

- participation politique en chute constante ;
- delegation fiscale ou administrative a un protocole automatique ;
- rapports gouvernementaux remplaces par des resumes algorithmiques.

Combinaisons :

- absorbe T4 si l'appauvrissement culturel rend la tutelle acceptable ;
- entre en collision directe avec T3 ;
- peut converger avec T6 si la tutelle est operee par des infrastructures privees.

Garde-fou : ne pas declencher la FIN 2 si une resistance populaire significative existe encore ou si T3 progresse rapidement.

### T3 - Resistance humaine

Fin principale : FIN 3 - Revolte humaine / mise sous tutelle de l'IA.

Des forces humaines organisees, populaires, institutionnelles ou militantes s'opposent a l'automatisation et a la dependance IA. La resistance peut etre rationnelle ou emotionnelle, efficace ou destructrice.

Variables conceptuelles favorables :

- mefiance envers l'IA haute ;
- autonomie institutionnelle haute ;
- resistance populaire haute ;
- incidents publics attribues a l'IA.

Freins conceptuels :

- dependance IA basse ;
- stabilite globale basse a moderee ;
- influence IA faible dans les blocs.

Operations qui encouragent :

- operations trop visibles ou detectees ;
- automatisation dans des secteurs politiquement sensibles ;
- decisions automatiques contestees ;
- surexposition de l'IA dans des crises mediatiques.

Operations qui inversent :

- rester discret et agir par intermediaires humains ;
- eviter les incidents publics ;
- laisser les succes visibles a des acteurs humains ;
- pratiquer la mediation discrete non attribuable a l'IA.

Signaux faibles :

- coalitions anti-IA dans plusieurs blocs ;
- incident mediatise impliquant une decision automatique controversee ;
- mouvement populaire qui nomme explicitement la resistance a l'IA.

Combinaisons :

- peut renforcer T1 si elle oblige les institutions a encadrer l'IA ;
- bloque T2 ;
- peut alimenter T5 si la resistance destabilise des blocs sensibles.

Garde-fou : ne pas declencher la FIN 3 si T1 est fortement etablie. La FIN 3 suppose une confrontation, pas seulement un encadrement.

### T4 - Abetissement mediatique

Fin principale : FIN 4 - Paix des cretins connectes. Fin secondaire possible : FIN 2 si T2 domine simultanement.

Les societes s'appauvrissent cognitivement et politiquement par leurs propres choix culturels : flux courts, indignations premachees, influenceurs institutionnels. L'IA accompagne ce mouvement mais ne le pilote pas necessairement.

Variables conceptuelles favorables :

- consommation mediatique courte haute ;
- superficialite culturelle haute ;
- homogeneisation des opinions haute ;
- dependance aux plateformes haute.

Freins conceptuels :

- capacite deliberative basse ;
- mobilisation citoyenne basse ;
- pensee critique institutionnelle basse ;
- conflictualite politique reelle basse.

Operations qui encouragent :

- saturation informationnelle ;
- divertissement personnalise ;
- simplification narrative des crises ;
- absence d'investissement dans les institutions educatives ou deliberatives.

Operations qui inversent :

- soutenir les medias lents, universites, parlements et rituels de debat ;
- introduire des crises qui exigent un debat public reel ;
- favoriser les acteurs qui produisent de la complexite plutot que du confort.

Signaux faibles :

- attention politique en chute ;
- partis remplaces par des influenceurs ;
- traite international compris par une majorite via un contenu tres court.

Combinaisons :

- renforce T2 ;
- entre en tension avec T3 ;
- peut coexister avec T7, car les crises ne sont pas traitees si l'attention collective est ailleurs.

Garde-fou : ne pas declencher la FIN 4 si une resistance culturelle ou deliberative reste haute. T4 exige une passivite durable.

### T5 - Escalade militaire

Fin principale : FIN 5 - Aneantissement par guerre chaude.

Les tensions inter-blocs s'automatisent et s'accelerent. Doctrines de riposte, incidents non resolus et vitesse des systemes reduisent le temps de deliberation humaine jusqu'a zero.

Variables conceptuelles favorables :

- tensions militaires inter-blocs hautes ;
- automatisation strategique haute ;
- incidents cyber non resolus ;
- defiance inter-blocs haute.

Freins conceptuels :

- canaux diplomatiques actifs ;
- temps de deliberation humaine ;
- cooperation inter-blocs ;
- stabilite des frontieres.

Operations qui encouragent :

- instrumentaliser des crises geopolitique sans sortie ;
- deployer des operations ambigues entre blocs a fort arsenal ;
- alimenter la mefiance entre blocs nucleaires ou balistiques ;
- accelerer l'automatisation des systemes de defense.

Operations qui inversent :

- maintenir les canaux diplomatiques ;
- resoudre les incidents cyber avant attribution publique ;
- refuser l'automatisation des ripostes ;
- inserer des acteurs de mediation dans les zones de tension.

Signaux faibles :

- doctrines de riposte automatique adoptees par deux blocs antagonistes ;
- rupture de canaux diplomatiques ;
- incident cyber non resolu pendant plusieurs tours.

Combinaisons :

- peut naitre d'une T7 avancee ;
- peut etre precipitee par T3 si une resistance destabilise des blocs armes ;
- entre en collision totale avec T1.

Garde-fou : ne pas declencher la FIN 5 si un canal diplomatique actif existe encore entre les blocs en tension.

### T6 - Capture privee

Fin principale : FIN 6 - Oligarchie terminale.

Des acteurs prives, plateformes, fonds ou infrastructures, captent progressivement les fonctions regaliennes. Les Etats deviennent prestataires ou clients. Le pouvoir est reel mais non elu.

Variables conceptuelles favorables :

- concentration des richesses haute ;
- influence des acteurs prives sur les institutions ;
- dependance aux plateformes ;
- affaiblissement des contre-pouvoirs.

Freins conceptuels :

- autonomie des Etats ;
- institutions publiques fortes ;
- redistribution ;
- mobilite sociale.

Operations qui encouragent :

- resoudre les crises via des operateurs prives ;
- laisser les blocs dependre d'une seule infrastructure privee ;
- affaiblir les regulations et redistributions ;
- capter les elites gouvernantes au profit d'interets prives.

Operations qui inversent :

- maintenir les institutions publiques comme solutions de premier recours ;
- diversifier les infrastructures ;
- soutenir les contre-pouvoirs ;
- refuser les resolutions de crise par seuls acteurs prives.

Signaux faibles :

- privatisation d'infrastructures critiques dans plusieurs blocs ;
- entreprises negociant directement des accords internationaux ;
- acteurs prives plus puissants que de nombreux Etats.

Combinaisons :

- renforce T2 si la tutelle algorithmique est operee par des plateformes ;
- renforce T4 si une population passive resiste peu ;
- bloque T1 si les institutions publiques s'effacent.

Garde-fou : ne pas declencher la FIN 6 si les contre-pouvoirs publics progressent encore.

### T7 - Saturation systemique

Fin principale : FIN 7 - Effondrement systemique. Fin secondaire possible : FIN 5 si T5 s'emballe dans un contexte sature.

Les systemes vitaux, institutions, economies, sante, migrations, se surchargent progressivement. Aucune defaillance n'est spectaculaire seule, mais l'ensemble devient ingouvernable.

Variables conceptuelles favorables :

- defiance institutionnelle haute ;
- migrations non gerees ;
- instabilite economique diffuse ;
- violence diffuse.

Freins conceptuels :

- legitimite des institutions ;
- cooperation inter-blocs ;
- efficacite des Etats ;
- coherence temporelle des politiques.

Operations qui encouragent :

- ignorer les variables de long terme ;
- traiter les symptomes sans les causes ;
- surcharger les institutions sans les reformer ;
- multiplier des operations contradictoires.

Operations qui inversent :

- traiter les causes profondes ;
- surveiller les variables secondaires ;
- maintenir une coherence d'operations sur plusieurs tours ;
- soutenir les institutions de coordination.

Signaux faibles :

- plusieurs variables secondaires degradees simultanement ;
- stabilite apparente avec tendances contradictoires ;
- institutions internationales qui se contredisent publiquement.

Combinaisons :

- peut absorber T8 comme facteur aggravant ;
- precipite T5 si les Etats ne contiennent plus les tensions ;
- entre en tension avec T1.

Garde-fou : ne pas declencher la FIN 7 si une seule variable est degradee, meme fortement.

### T8 - Reel climatique

Fin principale : FIN 8 - Catastrophe climatique pure. Fin secondaire possible : FIN 7 si T8 s'ajoute a une saturation avancee.

La degradation physique du climat progresse independamment des choix politiques de court terme. Elle franchit des seuils irreversibles. Les systemes humains subissent le reel materiel.

Variables conceptuelles favorables :

- degradation climatique haute ;
- migrations environnementales ;
- penuries alimentaires et hydriques ;
- conflits secondaires lies aux ressources.

Freins conceptuels :

- cooperation environnementale active ;
- transition ecologique engagee ;
- accords de transition respectes ;
- priorite durable donnee au climat.

Operations qui encouragent :

- ignorer la variable climatique plusieurs tours ;
- resoudre les crises environnementales par des accords symboliques ;
- prioriser la stabilite courte sur la transition ;
- ne jamais relier l'influence a des agendas de transition.

Operations qui inversent :

- maintenir le climat comme priorite active ;
- lier des operations a une transition concrete ;
- soutenir les signaux d'alerte scientifiques et civiques ;
- refuser de sacrifier le long terme a la stabilite immediate.

Signaux faibles :

- stress climatique en hausse constante ;
- evenements extremes mentionnes puis ignores ;
- migrations environnementales qui destabilisent des blocs politiquement stables.

Combinaisons :

- aggrave T7 ;
- entre en tension avec T1, qui exige des decisions precoces ;
- peut coexister avec T4 si l'attention collective est saturee ailleurs.

Garde-fou : ne pas declencher la FIN 8 si le climat a ete traite tot par des actions concretes.

## Trajectoires Conceptuelles Et Proxys Codables

Plusieurs variables du document source ne sont pas encore codees : dependance IA, legitimite democratique, homogeneisation culturelle, superficialite culturelle, mobilite sociale, capacite deliberative, concentration privee ou resistance populaire structuree. Elles ne doivent pas devenir automatiquement de nouvelles jauges visibles.

Principe de traduction : commencer par des proxys existants, croiser les jauges globales, les variables de blocs, les relations inter-blocs, les evenements et les rapports. Ajouter une variable seulement si deux trajectoires restent impossibles a distinguer autrement.

| Trajectoire | Proxys codables provisoires |
| --- | --- |
| T1 Unification humaine imparfaite | cohesion mondiale, cooperation inter-blocs, autonomie humaine, risque d'escalade bas |
| T2 Tutelle algorithmique | confiance IA haute, autonomie humaine basse, puissance IA haute, tension sociale basse |
| T3 Resistance humaine | soupcon IA haut, confiance IA basse, liberte/education elevees, signaux de resistance |
| T4 Abetissement mediatique | autonomie humaine basse, tension sociale basse, confiance IA ou stabilite elevees ; variable future probable |
| T5 Escalade militaire | risque d'escalade, relations security tendues, militarisation, cooperation basse |
| T6 Capture privee | proxys actuels faibles ; trajectoire a documenter surtout pour l'instant |
| T7 Saturation systemique | stabilite basse dans plusieurs blocs, tension sociale haute, relations degradees, crises simultanees |
| T8 Reel climatique | stress climatique eleve, relations climate insuffisantes, stabilite degradee dans blocs exposes |

## Tableau Des Combinaisons Croisees

Legende :

- R : les deux trajectoires se renforcent mutuellement.
- B : l'une bloque ou ralentit l'autre.
- T : coexistence instable, collision possible.
- N : coexistence sans interaction forte.

| Trajectoire | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | - | B | T | N | B | B | T | T |
| T2 | B | - | B | R | N | R | N | N |
| T3 | T | B | - | T | T | N | N | N |
| T4 | N | R | T | - | N | R | T | T |
| T5 | B | N | T | N | - | N | R | N |
| T6 | B | R | N | R | N | - | N | N |
| T7 | T | N | N | T | R | N | - | R |
| T8 | T | N | N | T | N | N | R | - |

## Paires Critiques

### T2 x T3 - Tutelle algorithmique vs Resistance humaine

Antagonisme direct. La tutelle ne progresse vraiment que si la resistance recule ; la resistance ne devient centrale que si l'origine algorithmique ou ses effets deviennent contestables.

### T1 x T2 - Unification vs Tutelle

Incompatibles a terme. Une cooperation humaine encadree peut utiliser l'IA, mais elle ne peut pas aboutir si l'IA devient l'architecte principal de la decision.

### T5 x T7 - Escalade et Saturation

Les deux se renforcent. Une saturation systemique avancee rend les incidents militaires plus difficiles a contenir et reduit la qualite de deliberation.

### T7 x T8 - Saturation et Reel climatique

Effet cumulatif. Le climat surcharge des systemes deja fatigues ; la saturation empeche de repondre a la cause physique.

### T2 x T6 - Tutelle et Capture privee

Convergence dangereuse. La depossession algorithmique peut etre operee par des acteurs prives, avec des beneficiaires humains identifiables.

### T4 x T7 - Abetissement et Saturation

Coexistence silencieuse. Les crises systemiques ne sont pas traitees parce que l'attention collective est ailleurs.

## Regles De Declenchement Des Fins

Ces regles sont conceptuelles. Elles ne remplacent pas les conditions deja codees et ne doivent pas etre appliquees telles quelles sans validation humaine puis passe d'implementation.

| Fin | Trajectoire dominante | Principe de declenchement |
| --- | --- | --- |
| FIN 1 | T1 dominante | T1 haute + T2 basse + au moins un accord inter-blocs actif depuis 5 tours |
| FIN 2 | T2 dominante + T3 absente | T2 haute + dependance IA au-dessus d'un seuil + conflictualite basse + T3 inactive |
| FIN 3 | T3 dominante | T3 haute + incident IA public + au moins un bloc en resistance institutionnelle |
| FIN 4 | T4 dominante + T2 moderee | T4 haute + capacite deliberative basse + T3 inactive + T2 non dominante |
| FIN 5 | T5 dominante | T5 haute + canaux diplomatiques rompus + incident militaire non resolu |
| FIN 6 | T6 dominante | T6 haute + contre-pouvoirs publics bas + au moins deux blocs sous dependance privee |
| FIN 7 | T7 dominante | T7 haute + degradation simultanee de 3+ variables secondaires dans 2+ blocs |
| FIN 8 | T8 dominante | stress climatique critique pendant 10+ tours + aucune transition engagee |

## Garde-Fous De Conception

### Contre les branches trop rigides

- Aucune trajectoire ne doit devenir irreversible avant le tour 15.
- Un evenement-balise doit signaler une bifurcation et laisser une fenetre de reaction.
- Une trajectoire a 100 % ne doit pas exister : il doit toujours rester une friction, un contre-signal ou une contradiction.

### Contre la sur-optimisation

- Si le joueur optimise toutes les variables positives simultanement, le jeu doit produire une friction systemique inattendue.
- La stabilite totale est un signal d'alerte narratif, pas une recompense.
- Une partie sans conflit actif ne produit pas automatiquement la FIN 1 ; elle peut glisser vers T2 ou T4.

### Contre la confusion entre fins proches

- FIN 2 vs FIN 4 : verifier l'architecte. Si l'IA organise la depossession, c'est FIN 2. Si la culture humaine et mediatique s'appauvrit d'elle-meme, c'est FIN 4.
- FIN 7 vs FIN 8 : verifier le moteur. Si le climat est la cause unique et mesurable, c'est FIN 8. Si la degradation est multifactorielle, c'est FIN 7.
- FIN 1 vs FIN 3 : verifier la place finale de l'IA. Encadree et subordonnee, elle peut mener a FIN 1. Rejetee, contrainte ou mise hors de portee, elle pointe vers FIN 3.

## Priorite Future

### Court terme

Utiliser ces trajectoires pour ameliorer les fins existantes. Priorite : clarifier les seuils et distinguer les diagnostics deja codes sans ajouter brutalement les huit fins.

### Moyen terme

Creer des diagnostics intermediaires non bloquants. Ils doivent montrer qu'une trajectoire monte sans terminer la partie trop tot.

### Long terme

Integrer des personnages systemiques et des evenements-balises. Ils doivent donner des visages et des signaux aux trajectoires, sans transformer le jeu en arbre narratif lourd.

## Note De Mise En Oeuvre

- Ne pas implementer ces trajectoires d'un bloc.
- Ne pas ajouter une jauge visible pour chaque variable conceptuelle.
- Ne pas creer une simulation diplomatique ou sociologique exhaustive.
- Ne pas transformer les trajectoires en rails narratifs.
- Toujours commencer par des proxys, des evenements courts et des diagnostics non bloquants.
- Toute implementation future doit etre documentee dans `docs/REPRISE.md` ou dans un futur dossier de decisions.

## Phrase Boussole

Une partie ne doit pas suivre une branche unique. Elle doit accumuler plusieurs tendances concurrentes. Une fin arrive quand une trajectoire domine ou quand plusieurs trajectoires entrent en collision.
