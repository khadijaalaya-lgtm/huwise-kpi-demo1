# Aggregation and analysis

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsAggregation

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsAggregation widget creates a variable that contains the result of an aggregation function based on a context.

Aggregations are functions that enable to group records and compute statistical values for numeric fields. For instance, aggregations can determine, based on several records, the smallest or biggest value among them, compute the average value or count the number of values for a chosen field.

odsAggregation supports multiple declarations of aggregations.

#### Usage

as attribute

```html
<ANY ods-aggregation="{string}"
     ods-aggregation-context="{DatasetContext}"
     ods-aggregation[-variablename]-context="{DatasetContext}"
     ods-aggregation-function="{string}"
     ods-aggregation[-variablename]-function="{string}"
     ods-aggregation-expression="{string}"
     ods-aggregation[-variablename]-expression="{string}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsAggregation` | string | _(mandatory)_ Name of the variable that holds the result of the aggregation. For multiple aggregations, variable names must be separated with commas. _(default: aggregation)_ |
| `odsAggregationContext` | DatasetContext | _(mandatory)_ Dataset Context to use. |
| `odsAggregation[Variablename]Context` | DatasetContext | Context specific to the `[Variablename]` aggregation. `[Variablename]` must be replaced with the name of the variable, declared through the **odsAggregation** parameter. |
| `odsAggregationFunction` | string | _(mandatory)_ Aggregation function to apply:<br>* AVG: average<br>* COUNT<br>* MIN: minimum<br>* MAX: maximum<br>* STDDEV: standard deviation<br>* SUM<br>_(default: COUNT)_ |
| `odsAggregation[Variablename]Function` | string | Function specific to the `[Variablename]` aggregation. `[Variablename]` must be replaced with the name of the variable, declared through the **odsAggregation** parameter. _(default: COUNT)_ |
| `odsAggregationExpression` | string | _(optional only with the COUNT function)_ Expression to apply the function on (e.g., the name of a field). _(default: none)_ |
| `odsAggregation[Variablename]Expression` | string | Expression specific to the `[Variablename]` aggregation. `[Variablename]` must be replaced with the name of the variable, declared through the **odsAggregation** parameter. _(default: none)_ |

## odsSubaggregation

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsSubaggregation widget computes aggregations on an analysis result. You can use this widget with the AngularJS ngRepeat directive to simply build a table of analysis results.

#### Usage

as attribute

```html
<ANY ods-subaggregation="{string}"
     ods-subaggregation-serie*="{number}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsSubaggregation` | string | Analysis results |
| `odsSubaggregationSerie*` | number | Aggregation expression |

## odsAnalysis

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsAnalysis widget creates a variable that contains the result of an analysis (i.e., an object containing a results array and optionally an aggregations object).

odsAnalysis allows applying functions to chosen groups of data to analyze them with the same logic as a chart visualization. For instance, an analysis can obtain the average value for several data series, broken down by a chosen field used as an X-axis. The result can then be sorted by another series.

odsAnalysis can be used with the AngularJS ngRepeat directive to build a table of analysis results.

#### Usage

as attribute

```html
<ANY ods-analysis="{string}"
     ods-analysis-context="{DatasetContext}"
     ods-analysis-max="{number}"
     ods-analysis-x="{string}"
     ods-analysis-sort="{string}"
     ods-analysis-serie-name="{string}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsAnalysis` | string | _(mandatory)_ Name of the variable _(default: analysis)_ |
| `odsAnalysisContext` | DatasetContext | _(mandatory)_ Dataset Context to use. |
| `odsAnalysisMax` | number | Maximum number of results to show. _(default: all)_ |
| `odsAnalysisX` | string | Name of the field used as X-axis (e.g., date or datetime field, facet, etc.) _(default: none)_ |
| `odsAnalysisSort` | string | Name of the series to sort on. Note that `-` before the name of the series indicates that the sorting will be descending instead of ascending (e.g., `-serieName`). _(default: none)_ |
| `odsAnalysisSerieName` | string | Function to apply:<br>* AVG: average<br>* COUNT<br>* MIN: minimum<br>* MAX: maximum<br>* STDDEV: standard deviation<br>* SUM<br>Must be written in the following form: `FUNCTION(fieldname)`. _(default: none)_ |

