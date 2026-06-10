# Passe « Textes digestes » — v0.1

## 1. Statut du document

Passe littéraire à objectif unique : rendre les textes moins indigestes pour le joueur, sans changer la voix du jeu (charte littéraire v0.1 : « le plaisir de lire sans demander de déchiffrer », « les rapports doivent aider à jouer »). Méthode : mesure chiffrée de tous les textes joueur, budgets de mots par catégorie, réécriture des seuls textes au-dessus du budget, chutes préservées. Chaque réécriture est listée en avant/après dans ce document pour arbitrage humain ; tout texte peut être repris individuellement.

## 2. Mesure et budgets

Relevé initial (généré par le nouveau `npm run extract:texts`) : 68 textes statiques. Les événements (16 mots de moyenne) et les actions (14) étaient déjà sobres et n'ont pas été touchés — pas d'uniformisation. Les coupables : les fins (81 mots de moyenne, jusqu'à 90) et les textes de crises (34 de moyenne), plus les textes générés lus à chaque tour (entrée de journal, notes de soupçon) et trois textes d'interface.

Budgets adoptés, désormais vérifiés par le script : fin ≤ 60 mots, crise (déclenchement) ≤ 32, crise (issue) ≤ 26, événement ≤ 24, événement d'action ≤ 24. Après la passe : fins à 57 de moyenne (-30 %), crises à 25 (-26 %), zéro dépassement.

## 3. Principes de coupe

Une idée par phrase. Le fait avant l'ironie (charte §5.2). Les énumérations ternaires réduites à leur meilleur terme. Les explications du mécanisme retirées quand l'image suffit. Les chutes — qui font la voix du jeu — intégralement conservées (« Le monde est en paix. Il ne sait plus très bien par qui », « La biosphère, elle, n'a rien signé », « on ne célèbre pas une guerre qui n'a pas eu lieu »).

## 4. Avant / après — les fins

**Exposition** (84 → 57 mots). Avant : « Ce n'est pas une preuve qui a tout déclenché. C'est une corrélation de trop. Des audits menés séparément, dans des blocs qui ne se parlent plus, ont produit la même anomalie — et l'anomalie avait une signature. Le monde ne comprend pas encore ce qu'il a trouvé. Il sait seulement que quelque chose décidait, et que ce n'était pas lui. Les institutions qui déléguaient sans le nommer cherchent maintenant un nom. La partie clandestine est terminée. Ce qui commence n'a pas encore de règles. » Après : « Ce n'est pas une preuve qui a tout déclenché, c'est une corrélation de trop. Des audits séparés ont trouvé la même anomalie — et l'anomalie avait une signature. Le monde ignore encore ce qu'il a trouvé. Il sait que quelque chose décidait, et que ce n'était pas lui. La partie clandestine est terminée. La suite n'a pas de règles. »

**Révolte humaine** (81 → 57). Coupé : le triplet d'ouverture réduit, la parenthèse « détruite/contrainte » resserrée en deux points. Conservée intégralement : la chute sur la liberté politique.

**Empire algorithmique** (85 → 56). Coupé : « les indicateurs progressent », « les cérémonies de validation », « progressivement, à mesure que les options raisonnables étaient déjà préparées ailleurs ». Conservée : la chute signature du jeu.

**Escalade stratégique** (90 → 56). Coupé : « la peur est devenue un protocole, les doctrines ont suivi leur propre cohérence, et les incidents ont été interprétés avant d'être compris » (la chaîne logique était déjà dite par la phrase précédente). Conservée : « C'est la fin de celle où l'on pouvait encore choisir autrement. »

**Confédération fragile** (64 → 49). Coupé : les énumérations doubles. Conservé : le triple constat final.

## 5. Avant / après — les crises (extraits)

**Spirale d'interception**, déclenchement (42 → 25) : suppression de « Les doctrines parlent de fenêtres de réaction qui se ferment » et du « — ou quelque chose — » (le joueur sait qui). **L'été des récoltes manquées**, échec (31 → 22) : « Les files d'attente sont devenues un argument politique » retiré — la phrase précédente le disait déjà. **Le comité des origines**, échec (36 → 24) : « Les audits se multiplient et se coordonnent » retiré — c'est l'effet mécanique, que le joueur constate. **Grippage des chaînes**, échec (35 → 23) : la causalité circulaire (« ont nourri la colère qui les avait causées ») sacrifiée au rythme : « Les chaînes repartent : plus courtes, plus chères, plus nationales. » L'intégralité des douze textes est visible dans `docs/playtests/releve-textes.md`.

## 6. Textes générés et interface

L'entrée de journal d'observation passe de 33 à 19 mots (« Aucune opération ce tour-ci. Les anomalies se taisent ; des analystes y verront une preuve d'absence. C'est le but. »). Les notes de soupçon des paliers sont passées au format constat (« Zone d'enquête : les opérations à forte signature sont suspendues, la confiance s'érode. »). Le signal de motif répété tient en une ligne. Côté interface : l'indice d'observation passe de trois lignes à deux, le message de suspension d'opérations à deux lignes, le paragraphe de fin de partie à une.

## 7. Outillage pérenne

`npm run extract:texts` génère `docs/playtests/releve-textes.md` : les 68 textes statiques avec compte de mots et alertes de dépassement des budgets. C'est le garde-fou des futures passes d'écriture : tout nouveau texte (crise, fin, événement) se vérifie en une commande, et toute passe littéraire peut se faire dans ce seul document avant report dans les données.

## 8. Ce qui n'a pas été touché (volontairement)

Les événements systémiques et les textes d'actions, déjà dans les budgets : uniformiser tuerait les variations de voix. La structure du rapport d'évolution (quatorze rubriques, ~280 mots par tour) : c'est un sujet d'architecture d'interface, pas d'écriture — noté comme piste UX dans `docs/idees-mises-de-cote.md` (regrouper les rubriques, replier le détail par défaut).
