# Filtering and search

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsFacets

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsFacets widget displays filters based on a dataset or a domain's catalog of datasets. This widget allows to dynamically refine on one or more categories for the defined context (i.e., each filter being composed of several categories, which are values of the field the filter is based on).

For example, odsFacet can be used to refine the data displayed in a table (odsTable) to see only the desired data.

Suppose the widget is used without any configuration. In that case, it will display by default filters from all the "facet" fields of a dataset when used with a Dataset Context. It will display by default filters from typical metadata from a dataset catalog when used with a Catalog Context.

```html
<ods-facets context="mycontext"></ods-facets>
```

**odsFacet**

The odsFacet widget is a widget that can only be used based on odsFacets. It is used to configure which facets should be displayed by odsFacets, since odsFacets used alone does not allow to display only specific facets among all the default ones of the dataset. odsFacet supports the following parameters:

  * name
  * sort
  * visibleItems
  * hideIfSingleCategory
  * hideCategoryIf

Note: these parameters are the same as some used for odsFacets. For more information about configuration, see the odsFacets parameters table.

odsFacet allows to configure which facets are displayed using the **name** parameter.

```html
<ods-facets context="mycontext">
    <h3>First field</h3>
    <ods-facet name="myfield"></ods-facet>

    <h3>Second field</h3>
    <ods-facet name="mysecondfield"></ods-facet>
</ods-facets>
```

Regular HTML is supported within the odsFacet tag to change the display template of each category. The available variables within the template are:

  * `facetName`: name of the field that the filter is based on
  * `category.name`: value of the category
  * `category.path`: complete path to the category, including hierarchical levels
  * `category.state`: refined, excluded, or displayed

An `ng-non-bindable` wrapper element must be used around the display template for it to work properly. Note: There must not be any space character between the odsFacet tag and the span element, as it may prevent the widget from working properly.

```html
<ods-facets context="mycontext">
    <ods-facet name="myfield"><span ng-non-bindable>
        {{category.name}} @ {{category.state}}
    </span></ods-facet>
</ods-facets>
```

#### Usage

as element:

```html
<ods-facets
       context="{DatasetContext}"
       name="{string}"
       title="{string}"
       sort="{string}"
       visible-items="{number}"
       hide-if-single-category="{boolean}"
       hide-category-if="{string}"
       disjunctive="{boolean}"
       timerange-filter="{boolean}"
       context="{string}"
       value-search="{string}"
       refine-also="{DatasetContext|CatalogContext|DatasetContext[]|CatalogContext[]}"
       [context-name]-facet-name="{string}">
</ods-facets>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | _(mandatory)_ Catalog Context or Dataset Context to use |
| `name` | string | _(mandatory)_ Name of the field the filter is based on |
| `title` | string | Title to display above the filter _(default: none)_ |
| `sort` | string | Sorting method used on categories:<br>* `count` or `-count` to sort by number of items in each category<br>* `num` or `-num` to sort by the name of category, if it is a number<br>* `alphanum` or `-alphanum` to sort by the name of the category Note: the `-` character before the name of the sorting method indicates that values will be sorted in descending order instead of ascending order. Configuring a specific order is also possible, by setting a list of value: `['value1', 'value2']`.<br>_(default: -count)_ |
| `visibleItems` | number | Number of categories to show. If there are more categories for the filter, they are collapsed by default, but can be expanded by clicking on a "more" link. _(default: 6)_ |
| `hideIfSingleCategory` | boolean | When set to `true`, hides filters if only one category to refine on is available. _(default: false)_ |
| `hideCategoryIf` | string | AngularJS expression to evaluate: if it evaluates to `true`, the category is displayed. In the expression, the following elements can be used:<br>* `category.name` (value of the category)<br>* `category.path` (complete path to the category, including hierarchical levels)<br>* `category.state` (refined, excluded, or displayed)<br>_(default: none)_ |
| `disjunctive` | boolean | When set to `true`, the filter is in disjunctive mode, which means that other available values can also be selected after a first value is selected. All selected values are combined as "or". For example, after clicking "red", "green" and "blue" can also be clicked. The resulting values can be green, red, or blue. Note: this parameter is directly related to the schema of the dataset. For this parameter to work properly, the field must allow multiple selections in filters. For more information, see [Defining a dataset schema](https://userguide.huwise.com/en/articles/2044866)). _(default: false)_ |
| `timerangeFilter` | boolean | When set to `true`, an option to filter using a time range is displayed above the categories. This parameter only works for date and datetime fields and must be used with a context (see **context** parameter). _(default: false)_ |
| `context` | string | Name of the context to refine on. This parameter is mandatory for the **timerangeFilter** parameter. _(default: none)_ |
| `valueSearch` | string | When set to `true`, a search box is displayed above the categories to search within the available categories. If `suggest`, the matching categories are not displayed until there is at least one character typed into the search box, effectively making it into a suggest-like search box. _(default: none)_ |
| `refineAlso` | DatasetContext or CatalogContext or DatasetContext[] or CatalogContext[] | Enables the widget to apply its refinements on other contexts, e.g., for contexts which share a common data. The value of this parameter should be the name of another context or a list of contexts. _(default: none)_ |
| `[contextName]FacetName` | string | Name of the facet in one of the other contexts, defined through the **refineAlso** parameter, that the original facet should be mapped on. `[contextName]` must be replaced with the name of that other context. _(default: Current facet's name)_ |

#### Notes

The parameters listed above (`name`, `title`, `sort`, `visibleItems`,
`disjunctive`, `hideIfSingleCategory`) go on the **`<ods-facet>` children**,
not on `<ods-facets>` itself. The parent takes only `context`.

`odsFacet` is a real directive in the widget library but has no page of its
own in the documentation, which is why it appears nowhere in the index.

```html
<ods-facets context="epc">
    <ods-facet name="current_energy_rating" title="Rating"></ods-facet>
    <ods-facet name="local_authority_label" title="Authority"
               visible-items="5" sort="-count"></ods-facet>
