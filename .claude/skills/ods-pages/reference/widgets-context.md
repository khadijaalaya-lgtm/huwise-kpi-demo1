# Contexts and schema

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsDatasetContext

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsDatasetContext widget represents a dataset from a chosen domain and a set of parameters used to query its data. One or more widgets can use odsDatasetContext: it allows them to share information (i.e., the query parameters).

For example, a widget that displays a filter (odsFacets) can be plugged into the same context as a table view widget (odsTable) so that the user can filter the data displayed in the table.

odsDatasetContext creates a new child scope, within which its declared contexts are available for any other widget used inside that odsDatasetContext element. odsDatasetContext widgets can also be nested inside each other.

A single odsDatasetContext can declare one or several contexts, which are initialized when declared through the **context** parameter. Each context is configured using parameters prefixed by the context name (`contextname-setting`, e.g., mycontext-domain).

**Properties of odsDatasetContext used as variable**

Once created, the context is accessible as a variable named after it. The context contains properties that can be accessed directly:

  * `domainUrl`: full URL of the domain of the context that can be used to create links
  * `parameters`: parameters object of the context
  * `dataset`: dataset object for the context
  * `getDownloadURL(format[, dict options])`: method that returns a URL to download the data, including currently active filters (e.g. refinements, queries etc.). By default the URL will allow downloading a CSV export, but another format can be passed, such as "geojson" or "json". Two optional parameters are also available: `{'use_labels_for_header': '<true/false>', 'fields': '<list of comma separated field name>'}`
  * `getQueryStringURL([dict options])`: method that builds the URL suffix (`?key1=value1&key2=value2&...`) based on context parameters (active filters, refinement, sort, query, etc.). The optional dictionary parameter allows building the URL with additional key/value parameters.
  * `getV2DownloadURL(format[, dict options])`: method that returns an Explore API V2.1 URL to download the data, including currently active filters. It can be used to export Explore API V2.1 specific formats such as "xlsx". An optional parameter is available: `{'fields': '<list of comma separated field name>'}`
  * `getV2QueryStringURL([dict options])`: method that builds the URL suffix (`?key1=value1&key2=value2&...`) based on context parameters, intended for an Explore API V2.1 URL. The optional dictionary parameter allows building the URL with additional key/value parameters.

#### Usage

as element:

```html
<ods-dataset-context
       context="{string}"
       dataset="{string}"
       domain="{string}"
       apikey="{string}"
       sort="{string}"
       parameters="{object}"
       refresh-delay="{number}"
       parameters-from-context="{string}"
       url-sync="{boolean}">
</ods-dataset-context>
```

as attribute

```html
<ANY ods-dataset-context
     context="{string}"
     dataset="{string}"
     domain="{string}"
     apikey="{string}"
     sort="{string}"
     parameters="{object}"
     refresh-delay="{number}"
     parameters-from-context="{string}"
     url-sync="{boolean}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | string | _(mandatory)_ Name, or list of names separated by commas, of context(s) to declare. Context names must be in lowercase, can only contain alphanumerical characters, and cannot begin with a number, "data", or "x". |
| `dataset` | string | _(mandatory)_ Identifier of the dataset(s) on which the context is based. |
| `domain` | string | Domain where the dataset(s) can be found. Since the domain value is used to construct a URL to an API root, it can be:<br>* an alphanumeric string (e.g., _mydomain_): it will assume that it is a Huwise domain (e.g., _mydomain.huwise.com_)<br>* a hostname (e.g., _data.mydomain.com_)<br>* a relative path (e.g., _/monitoring_): it will be relative to the hostname of the current page<br>* a hostname and a path (e.g., _data.mydomain.com/monitoring_)<br>By default, if the domain parameter is not set, ODSWidgetsConfig.defaultDomain is used. _(default: ODSWidgetsConfig.defaultDomain)_ |
| `apikey` | string | API key to use in every API call for the context (see [Generating an API key](https://userguide.huwise.com/en/articles/2044226)). _(default: none)_ |
| `sort` | string | Sorts expression to apply by default to all widgets plugged to the declared context. The expression should be written using one of the following syntaxes:<br>* `field` for an ascending order,<br>* `-field` for a descending order.<br>_(default: none)_ |
| `parameters` | object | Object holding parameters to apply to the context when it is created. Any parameter from the API can be used here (such as `q` or `refine.FIELD`). _(default: none)_ |
| `refreshDelay` | number | Number of milliseconds to wait before the context is automatically refreshed. If this parameter is not set, the context will not automatically refresh. The minimum delay is 10000ms. _(default: none)_ |
| `parametersFromContext` | string | Name of another declared context to replicate the parameters and queries from. Any modification on the parameters of this context or the original one will be applied to both. _(default: none)_ |
| `urlSync` | boolean | Enables the synchronization of the parameters to the page's parameters (query string). When sharing the page with parameters in the URL, the context will use them; and if the context parameters change, the URL parameters will change. Note: if this parameter is enabled, `parameters` and `parametersFromContext` won't have any effect. There can only be a single context with URL synchronization enabled. Else the behavior will be unpredictable. _(default: none)_ |

## odsCatalogContext

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsCatalogContext widget represents the entire catalog of datasets of a chosen domain and a set of parameters used to query this catalog. One or more widgets can use a catalog context: it allows them to share information (i.e., the query parameters).

For example, a widget that displays a time filter (odsTimerange) can be plugged into the same context as a results list (odsResultEnumerator) so that the user can filter the displayed results.

odsCatalogContext creates a new child scope, within which its declared contexts are available for any other widget used inside that odsCatalogContext element. odsCatalogContext widgets can also be nested inside each other.

A single odsCatalogContext can declare one or several contexts, which are initialized when declared through the **context** parameter. Each context is configured using parameters prefixed by the context name (`contextname-setting`, e.g., mycontext-domain).

**Properties of odsCatalogContext used as variable**

Once created, the context is accessible as a variable named after it. The context contains properties that can be accessed directly:

  * `domainUrl`: full URL of the domain of the context that can be used to create links
  * `parameters`: parameters object of the context

#### Usage

as element:

```html
<ods-catalog-context
       context="{string}"
       domain="{string}"
       apikey="{string}"
       parameters="{object}"
       url-sync="{boolean}">
