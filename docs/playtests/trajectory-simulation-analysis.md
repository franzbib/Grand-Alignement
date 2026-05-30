# Analyse du rapport de simulation des trajectoires

Source : `docs/playtests/trajectory-simulation-report.md`  
Commande source : `npm.cmd run simulate:trajectories`  
Statut : diagnostic uniquement. Aucun équilibrage appliqué.

## 1. Résumé exécutif

Le rapport montre une vraie différenciation des profils, mais elle est partiellement masquée par deux phénomènes :

- `Capture privée` apparaît trop souvent comme trajectoire dominante dès 5 à 10 tours.
- Plusieurs jauges globales saturent vite, surtout dans les profils qui répètent les mêmes priorités.

Le problème le plus urgent n'est pas encore l'équilibrage global du jeu. C'est la lecture des trajectoires : certains scores, notamment `Capture privée`, interprètent trop largement des situations qui ne relèvent pas forcément d'une capture privée réelle.

La partie semble aujourd'hui plus lisible entre 10 et 30 tours qu'à 50 tours. L'horizon 50 doit rester un stress test, pas une durée cible tant que les effets cumulatifs n'ont pas de friction plus forte.

## 2. Ce qui fonctionne

- Les profils produisent des sorties différentes sur les jauges globales : `Empire algorithmique`, `Marché`, `Écologie` et `Chaos contrôlé` sont bien distinguables.
- Plusieurs fins apparaissent par stratégies différentes à partir de 30 tours : `Confédération fragile`, `Empire algorithmique`, `Escalade stratégique`.
- Le profil `Chaos contrôlé` révèle correctement une trajectoire d'escalade.
- Le profil `Marché / dérégulation` fait apparaître un couple logique : climat dégradé, puissance IA élevée, tension forte.
- Le rapport est utile : il expose des problèmes qui n'étaient pas évidents en playtest manuel court.

## 3. Problèmes observés à 5 tours

Niveau A — à corriger bientôt :

- `Capture privée` domine 7 profils sur 8 dès 5 tours. C'est trop rapide pour une trajectoire censée décrire une capture institutionnelle profonde.
- Certaines jauges globales atteignent déjà des extrêmes : cohésion à 100 pour `Alignement mondial`, autonomie à 6 pour `Empire algorithmique`, climat à 91 pour `Marché`.
- Le score de `Capture privée` semble capter des signaux génériques de richesse, dépendance ou liberté basse, même quand la stratégie ne parle pas vraiment de capture privée.

Niveau B — à surveiller :

- Les profils `Alignement mondial` et `Sécurité` produisent vite une désescalade très forte.
- Les blocs les plus alignés IA se ressemblent souvent : Asie industrielle, Russie/Eurasie, puis blocs fortement stabilisés.

## 4. Problèmes observés à 10 tours

Niveau A — à corriger bientôt :

- `Capture privée` reste dominante ou secondaire forte presque partout.
- Plusieurs profils atteignent déjà des plafonds ou planchers : cohésion 100, escalade 0, autonomie 0, puissance IA 100, soupçon 100.
- `Empire algorithmique` a des signaux très forts de tutelle, mais le diagnostic dominant reste souvent `Capture privée`. Cela brouille la lecture.

Niveau B — à surveiller :

- `Écologie / ralentissement` réduit le climat à 1 en 10 tours, ce qui signale une action climatique probablement trop cumulative si la durée cible dépasse 10-15 tours.
- `Marché / dérégulation` pousse le climat à 100 dès 10 tours ; c'est cohérent comme direction, mais brutal.
- `Chaos contrôlé` produit une escalade haute très vite, ce qui est plutôt utile pour tester les collisions.

## 5. Problèmes observés à 30 tours

Niveau B — à surveiller :

- Plusieurs fins se déclenchent : c'est positif, mais certaines arrivent après des trajectoires secondaires contradictoires.
- `Confédération fragile` apparaît dans `Alignement mondial` et `Sécurité`, alors que ces profils peuvent aussi afficher puissance IA et confiance IA très hautes. Il faudra vérifier humainement si la fin reste moralement cohérente dans ces cas.
- `Empire algorithmique` apparaît logiquement dans `Empire`, `Marché` et `Aléatoire`, mais la trajectoire dominante affichée peut rester `Capture privée`.
- `Écologie / ralentissement` produit une unification lisible, mais avec des tensions de blocs très élevées. Ce n'est pas forcément faux ; c'est une bonne piste narrative.