</ods-facets>
```

Each `name` must be a field **declared as a facet** on the dataset. An
undeclared field renders an empty filter with its title and nothing beneath.

## odsFilterSummary

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsFilterSummary widget displays a summary of all the active filters in a context: text search, refinements, etc.

#### Usage

as element:

```html
<ods-filter-summary
       context="{CatalogContext|DatasetContext|CatalogContext[]|DatasetContext[]}"
       exclude="{string}"
       clear-all-button="{boolean}"
       hide-contexts-labels="{boolean}"
       [mycontext-label]="{string}">
</ods-filter-summary>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext or DatasetContext or CatalogContext[] or DatasetContext[] | Catalog Context or Dataset Context to display the filters of. Can also be a list of contexts. |
| `exclude` | string | Optional: Name of parameters not to display, separated by commas. For example, `q,rows,start` _(default: none)_ |
| `clearAllButton` | boolean | Optional: display a "clear all" button underneath the active filters' list. _(default: true)_ |
| `hideContextsLabels` | boolean | Optional: if you are working with multiple contexts, the context's label will be displayed within the filter. Set this option to true if you'd like not to display those. _(default: false)_ |
| `mycontextLabel` | string, optional | Optional: if you are working with multiple contexts, the context's name (that is "mycontext") will be displayed within the filter. Use this option to specify a custom label. |

## odsClearAllFilters

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsClearAllFilters widget displays a button that will clear all active filters in the given context.

#### Usage

as element:

```html
<ods-clear-all-filters
       context="{CatalogContext|DatasetContext|CatalogContext[]|DatasetContext[]}"
       except="{String[]}">
</ods-clear-all-filters>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext or DatasetContext or CatalogContext[] or DatasetContext[] | Catalog Context or Dataset Context to display the filters of, or a list of contexts |
| `except` | String[] | An array of parameters to exclude from the clearing operation |

## odsSearchbox

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsSearchbox widget displays a wide search box that redirects the search on the Explore homepage of the domain.

#### Usage

as element:

```html
<ods-searchbox
       placeholder="{string}"
       sort="{string}"
       context="{CatalogContext}"
       [autofocus]="{string}"
       form-id="{string}">
</ods-searchbox>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `placeholder` | string | Controls the text to display as a placeholder when the search box is empty. |
| `sort` | string | Controls the default sort order for the results. |
| `context` | CatalogContext | Catalog Context indicating the domain to redirect the user to show the search results. If `none`, the search is performed on the local domain; that is, the domain to which the widget has been added. _(default: none)_ |
| `autofocus` | string, optional | Adds the autofocus attribute to set the focus in the text search input. No value is required. |
| `formId` | string | Configures the `id` attribute of the form generated internally by the widget, which can be used from other HTML elements. For example, it can be used to submit the search from another button. _(default: none)_ |