## odsAdvAnalysis

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsAdvAnalysis widget exposes the results of an aggregation function over a context. It uses the ODS Explore API V2.1 and its [ODSQL language](https://help.huwise.com/apis/ods-explore-v2/#section/Opendatasoft-Query-Language-%28ODSQL%29), which offers greater flexibility than the v1.

The parameters for this widgets are dynamic, which implies two benefits:

  * First, changes in context parameters will refresh the results of the widget.
  * Second, AngularJS variables are accepted as attributes.

The results can then be displayed in three different ways:

  * To create specific visualizations, using custom-made HTML and CSS
  * A table view is also available using `odsAdvTable` (examples are provided below).
  * As the widget is creating an AngularJS variable, it can be displayed through a simple `{{myData.results[X]}}`. This usage is not documented here, as it regards HTML code and widgets already documented in [the introduction](https://help.huwise.com/widgets/#/introduction/).

For retro-compatibility purposes, similarly to API V2.0, if the `groupBy` is done on a field that contains null values, they will be removed. If you are using the `limit` parameter, this may cause the widget to return one less category as expected, because the null group was included. You can prevent this by using `where` to exclude null values from this field, using `IS NOT NULL` (e.g. `my_field IS NOT NULL`).

#### Examples of requests to make

How to compute a weighted average:

In this example, the widget will return the average height of the trees according to the population size of each species in Paris districts.

```html
<ods-dataset-context
    context="ctx"
    ctx-domain="https://documentation-resources.huwise.com/"
    ctx-dataset="les-arbres-remarquables-de-paris">
    <div ods-adv-analysis="myData"
        ods-adv-analysis-context="ctx"
        ods-adv-analysis-select="(sum(hauteur_en_m)/count(espece)) as y_axis"
        ods-adv-analysis-where="arrondissement LIKE 'paris'"
        ods-adv-analysis-group-by="espece as x_axis">
        {{myData}}
    </div>
</ods-dataset-context>
```

How to create multiple time series:

In this example, the widget returns the average gold price by month in 2018 and 2019. The `group-by` year allows to compare each year with the others.

```html
<ods-dataset-context
    context="ctx"
    ctx-domain="https://documentation-resources.huwise.com/"
    ctx-dataset="gold-prices">
    <div ods-adv-analysis="myData"
        ods-adv-analysis-context="ctx"
        ods-adv-analysis-select="avg(price) as y_axis"
        ods-adv-analysis-where="date > date'2017'"
        ods-adv-analysis-group-by="month(date) as x_axis, year(date) as series">
        {{myData}}
    </div>
</ods-dataset-context>
```

#### How to use odsAdvancedAnalysis with odsAdvTable

**odsAdvancedTable** was designed to accept the JSON created by **odsAdvancedAnalysis**. Its purpose is to offer a table view that matches the widget and to provide an accessible way of displaying data as an alternative to charts.

For more information, see the documentation for odsAdvTable.

```html
<ods-dataset-context
    context="ctx"
    ctx-domain="https://documentation-resources.huwise.com/"
    ctx-dataset="les-arbres-remarquables-de-paris">
    <div ods-adv-analysis="myData"
        ods-adv-analysis-context="ctx"
        ods-adv-analysis-select="count(objectid) as quantite_arbres, AVG(circonference_en_cm) as circonference_moyenne"
        ods-adv-analysis-group-by="arrondissement">
        <ods-adv-table
            data="myData"
            sticky-header="true"
            sticky-first-column="true"
            columns-order="['arrondissement', 'quantite_arbres', 'circonference_moyenne']"
            totals="['quantite_arbres']"
            sort="arrondissement ASC">
        </ods-adv-table>
    </div>
</ods-dataset-context>
```

#### Usage

as attribute

```html
<ANY ods-adv-analysis="{string}"
     ods-adv-analysis-context="{string}"
     [ods-adv-analysis-select]="{string}"
     [ods-adv-analysis-where]="{string}"
     [ods-adv-analysis-group-by]="{string}"
     [ods-adv-analysis-order-by]="{string}"
     [ods-adv-analysis-limit]="{string}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsAdvAnalysis` | string | This name can be used as the `data` attribute of the display widgets that support it (e.g. `odsAdvTable`). |
| `odsAdvAnalysisContext` | string | Insert here the name of the context to use. |
| `odsAdvAnalysisSelect` | string, optional | Type here the query to make. More use cases are available below. The documentation about the ODSQL select clause is available here. This clause will contain the values (i.e., the y-axis in case of a chart). |
| `odsAdvAnalysisWhere` | string, optional | This parameter allows to filter rows with a combination of expressions. The documentation about the ODSQL `where` clause is available [here](https://help.huwise.com/apis/ods-explore-v2/#section/Opendatasoft-Query-Language-%28ODSQL%29/Where-clause). |
| `odsAdvAnalysisGroupBy` | string, optional | This parameter helps regroup the calculation according to specific criteria. The `group-by` in this clause can become either y-axis or series in a chart. The documentation about the ODSQL `GROUP BY` clause is available [here](https://help.huwise.com/apis/ods-explore-v2/#section/Opendatasoft-Query-Language-%28ODSQL%29/Group-by-clause). |
| `odsAdvAnalysisOrderBy` | string, optional | This parameter is used to sort the results of an aggregation using the `ASC` and `DESC` keywords (e.g., `myField ASC` or ). The documentation about the ODSQL `ORDER BY` clause is available [here](https://help.huwise.com/apis/ods-explore-v2/#section/Opendatasoft-Query-Language-%28ODSQL%29/Order-by-clause). |
| `odsAdvAnalysisLimit` | string, optional | Limits the number of items to return. |

#### ODSQL notes (tested against a live portal)

Test a query with `curl` against
`/api/explore/v2.1/catalog/datasets/<id>/records?select=...&where=...&group_by=...`
before putting it in the widget: a malformed query leaves the variable
`undefined` and logs nothing on the page.

- **Date fields compare with date literals:** `calendar_year = date'2024'`.
  A plain `'2024'` fails with `IncompatibleTypesInComparisonFilter`.
- **No `IN` on a function:** `year(calendar_year) in (2005, 2024)` and
  `calendar_year in (date'2005', date'2024')` are syntax errors. Use `OR`.
  `IN` on a plain text field works: `cauthnm IN ("A", "B")`.
- **Declare an alias once.** `select=year(d) as y` together with
  `group_by=year(d) as y` fails with "Alias 'y' is declared several times".
  Put it in `group_by` only; the grouped value still comes back as `y`.
- **Aliases work in `order_by`**, both group aliases (`y desc`) and
  aggregate aliases (`t desc` for `sum(x) as t`).
- **An aggregate with no `group_by`** returned the same row ten times. Group
  by something constant for the filter, such as the year, and read `[0]`.
- **String literals take single or double quotes.** Double quotes, written
  `&quot;` in the attribute, avoid clashes with single quotes in an Angular
  expression.
- **Values repeated on every row** (population or area on a table with one
  row per area, year and category) must not be summed across all rows.
  Filter to a category that has exactly one row per area and year, and sum
  those: check with `group_by=<category>` that its count equals the number
  of areas.

## odsFacetResults

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsFacetResults widget fetches the results of enumerating the values ("categories") of a facet and exposes it in a variable available in the scope. You can use this widget with the AngularJS ngRepeat directive to build a list of results.

The variable is an array of objects, each containing the following properties:

  * `name`: the label of the category
  * `path`: the path to use to refine on this category
  * `state`: "displayed" or "refined"
  * `count`: the number of records in this category

#### Usage

as attribute

```html
<ANY ods-facet-results="{string}"
     ods-facet-results-context="{CatalogContext|DatasetContext}"
     ods-facet-results-facet-name="{string}"
     ods-facet-results-sort="{string}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsFacetResults` | string | Variable name to use _(default: results)_ |
| `odsFacetResultsContext` | CatalogContext or DatasetContext | Catalog Context or Dataset Context to use |
| `odsFacetResultsFacetName` | string | Name of the facet to enumerate |
| `odsFacetResultsSort` | string | Sorting method used on categories:<br>* `count` or `-count` to sort by number of items in each category<br>* `num` or `-num` to sort by the name of category, if it is a number<br>* `alphanum` or `-alphanum` to sort by the name of the category<br>Note: the `-` character before the name of the sorting method indicates that values will be sorted in descending order instead of ascending order. _(default: count)_ |

## odsDomainStatistics

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsDomainStatistics widget enumerates statistic values for a given catalog and injects them as variables in the context.

The following AngularJS variables are available:

  * `CONTEXTNAME.stats.dataset`: the number of datasets
  * `CONTEXTNAME.stats.keyword`: the number of keywords
  * `CONTEXTNAME.stats.publisher`: the number of publishers
  * `CONTEXTNAME.stats.theme`: the number of themes

#### First syntax: when declaring a catalog context, directly inject these values

```html
<ods-catalog-context context="catalog" catalog-domain="dataset" ods-domain-statistics>
    {{ catalog.stats.dataset }} datasets
</ods-catalog-context>
```

#### Second syntax : inject them using a dedicated tag

```html
<ods-domain-statistics context="catalog">
    {{ catalog.stats.dataset }} datasets
</ods-domain-statistics>
```

#### Usage

as element:

```html
<ods-domain-statistics
       context="{DatasetContext}">
</ods-domain-statistics>
```

as attribute

```html
<ANY ods-domain-statistics
     context="{DatasetContext}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | Catalog Context to use |