Niveau A possible :

- Le profil `Autonomie humaine` finit surtout en `Réel climatique`. Il préserve l'autonomie mais ignore ou subit le climat. C'est cohérent si voulu, mais cela peut frustrer si le profil est censé être une stratégie viable complète.

## 6. Problèmes observés à 50 tours

Niveau C — stress test long :

- Les saturations sont généralisées à 50 tours. Ce n'est pas automatiquement grave si la durée cible est 10-30 tours.
- Le rapport montre surtout que le modèle actuel n'a pas assez de friction, de rendements décroissants ou de contre-réactions pour rester nuancé pendant 50 tours.
- Plusieurs profils ont déjà atteint leur fin avant 50 tours ; les états à 50 tours sont donc des états gelés ou prolongés, moins utiles pour équilibrer la boucle courante.

Niveau B si la durée cible devient 30+ tours :

- Les actions répétées produisent des plafonds trop nets.
- Les trajectoires secondaires peuvent devenir bruitées quand deux ou trois jauges sont saturées.

## 7. Analyse de la domination de Capture privée

La domination de `Capture privée` semble réelle dans le rapport, mais probablement surpondérée par la formule.

Formule actuelle :

```text
t6 = max(richesse blocs) * 0.3
   + max(dependence technology) * 0.3
   + (100 - min(liberte blocs)) * 0.4
```

Pourquoi elle domine :

- Elle utilise des extrêmes (`max richesse`, `max dependence`, `min liberté`) plutôt que des tendances larges.
- Une seule liberté très basse dans un bloc suffit à augmenter fortement T6.
- La richesse monte dans plusieurs stratégies qui ne sont pas nécessairement oligarchiques.
- La dépendance technologique peut être élevée par défaut ou augmenter sans être explicitement une capture privée.
- La formule ne demande pas de combinaison durable ni de signal institutionnel de capture.

Conclusion : `Capture privée` est probablement surpondérée comme score de lecture. Ce n'est pas encore la preuve que le gameplay pousse réellement tout vers l'oligarchie.

## 8. Analyse des saturations de jauges

Les saturations viennent probablement de trois sources :

- Les actions ont des effets forts et se répètent souvent dans les profils simulés.
- Les profils choisissent mécaniquement les mêmes actions prioritaires dès qu'elles sont disponibles.
- Le moteur a peu de rendements décroissants ou de contrepoids autonomes.

Saturations problématiques dès 10 tours :

- `cohesionMondiale` à 100 pour `Alignement mondial` et `Sécurité`.
- `puissanceIA`, `soupconIA`, `autonomieHumaine` à 0 ou 100 dans `Empire algorithmique`.
- `stressClimatique` à 100 dans `Marché` et à 1 dans `Écologie`.

Interprétation :

- À 5-10 tours, ces saturations sont des alertes de lisibilité.
- À 30 tours, elles peuvent encore être acceptables si elles mènent à des diagnostics.
- À 50 tours, elles relèvent surtout du stress test.

## 9. Profils de joueur insuffisamment différenciés

Certains profils sont bien distincts dans l'intention mais trop proches dans leurs effets :

- `Alignement mondial` et `Sécurité` réduisent tous deux l'escalade très vite et montent la cohésion.
- `Empire algorithmique`, `Marché` et `Aléatoire` montent souvent puissance IA et confiance IA.
- Les préparations sont utilisées automatiquement dès qu'elles sont prioritaires, mais le profil ne réfléchit pas encore au contexte.

La fonction de simulation choisit les actions selon une priorité fixe et remplit la capacité d'influence. Cela accentue les répétitions. Le rapport teste donc davantage des boucles optimisées que des joueurs variés.

## 10. Hypothèses techniques ou systémiques

Hypothèse 1 : le score `Capture privée` est trop sensible aux extrêmes.

Hypothèse 2 : les actions globales sont très cumulatives et n'ont pas assez de rendements décroissants.

Hypothèse 3 : les profils de simulation surexploitent les mêmes actions, ce qui accélère les saturations.

Hypothèse 4 : les fins ne sont pas forcément trop précoces ; elles arrivent plutôt quand les profils ont déjà poussé les jauges à des états extrêmes.

Hypothèse 5 : le jeu est actuellement calibré implicitement pour 10-20 tours, pas pour 50 tours.