## odsTextSearch

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsTextSearch widget displays a search box to perform a full-text search in a context.

#### Usage

as element:

```html
<ods-text-search
       context="{CatalogContext|DatasetContext|CatalogContext[]|DatasetContext[]}"
       placeholder="{string}"
       field="{string}"
       suffix="{string}"
       autofocus="{string}"
       id="{string}">
</ods-text-search>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext or DatasetContext or CatalogContext[] or DatasetContext[] | _(mandatory)_ Catalog Context, Dataset Context, or array of context to use |
| `placeholder` | string | Text to display as a placeholder when the search box is empty _(default: none)_ |
| `field` | string | Name of a field the search will be restricted on (i.e., the widget will only allow to search on the textual content of the chosen field). If more than one context is declared, it is possible to specify different fields depending on these contexts, using the following syntax: mycontext-field. If a specific field is not set for a context, the value of the field parameter will be used by default. The search will be a simple text search that won't support query languages and operators. _(default: none)_ |
| `suffix` | string | Changes the default `q` query parameter into `q.suffixValue`. This parameter prevents widgets from overriding one another, for instance when multiple odsTextSearch widgets are used on the same page. _(default: none)_ |
| `autofocus` | string | Makes the search box automatically selected at loading of the page to start typing the search without selecting the search box manually beforehand. No value is required for this parameter to function. |
| `id` | string | Adds an `id` attribute to the search's text box, for example, to integrate the widget to a clickable label. |

## odsSelect

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsSelect widget shows a list of options from which users can select one or more options. This list can be made up of strings or objects.

If the `options` variable provided to the widget represents a simple array of strings, option labels and values will be automatically calculated by the widget. If the options provided to the widget are objects, use the `label-modifier` and `value-modifier` parameters to define how to handle those objects.

The `label-modifier` and `value-modifier` parameters each take an expression applied to each object representing an option. Finally, the selection will be stored in the variable specified in the `selected-values` parameter.

#### Explanation of the examples

#### First example

The first example shows a list of options from which users can select one or multiple trees. This example uses the `ods-dataset-context`, `ods-result`, and `ods-select` widgets:

  * The `ods-dataset-context` declares a context based on the `les-arbres-remarquables-de-paris` dataset.
  * The `ods-results` widget is nested within `ods-dataset-context`. It stores the result of the search request in the variable `items`. The value of the variable `items` will have this form:

```html
[
    { fields: { libellefrancais: "Noyer", espece: "nigra",  ... }, ... },
    { fields: { libellefrancais: "Marronnier", espece: "hippocastanum",  ... }, ... },
    { fields: { libellefrancais: "Chêne", espece: "cerris",  ... }, ... },
    ...
]
```

  * The `ods-select` widget is nested within `ods-results`. It defines the list of options users can select, using the `options` parameter set to `items`. `items` corresponds to the variable storing the results in `ods-results`.

**The parameter`label-modifier`**

In this example, the desired value for the option label is the field `libellefrancais` from the source dataset. To access the value of this field, the `label-modifier` parameter for `ods-select` is set to `"fields.libellefrancais"`.

**The parameter`value-modifier`**

The desired structure for the values returned by `selected-values` is the following:

```html
[
    { name: "Noyer", species: "nigra" },
    { name: "Marronnier", species: "hippocastanum" },
    ...
]
```

To achieve this, the `value-modifier` for `ods-select` is set to `"{ 'name': fields.libellefrancais, 'species': fields.espece }"`.

#### Second example

The second example shows two lists of options from which users can select one or multiple options:

  * From the first list, users can select districts.
  * From the second list, users can select tree species.

In the second example, context parameters are updated by injecting the selected values returned by `ods-select`. This example uses the `ods-dataset-context`, `ods-result`, and `ods-select` widgets:

  * The `ods-dataset-context` declares a context based on the `les-arbres-remarquables-de-paris` dataset.
  * Two `ods-results` widgets are nested within `ods-dataset-context`. They fetch the values of the facets "arrondissement" and "libellefrancais" from the source dataset and store them in the variables `facetsArrondissement` and `facetsLibelleFrancais`, respectively. The values of `facetsArrondissement` and `facetsLibelleFrancais` will have this form:

```html
[
    { count: 1, path: "PARIS 1ER ARRDT", state: "displayed", name: "PARIS 1ER ARRDT" },
    { count: 8, path: "PARIS 17E ARRDT", state: "displayed", name: "PARIS 17E ARRDT" },
    { count: 11, path: "PARIS 7E ARRDT", state: "displayed", name: "PARIS 7E ARRDT" },
    ...
]
```

```html
[
    { count: 32, path: "Platane", state: "displayed", name: "Platane" },
    { count: 12, path: "Hêtre", state: "displayed", name: "Hêtre" },
    { count: 11, path: "Chêne", state: "displayed", name: "Chêne" },
    ...
]
```

  * An `ods-select` widget is nested within each `ods-results`. They define the lists of options users can select, using the `options` parameter set to `facetsArrondissement` and `facetsLibelleFrancais`, respectively. To update the context each time an option is selected, the `selected-values` parameters for `ods-select` are set to `ctx.parameters['refine.arrondissement']` and `ctx.parameters['refine.libellefrancais']`, respectively.

#### Usage

as element:

```html
<ods-select
       options="{array}"
       selected-values="{array}"
       label-modifier="{expression}"
       value-modifier="{expression}"
       on-change="{expression}"
       multiple
       is-loading="{boolean}"
       disabled
       placeholder="{string}">