</ods-catalog-context>
```

as attribute

```html
<ANY ods-catalog-context
     context="{string}"
     domain="{string}"
     apikey="{string}"
     parameters="{object}"
     url-sync="{boolean}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | string | _(mandatory)_ Name, or list of names separated by commas, of context(s) to declare. Context names must be in lowercase, can only contain alphanumerical characters, and cannot begin with a number, "data", or "x". |
| `domain` | string | Domain where the dataset(s) can be found. Since the domain value is used to construct an URL to an API root, it can be:<br>* an alphanumeric string (e.g., _mydomain_): it will assume that it is a Huwise domain (e.g., _mydomain.huwise.com_)<br>* a hostname (e.g., _data.mydomain.com_)<br>* a relative path (e.g., _/monitoring_): it will be relative to the hostname of the current page<br>* a hostname and a path (e.g., _data.mydomain.com/monitoring_)<br>By default, if the domain parameter is not set, ODSWidgetsConfig.defaultDomain is used. _(default: ODSWidgetsConfig.defaultDomain)_ |
| `apikey` | string | API key to use in every API call for the context. For more information, see [Generating an API key](https://userguide.huwise.com/en/articles/2044226)). _(default: none)_ |
| `parameters` | object | Object holding parameters to apply to the context when it is created _(default: none)_ |
| `urlSync` | boolean | Enables synchronization of the parameters to the page's parameters (query string). When sharing the page with parameters in the URL, the context will use them; and if the context parameters change, the URL parameters will change as well. Note that if this parameter is enabled, `parameters` and `parametersFromContext` won't have any effect. There can also only be a single context with URL synchronization enabled, else the behavior will be unpredictable. _(default: none)_ |

## odsDatasetSchema

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsDatasetSchema widget displays a table describing the schema of a dataset. For each field, it provides the label, name, description, type, and an example.

#### Usage

as element:

```html
<ods-dataset-schema
       context="{DatasetContext}">
</ods-dataset-schema>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | Dataset Context |

## odsPageRefresh

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsPageRefresh widget can be used to periodically refresh the page.

#### Usage

as element:

```html
<ods-page-refresh
       delay="{Number}">
</ods-page-refresh>
```

as attribute

```html
<ANY ods-page-refresh
     delay="{Number}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `delay` | Number | The number of milliseconds to wait before refreshing the page. The minimum value is `10000`. _(default: 10000)_ |

## odsTimer

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsTimer widget is a simple timer. It executes the AngularJS expression `exec` every `delay` milliseconds. It doesn't stop until the user clicks on the pause button or when the `stopCondition` is true.

It can be used to animate dashboards to go over a date field and add one day every two seconds, like in the following example. "From" and "To" values will increase by one day until the user clicks on the pause button.

#### Usage

as element:

```html
<ods-timer
       delay="{Number}"
       stop-condition="{Expression}"
       auto-start="{Boolean}"
       [exec]="{Expression}">
</ods-timer>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `delay` | Number | The number of milliseconds to wait before executing the expression. The minimum value is `100`. _(default: 1000)_ |
| `stopCondition` | Expression | An AngularJS expression returning 'true' or 'false'. The timer stops when the condition is 'false'. _(default: false)_ |
| `autoStart` | Boolean | Starts the timer automatically when the page loads. _(default: false)_ |
| `exec` | Expression, optional | An AngularJS expression to execute. |

## odsDatetime

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsDatetime widget gets the ISO local datetime and stores it into a variable (into the scope).

It is an equivalent to moment().format() javascript call. The current scope gains a refreshDatetime method that will refresh the variable with the current datetime.

#### Usage

as attribute

```html
<ANY ods-datetime>
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

## odsToggleModel

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsToggleModel widget, when used on a checkbox, allows the checkbox to be used to "toggle" a value in an object. In other words, the value is added when the checkbox is selected and removed when the checkbox is cleared.

Multiple checkboxes can be used on the same model and key, in which case if two or more are toggled, an array will be created to hold the values.

#### Usage

as attribute

```html
<ANY ods-toggle-model="{Object}"
     ods-toggle-key="{string}"
     ods-toggle-value="{string}"
     ods-store-as="{string}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsToggleModel` | Object | Object to apply the toggle on |
| `odsToggleKey` | string | The key holding the toggled value |
| `odsToggleValue` | string | The toggled value |
| `odsStoreAs` | string | The type of the resulting variable. The authorized values are 'array' and 'csv'. _(default: array)_ |
