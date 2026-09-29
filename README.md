# Bloc KPI personnalisé — L'école élémentaire à Paris en chiffres

Un bloc de 3 cartes KPI, construit avec les widgets ODS et le
[kit de développement local ODS](https://github.com/opendatasoft/ods-cookbook/tree/master/widgets/external-use/local-dev-env).
Il montre ce qu'un bloc codé apporte par rapport aux blocs standards de Studio.

## Source de données

- **Portail** : [Paris Data](https://parisdata.huwise.com/pages/catalogue/)
- **Jeu de données** : [Etablissements scolaires – Ecoles élémentaires](https://parisdata.huwise.com/explore/dataset/etablissements-scolaires-ecoles-elementaires/)
  (Ville de Paris, Direction des Affaires Scolaires — DASCO)
- **Champs utilisés** : `annee_scol` (année scolaire) et `arr_libelle` (arrondissement)

## Les 3 KPIs

| # | KPI | Calcul | Élément graphique |
|---|-----|--------|-------------------|
| 1 | **Écoles élémentaires publiques** | Nombre d'écoles pour l'année scolaire la plus récente, avec l'évolution par rapport à l'année précédente | Carte mise en avant ; historique par année (jusqu'à 6) quand le jeu contient plusieurs années |
| 2 | **Arrondissement le plus doté** | Arrondissement qui compte le plus d'écoles, et sa part du total parisien | Classement des 20 arrondissements en barres, le premier en couleur d'accent, infobulles |
| 3 | **Écoles par arrondissement** | Moyenne (total ÷ nombre d'arrondissements), minimum, maximum et écart (max ÷ min) | Jauge min → max avec un repère sur la moyenne |

Aucune valeur n'est écrite en dur. Deux requêtes d'analyse (`records/analyze`) sont lancées au chargement :

- `years` : `COUNT()` par `annee_scol` ;
- `detail` : `COUNT()` par `annee_scol` × `arr_libelle`.

Tout le reste est calculé dans la page en expressions AngularJS : choix de l'année la plus récente, évolution, classement, moyenne et écart. Les chiffres se mettent donc à jour à chaque publication du jeu de données.

## Ce que les blocs standards ne permettent pas

- une hiérarchie visuelle entre les cartes : une carte « héros » en couleur principale, deux cartes secondaires ;
- des mini-graphiques intégrés aux cartes (historique, classement, jauge) avec infobulles au survol et au clavier ;
- des valeurs dérivées (évolution, part en %, écart) calculées à partir de plusieurs agrégations ;
- des états de chargement (squelettes), des animations d'entrée (désactivées si `prefers-reduced-motion`) et une grille responsive : 3 colonnes, puis 2, puis 1.

## Fichiers

```
pages/views/kpi-education.ejs    ← HTML du bloc (widgets ODS)
pages/styles/kpi-education.scss  ← styles, tous scopés sous .kpi-edu
config.project.js                ← domaine cible (parisdata) et liste des pages
```

Le reste (`kit/`, `ods-portal/`, `gulpfile.js`, `app.js`) vient du kit ODS. Sa documentation d'origine est dans [README-kit.md](README-kit.md).

## Couleurs de marque

Remplacez uniquement les variables en tête de `pages/styles/kpi-education.scss` :

```scss
--kpi-primary:      #1b2a6b;  // carte héros, chiffres
--kpi-primary-soft: #e8ebf7;  // fonds d'icônes, piste de la jauge
--kpi-primary-mid:  #a9b3dc;  // barres secondaires
--kpi-accent:       #ff6b4a;  // élément mis en avant dans chaque mini-graphique
--kpi-accent-soft:  #ffe7e1;  // pastilles
--kpi-font:         inherit;  // police du thème du portail
```

Les valeurs actuelles sont provisoires, en attendant la charte de la marque.

## Lancer en local

```bash
npm install
cp config.example.js config.js
npx gulp server        # http://localhost:9090/pages/kpi-education
```

Les widgets interrogent directement `https://parisdata.huwise.com` : aucune clé d'API n'est nécessaire, le jeu de données est public.

## Intégrer dans une page du portail

```bash
npx gulp compile       # produit output/kpi-education.html et output/kpi-education.css
```

Collez le contenu de `output/kpi-education.html` dans l'onglet HTML de l'éditeur de page, et celui de `output/kpi-education.css` dans l'onglet CSS.

Pour pousser automatiquement la page avec `npx gulp update`, renseignez `ODS_ADMIN_APIKEY` dans `config.js`. La page doit exister sur le domaine avec l'identifiant `kpi-education`.

## Correctif apporté au kit

La tâche `sass-sync` écrivait les feuilles compilées avec l'extension `.scss`. En local, le navigateur ne trouvait donc pas `index-pages.css`. Un renommage en `.css` a été ajouté dans `gulpfile.js`.