</ods-select>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `options` | array | The input array of value which feeds the list of options |
| `selectedValues` | array | The variable name to use to store the selected options' values |
| `labelModifier` | expression | An expression to apply on the options' label _(default: none)_ |
| `valueModifier` | expression | An expression to apply on the options' value. This parameter is used to modify the form of the values exposed by `selected-value`. _(default: none)_ |
| `onChange` | expression | An expression to evaluate whenever an option has been (de)selected _(default: none)_ |
| `multiple` | boolean | When set to `true`, the menu will support multiple selections. _(default: false)_ |
| `isLoading` | boolean | Specifies whether the widget should initially display a loader. This parameter will be automatically set to `false` as soon as options are loaded. _(default: false)_ |
| `disabled` | boolean | Specifies whether the widget should be disabled. _(default: false)_ |
| `placeholder` | string | Specifies a short hint that describes the expected value of the select field. _(default: "Select one or more elements" or "Select one element")_ |

## odsTimerange

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsTimerange widget displays two fields to select the two bounds of a date and time range.

The values for the `defaultTo` and `defaultFrom` parameters MUST be in `YYYY-MM-DD HH:mm` (or `YYYY-MM-DD` for date only) whatever the displayFormat.

#### Usage

as element:

```html
<ods-timerange
       context="{DatasetContext|DatasetContext[]}"
       [time-field="{string}"]
       [{context}-time-field="{string}"]
       default-from="{string}"
       default-to="{string}"
       display-time="{string}"
       date-format="{string}"
       suffix="{string}"
       label-from="{string}"
       label-to="{string}"
       placeholder-from="{string}"
       placeholder-to="{string}"
       to="{string}"
       from="{string}">
</ods-timerange>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext or DatasetContext[] | Dataset Context or array of context to use |
| `timeField _(optional)_` | string | The value is the name of the field (date or datetime) to filter on.<br>_Use this form if you apply the timerange to only one context._ _(default: first date/datetime field available)_ |
| `{context}TimeField _(optional)_` | string | The value is the name of the field (date or datetime) to filter on.<br>_Use this form when you apply the timerange to multiple contexts. {context} must be replaced by the context name._ _(default: first date/datetime field available)_ |
| `defaultFrom` | string | Default datetime for the "from" field: either "yesterday", "now" or a string representing a date. This value always uses the `YYYY-MM-DD HH:mm` or `YYYY-MM-DD` format. _(default: none)_ |
| `defaultTo` | string | Default datetime for the "to" field: either "yesterday", "now", or a string representing a date. This value always uses the `YYYY-MM-DD HH:mm` or `YYYY-MM-DD` format. _(default: none)_ |
| `displayTime` | string | Defines if the date selector displays the time selector as well _(default: true)_ |
| `dateFormat` | string | Defines the format for the date displayed in the inputs _(default: 'YYYY-MM-DD HH:mm')_ |
| `suffix` | string | (optional) Adds a suffix to the q.timerange, q.from_date or q.to_date parameter. This prevents widgets from overriding each other. _(default: 'fieldname')_ |
| `labelFrom` | string | Sets the label before the first input _(default: 'From')_ |
| `labelTo` | string | Sets the label before the second input _(default: 'to')_ |
| `placeholderFrom` | string | Sets the label before the first input _(default: '')_ |
| `placeholderTo` | string | Sets the label before the second input _(default: '')_ |
| `to` | string | Sets a variable that will get the iso formatted value of the first input _(default: none)_ |
| `from` | string | Sets a variable that will get the iso formatted value of the second input _(default: none)_ |

## odsDateRangeSlider

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsDateRangeSlider widget displays a range slider to select the two bounds of a date range.

#### Usage

as element:

```html
<ods-date-range-slider
       context="{DatasetContext|DatasetContext[]}"
       initial-from="{string}"
       initial-to="{string}"
       start-bound="{expression}"
       end-bound="{expression}"
       date-format="{string}"
       date-field="{string}"
       precision="{string}"
       suffix="{string}"
       to="{string}"
       from="{string}">