Hypothèse 6 : certains scores de trajectoire mesurent une ambiance systémique, mais pas encore une vraie trajectoire historique durable.

## 11. Priorités d'équilibrage possibles

Niveau A — à corriger bientôt :

- Revoir la formule de `Capture privée` pour qu'elle exige une combinaison plus spécifique : richesse haute + liberté basse + dépendance technologique, idéalement dans le même bloc ou sur plusieurs tours.
- Améliorer les profils de simulation pour réduire les répétitions mécaniques et mieux représenter des joueurs plausibles.
- Surveiller les saturations à 10 tours pour cohésion, climat, puissance IA, soupçon et autonomie.

Niveau B — à surveiller :

- Vérifier la cohérence morale de `Confédération fragile` quand puissance IA ou confiance IA sont très hautes.
- Vérifier si `Écologie / ralentissement` doit générer plus de tensions mais moins de plafonnement climatique.
- Vérifier si `Autonomie humaine` doit pouvoir traiter le climat sans perdre son identité.

Niveau C — stress test long :

- Ne pas corriger 50 tours en premier. Les saturations à 50 tours sont utiles comme signal de robustesse, mais elles ne doivent pas piloter seules l'équilibrage du prototype.
- Les rendements décroissants ou frictions de long terme seront utiles plus tard, mais ce serait une mécanique plus structurante.

## 12. Recommandation de prochaine micro-passe

Prochaine action recommandée : micro-ajuster uniquement la lecture des scores de trajectoires, en priorité `Capture privée`, sans toucher aux actions ni aux fins.

But : vérifier si la domination de `Capture privée` vient d'un score trop large avant de modifier l'équilibrage réel du jeu.

## Micro-ajustement de la lecture des trajectoires — Capture privée

### Problème observé

La formule initiale de `Capture privée` utilisait trois extrêmes indépendants : richesse maximale, dépendance technologique maximale et liberté minimale. Elle pouvait donc monter fortement même si ces signaux ne décrivaient pas le même bloc ni une logique de capture cohérente.

Effet visible : `Capture privée` dominait presque tous les profils dès 5 ou 10 tours, y compris `Alignement mondial`, `Autonomie humaine` et `Sécurité`.

### Hypothèse retenue

Le gameplay ne pousse pas forcément toutes les parties vers la capture privée. Le score T6 lisait trop largement des états généraux : richesse, technicisation, baisse locale de liberté. Il fallait donc rendre le diagnostic plus discriminant sans modifier les actions.

### Modification appliquée

La formule T6 a été resserrée :

- remplacement du couple `max richesse` + `min liberté` par une pression de capture par bloc ;
- la richesse et la liberté basse doivent davantage coexister ;
- ajout de la dépendance commerciale aux dépendances technologiques ;
- conservation d'un signal de concentration par écart entre richesse maximale et richesse moyenne ;
- coefficients réduits pour éviter qu'un seul extrême domine le score.

Un petit ajustement de T8 a aussi été appliqué : `Réel climatique` ne vaut plus directement `stressClimatique`, afin que le stress climatique initial ne devienne pas mécaniquement la trajectoire dominante par défaut.

### Effet sur les simulations

Après simulation :

- `Capture privée` ne domine plus artificiellement la majorité des profils à 5 et 10 tours.
- `Empire algorithmique` redevient dominant dans le profil du même nom.
- `Unification humaine imparfaite` redevient lisible dans `Alignement mondial`, `Autonomie humaine`, `Sécurité` ou `Écologie`.
- `Escalade militaire` redevient dominante dans `Chaos contrôlé`.
- `Capture privée` reste possible, notamment comme secondaire dans `Empire algorithmique`.
- `Marché / dérégulation` reste dominé par `Réel climatique`, ce qui correspond à l'effet massif de dérégulation sur le climat.

Le diagnostic est donc plus différencié, sans modification du gameplay.

### Points à surveiller

- `Tutelle algorithmique` apparaît maintenant sur `Alignement mondial` à 10 tours, probablement parce que la stratégie monte beaucoup la confiance IA et la puissance IA.
- `Réel climatique` reste très fort dans les profils qui n'agissent pas sur le climat ou qui l'aggravent.
- Les saturations de jauges à 30-50 tours restent présentes : elles relèvent d'une future passe d'équilibrage, pas de cette correction de lecture.
- `Capture privée` devra être réévaluée quand une vraie variable ou proxy plus robuste de capture privée existera.
