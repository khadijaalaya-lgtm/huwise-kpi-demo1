# Catalogue and portal-wide widgets

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsLastDatasetsFeed

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsLastDatasetsFeed widget displays the last datasets of a catalog based on the _modified_ metadata. By default, the widget displays the last five datasets.

#### Usage

as element:

```html
<ods-last-datasets-feed
       context="{CatalogContext}">
</ods-last-datasets-feed>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext | Catalog Context to use |

## odsLastReusesFeed

**Module:** `ods-widgets`
**Type:** Directive

#### Description

This widget displays the last five reuses published on a domain.

It is possible to customize the template used to display each reuse by adding HTML inside the widget's tag. The following variables are available:

  * `reuse.url`: URL to the reuse's dataset page
  * `reuse.title`: Title of the reuse
  * `reuse.thumbnail`: URL to the thumbnail of the reuse
  * `reuse.description`: Description of the reuse
  * `reuse.created_at`: ISO datetime of reuse's original submission (can be used as `reuse.created_at|moment:'LLL'` to format it)
  * `reuse.dataset.title`: Title of the reuse's dataset
  * `reuse.user.last_name`: Last name of the reuse's submitter
  * `reuse.user.first_name`: First name of the reuse's submitter

#### Usage

as element:

```html
<ods-last-reuses-feed
       context="{CatalogContext}"
       max="{number}"
       external-links="{boolean}">
</ods-last-reuses-feed>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext | Catalog Context to use |
| `max` | number | Maximum number of reuses to show _(default: 5)_ |
| `externalLinks` | boolean | Clicking on the reuses' titles or images will directly redirect to the reuse. Otherwise, by default, it will redirect to the dataset. _(default: false)_ |

## odsMostPopularDatasets

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsMostPopularDatasets widget displays the top datasets of a catalog based on the number of downloads. By default, the widget displays the top five datasets.

#### Usage

as element:

```html
<ods-most-popular-datasets
       context="{CatalogContext}"
       max="{integer}"
       order-by="{string}">
</ods-most-popular-datasets>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext | Catalog Context to use. |
| `max` | integer | Number of datasets to show in the list. _(default: 5)_ |
| `orderBy` | string | List order. Datasets can be sorted by most downloaded or popularity. The authorized values are `downloads` and `popularity`. _(default: downloads)_ |

## odsMostUsedThemes

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsMostUsedThemes widget displays the five most used themes.

#### Usage

as element:

```html
<ods-most-used-themes
       context="{CatalogContext}">
</ods-most-used-themes>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext | Catalog Context to use |

## odsThemeBoxes

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsThemeBoxes widget enumerates the themes available on the domain by showing their pictograms and the number of datasets they contain. They require the `themes` setting to be configured in ODSWidgetsConfig.

#### Usage

as element:

```html
<ods-theme-boxes
       context="{CatalogContext}">
</ods-theme-boxes>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext | Catalog Context to pull the theme list from |

## odsTopPublishers

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsTopPublishers widget displays the five top publishers.

#### Usage

as element:

```html
<ods-top-publishers
       context="{CatalogContext}">
</ods-top-publishers>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext | Catalog Context to use |

## odsReuses

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsReuses widget displays all reuses published on a domain in an infinite list of large boxes, presenting reuses in a clear display. The list shows the more recent reuses first.

You can optionally insert HTML code inside the `<ods-reuses></ods-reuses>` element, in which case it will be used as a template for each displayed reuse. The following variables are available in the template:

  * `reuse.url`: URL to the reuse's dataset page
  * `reuse.title`: Title of the reuse
  * `reuse.thumbnail`: URL to the thumbnail of the reuse
  * `reuse.description`: Description of the reuse
  * `reuse.created_at`: ISO datetime of reuse's original submission (can be used as `reuse.created_at|moment:'LLL'` to format it)
  * `reuse.dataset.title`: Title of the reuse's dataset
  * `reuse.user.last_name`: Last name of the reuse's submitter
  * `reuse.user.first_name`: First name of the reuse's submitter

#### Usage

as element:

```html
<ods-reuses
       context="{CatalogContext}">
</ods-reuses>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext | Catalog Context to use |