</ods-date-range-slider>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext or DatasetContext[] | Dataset Context or array of context to use |
| `initialFrom` | string | Default date for the "from" field: "yesterday", "now", or a string representing a date _(default: none)_ |
| `initialTo` | string | Default date for the "to" field: "yesterday", "now", or a string representing a date _(default: none)_ |
| `startBound` | expression | Beginning bound of the range slider, it will define the minimum selectable from "yesterday", "now", or a string representing a date. As an AngularJS expression is expected, no need to use syntax for variables or expressions, and if you want to provide a static string value, surround it with simple quotes. _(default: none)_ |
| `endBound` | expression | End bound of the range slider, it will define the maximum selectable to "yesterday", "now", or a string representing a date. As an AngularJS expression is expected, no need to use syntax for variables or expressions, and if you want to provide a static string value, surround it with simple quotes. _(default: none)_ |
| `dateFormat` | string | Defines the format to render the two bounds and the selection. _(default: 'YYYY-MM-DD')_ |
| `dateField` | string | Date field to query on. If no field is provided, the first date type field of the dataset is used. _(default: none)_ |
| `precision` | string | Defines the precision, 'day', 'month' or 'year', default is 'day' _(default: 'day')_ |
| `suffix` | string | Context parameter query suffix. Used to avoid collision with other widget queries. _(default: none)_ |
| `to` | string | Sets a variable that will get the iso formatted value of the first input _(default: none)_ |
| `from` | string | Sets a variable that will get the iso formatted value of the second input _(default: none)_ |

## odsTagCloud

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsTagCloud widget displays a "tag cloud" of the values available in a facet. This facet can be the facet of a dataset or a facet from the dataset catalog. The "weight" (size) of a tag depends on the number of occurrences (count) for this tag.

#### Usage

as element:

```html
<ods-tag-cloud
       context="{CatalogContext|DatasetContext}"
       facet-name="{string}"
       max="{number}"
       redirect-to="{string}"
       context-to-refine="{CatalogContext|DatasetContext}">
</ods-tag-cloud>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext or DatasetContext | Catalog Context or Dataset Context to use |
| `facetName` | string | Name of the facet to build the tag cloud from |
| `max` | number | Maximum number of tags to show in the cloud _(default: all)_ |
| `redirectTo` | string | URL. If specified, a click on any tag will redirect to the given URL and apply the filter there. _(default: none)_ |
| `contextToRefine` | CatalogContext or DatasetContext | Specifies the context that will be refined. If not specified at all, the refined context will be the one defined through the `context` parameter. _(default: current context)_ |

## refineOnClick

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The refineOnClick directive will refine the given context(s) for a click on an element representing a record.

It works in conjunction with a finite set of other directives:

  * odsCalendar
  * odsMediaGallery
  * odsMap
  * odsChart
  * odsChartSerie

When clicking on an item, the contexts will be refined using the values in the configured fields. By default, if you click on more than one item, the refinements will add up, which can be useful in situations with multiples values. If you prefer the refinement to be replaced each time you click, you can use `refineOnClickReplaceRefine`.

#### Usage

as attribute

```html
<ANY refine-on-click>
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.
