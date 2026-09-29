# Tables and result lists

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsTable

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsTable widget displays a table view of a dataset, with infinite scroll and an ability to sort columns depending on the column types.

#### Usage

as element:

```html
<ods-table
       context="{DatasetContext}"
       displayed-fields="{string}">
</ods-table>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | Dataset Context to use |
| `displayedFields` | string | A comma-separated list of fields to display. By default, all the available fields are displayed. _(default: all)_ |

## odsCrossTable

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsCrossTable widget creates a cross table from a context. It supports multiple aggregations for a single column field and multiple row fields.

#### Usage

as element:

```html
<ods-cross-table
       context="{DatasetContext}"
       rows="{string}"
       column="{string}"
       serie-xxx-label="{string}"
       serie-xxx-func="{string}"
       serie-xxx-expr="{string}"
       repeat-row-headers="{boolean}"
       display-intermediary-results="{boolean}"
       number-precision="{integer}">
</ods-cross-table>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | Dataset Context from which data is extracted |
| `rows` | string | A comma-separated list of field names which will be used for row headers' values. These fields must all be facets. |
| `column` | string | Name of the field which will be used for column header's values. This field must be a facet. |
| `serieXxxLabel` | string | Label of the series, which will be displayed as column header (Xxx being the name of the series). |
| `serieXxxFunc` | string | Function (SUM, AVG, COUNT, etc.) used to aggregate the series analysis (Xxx being the name of the series) |
| `serieXxxExpr` | string | Name of the field used for the series analysis (Xxx being the name of the series) |
| `repeatRowHeaders` | boolean | Controls whether to repeat the row headers on each line or not. _(default: false)_ |
| `displayIntermediaryResults` | boolean | Controls whether to display intermediary subtotals, subaverages, etc. _(default: false)_ |
| `numberPrecision` | integer | The number of decimals to display for numeric values _(default: 3)_ |

## odsAdvTable

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsAdvTable widget is used to analyze data from a table perspective.

It is especially interesting to use this widget in conjunction with an odsAdvAnalysis widget, but you can feed it with static data. The odsAdvTable widget gives you the ability to:

  * compute totals,
  * sort, reorder and rename columns,
  * format numbers as text and define the number of decimal places to round the number to, and
  * set the header and/or the first column in a fixed position.

#### Usage

as element:

```html
<ods-adv-table
       data="{array}"
       [columns-order]="{array}"
       [columns-options]="{object}"
       [sort]="{string}"
       [totals]="{array}"
       sticky-header="{boolean}"
       sticky-first-column="{boolean}">
</ods-adv-table>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `data` | array | The input array of value which feeds the table. |
| `columnsOrder` | array, optional | An array of strings representing the columns' order. |
| `columnsOptions` | object, optional | An object representing the formatting to apply on the columns. Two options are available: `label` is used to rename the column's header and `decimals` to set the number of decimals on each cell of the column (e.g., `{ label: 'New name', decimals: 2 }`). |
| `sort` | string, optional | Name of the column to sort on, following by the suffix `ASC` or `DESC` (e.g., `columnName ASC`). |
| `totals` | array, optional | An array of strings containing the names of the columns whose totals must be calculated. |
| `stickyHeader` | boolean | When set to `true`, the header will be fixed at the top of the table. _(default: false)_ |
| `stickyFirstColumn` | boolean | When set to `true`, the first column will be fixed on the left side of the table. _(default: false)_ |

## odsResults

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsResults widget exposes the results of a search as an array in a variable available in the scope. It can be used with the AngularJS ngRepeat directive to build a list of results simply. It also adds to the context variable a `nhits` property containing the total number of records matching the query regardless of the odsResultsMax value.

#### Usage

as attribute

```html
<ANY ods-results="{string}"
     ods-results-context="{CatalogContext|DatasetContext}"
     ods-results-max="{number}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsResults` | string | Variable name to use _(default: results)_ |
| `odsResultsContext` | CatalogContext or DatasetContext | Catalog Context or Dataset Context to use |
| `odsResultsMax` | number | Maximum number of results to show. The value can be changed dynamically using a variable. _(default: 10)_ |

## odsResultEnumerator

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsResultEnumerator widget enumerates the search results (records for a Dataset Context, datasets for a Catalog Context). It repeats the template (the content of the directive element) for each of them.

If used with a Catalog Context, for each result, the following AngularJS variables are available:

  * `item.datasetid`: Dataset identifier of the dataset
  * `item.metas`: An object holding the key/values of metadata for this dataset

If used with a Dataset Context, for each result, the following AngularJS variables are available:

  * `item.datasetid`: Dataset identifier of the dataset this record belongs to
  * `item.fields`: an object hold all the key/values for the record
  * `item.geometry`: if the record contains geometrical information, this object is present and holds its GeoJSON representation

#### Usage

as element:

```html
<ods-result-enumerator
       context="{CatalogContext|DatasetContext}"
       max="{number}"
       show-hits-counter="{boolean}"
       show-pagination="{boolean}">
</ods-result-enumerator>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext or DatasetContext | Catalog Context or Dataset Context to use |
| `max` | number | Maximum number of results to show. The value can be changed dynamically using a variable. _(default: 10)_ |
| `showHitsCounter` | boolean | Displays the number of hits (search results). This is the number of results available on the API, not the number of results displayed in the widget. _(default: false)_ |
| `showPagination` | boolean | Displays a pagination block below the results to be able to browse them all. _(default: false)_ |

## odsInfiniteScrollResults

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsInfiniteScrollResults widget displays the results of a query inside an infinite scroll list. It uses the HTML template inside the widget tag and repeats it for each result.

If used with a Catalog Context, for each result, the following AngularJS variables are available:

  * item.datasetid: Dataset identifier of the dataset
  * item.metas: An object holding the key/values of metadata for this dataset

If used with a Dataset Context, for each result, the following AngularJS variables are available:

  * item.datasetid: Dataset identifier of the dataset this record belongs to
  * item.fields: An object holding all the key/values for the record
  * item.geometry: if the record contains geometrical information, this object is present and holds its GeoJSON representation

#### Usage

as attribute

```html
<ANY ods-infinite-scroll-results
     ods-results-context="{CatalogContext|DatasetContext}"
     scroll-top-when-refresh="{boolean}"
     list-class="{string}"
     result-class="{string}"
     [no-results-message]="{string}"
     [no-more-results-message]="{string}"
     [no-data-message]="{string}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsResultsContext` | CatalogContext or DatasetContext | Catalog Context or Dataset Context to use |
| `scrollTopWhenRefresh` | boolean | If the context parameters change (which will probably change the results), the widget scrolls to the top of the window. _(default: false)_ |
| `listClass` | string | A class (or classes) that will be applied to the list of result _(default: none)_ |
| `resultClass` | string | A class (or classes) that will be applied to each result _(default: none)_ |
| `noResultsMessage` | string, optional | A sentence that will be displayed if there are no results |
| `noMoreResultsMessage` | string, optional | A sentence that will be displayed if there are no more results to fetch |
| `noDataMessage` | string, optional | A sentence that will be displayed if the context has no content at all |

## odsPaginationBlock

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsPaginationBlock widget displays a pagination control that you can use to make the context "scroll" through a list of results.

The widget doesn't display results. Therefore, it should be paired with another widget. The widget doesn't control the number of results fetched by the context. The `perPage` parameter should be the same as the `rows` parameter on the context.

If you just want to display results with a pagination system, you can use odsResultEnumerator, which already includes this directive (if the relevant parameter is active on the widget).

#### Usage

as element:

```html
<ods-pagination-block
       context="{CatalogContext|DatasetContext}"
       per-page="{number}"
       nofollow="{boolean}"
       [container-identifier]="{string}">
</ods-pagination-block>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext or DatasetContext | Catalog Context or Dataset Context to use |
| `perPage` | number | Controls the number of results per page. _(default: 10)_ |
| `nofollow` | boolean | When set to `true`, all links within the widget (used to change page) will contain a `rel="nofollow"` attribute. It should be used if you don't want search engines to crawl all the pages of your widget. _(default: false)_ |
| `containerIdentifier` | string, optional | By default, changing the page will trigger a scroll to the top of the window. You can use this parameter to specify the ID of the element that will contain the results (e.g., "my-results") so that the behavior is more precise:<br>* If your results are inside a container that is used to vertically scroll the results, the container's scroll will be set at the start.<br>* If your results are inside a container that doesn't have a scrollbar, the page itself will scroll to the start of the container. Note: In the second situation, some CSS properties may prevent the widget from understanding that it doesn't have a scrollbar. As a result, the widget won't be able to scroll scrolling to the top of the container. This issue may be caused by the odsPaginationBlock widget slightly overflowing its container, typically because of large fonts or higher line-height settings. In this situation, forcing a height on the widget may fix the issue. |

## odsCalendar

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsCalendar widget can take any dataset containing at least two datetime fields and a text field and use it to display a calendar. It can load at most 1000 events (records) at once.

#### Usage

as element:

```html
<ods-calendar
       context="{DatasetContext}"
       start-field="{string}"
       end-field="{string}"
       title-field="{string}"
       event-color="{string}"
       tooltip-fields="{string}"
       calendar-view="{string}"
       available-calendar-views="{string}"
       [sync-to-url]="{boolean}">
</ods-calendar>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | Dataset Context to use |
| `startField` | string | The name of the datetime field to use as event start datetime |
| `endField` | string | The name of the datetime field to use as event end datetime |
| `titleField` | string | The name of the text field to use as event title |
| `eventColor` | string | The color (in hexadecimal form) used for all events _(default: #C32D1C)_ |
| `tooltipFields` | string | An ordered, comma-separated list of fields to display in the event tooltip _(default: none)_ |
| `calendarView` | string | The default mode for the calendar. The authorized values are 'month', 'agendaWeek', and 'agendaDay'. _(default: month)_ |
| `availableCalendarViews` | string | A comma-separated list of available views for the calendar. It must be a sub list of ['month', 'agendaWeek', 'agendaDay']. _(default: 'month','agendaWeek','agendaDay')_ |
| `syncToUrl` | boolean, optional | When set to `true`, it persists the `calendarView` in the page URL. |
