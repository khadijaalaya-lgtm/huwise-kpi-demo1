# Charts

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsChart

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsChart widget is the base widget allowing to display charts from Huwise datasets. A Chart is defined by one or more series that get their data from form one or more datasets represented by a Dataset Context, a type of chart, and multiple parameters to fine-tune the chart's appearance.

Note: `min` and `max` parameters are dynamic, which means that if they change, the chart will be refreshed accordingly.

Basic example:

```html
<ods-dataset-context context="trees"
                     trees-dataset="les-arbres-remarquables-de-paris"
                     trees-domain="documentation-resources">
    <ods-chart>
        <ods-chart-query context="trees" field-x="espece" maxpoints="10">
            <ods-chart-serie expression-y="circonference_en_cm" chart-type="column" function-y="MAX" color="#66c2a5">
            </ods-chart-serie>
        </ods-chart-query>
    </ods-chart>
</ods-dataset-context>
```

You can display multiple series from the same dataset on the same chart:

```html
<ods-dataset-context context="trees"
                     trees-dataset="les-arbres-remarquables-de-paris"
                     trees-domain="documentation-resources">
    <ods-chart>
        <ods-chart-query context="trees" field-x="espece" maxpoints="10">
            <ods-chart-serie expression-y="circonference_en_cm" chart-type="column" function-y="AVG" color="#66c2a5">
            </ods-chart-serie>
            <ods-chart-serie expression-y="hauteur_en_m" chart-type="column" function-y="AVG" color="#fc8d62">
            </ods-chart-serie>
        </ods-chart-query>
    </ods-chart>
</ods-dataset-context>
```

You can display multiple series from multiple datasets on the same chart:

```html
<ods-dataset-context context="commute,demographics"
                     commute-dataset="commute-time-us-counties"
                     commute-domain="https://documentation-resources.huwise.com/"
                     demographics-dataset="us-cities-demographics"
                     demographics-domain="https://documentation-resources.huwise.com/">
    <ods-chart align-month="true">
        <ods-chart-query context="commute" field-x="state" maxpoints="20">
            <ods-chart-serie expression-y="mean_commuting_time" chart-type="column" function-y="AVG" color="#66c2a5" scientific-display="true">
            </ods-chart-serie>
        </ods-chart-query>
        <ods-chart-query context="demographics" field-x="state" maxpoints="20">
            <ods-chart-serie expression-y="count" chart-type="column" function-y="SUM" color="#fc8d62" scientific-display="true">
            </ods-chart-serie>
        </ods-chart-query>
    </ods-chart>
</ods-dataset-context>
```

#### Usage

as element:

```html
<ods-chart
       timescale="{string}"
       label-x="{string}"
       single-y-axis="{boolean}"
       single-y-axis-label="{string}"
       min="{integer}"
       max="{integer}"
       step="{integer}"
       scientific-display="{boolean}"
       logarithmic="{boolean}"
       display-legend="{boolean}"
       align-month="{boolean}"
       labels-x-length="{integer}">
</ods-chart>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `timescale` | string | Works only with timeseries. If it defines the default timescale to use to display the X-axis. It does not affect how the different series are requested (they have their own timescale) but enforces X-axis intervals. _(default: none)_ |
| `labelX` | string | If set, it overrides the default X-axis label. The default label is generated from the series. _(default: none)_ |
| `singleYAxis` | boolean | Enforces the use of only one Y-axis for all series. In this case, specific Y-axis parameters defined for each series will be ignored. _(default: false)_ |
| `singleYAxisLabel` | string | Sets the label for the single Y-axis. |
| `min` | integer | Sets the min displayed value for Y-axis. Active only when singleYAxis is true. _(default: null)_ |
| `max` | integer | Sets the max displayed value for Y-axis. Active only when singleYAxis is true. _(default: null)_ |
| `step` | integer | Specifies the step between each tick on the Y axis. If not defined, it is computed automatically. Active only when singleYAxis is true. _(default: null)_ |
| `scientificDisplay` | boolean | When set to false, force the full display of the numbers on the Y-axis. Active only when singleYAxis is true. _(default: true)_ |
| `logarithmic` | boolean | Uses a logarithmic scale for Y-axis. Active only when singleYAxis is true. _(default: false)_ |
| `displayLegend` | boolean | Enables or disables the display of series legend. Active only when singleYAxis is true. _(default: true)_ |
| `alignMonth` | boolean | Aligns the month values with the month label. The old behavior aligns values with the middle of the month. Setting this parameter to false reverts to the old behavior. _(default: true)_ |
| `labelsXLength` | integer | Sets the maximum number of characters displayed for the X-axis labels. _(default: 12)_ |

## odsChartQuery

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsChartQuery widget is the sub widget that defines the queries for the series defined inside. For complete examples, see odsChart.

Note: All parameters are dynamic, which means that if they change, the chart will be refreshed accordingly.

#### Usage

as element:

```html
<ods-chart-query
       field-x="{string}"
       timescale="{string}"
       maxpoints="{integer}"
       stacked="{string}"
       reverse-stacks="{boolean}"
       series-breakdown="{string}"
       series-breakdown-timescale="{string}"
       category-colors="{object}"
       sort="{string}">
</ods-chart-query>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `fieldX` | string | Sets the field that is used to compute the aggregations during the analysis query. |
| `timescale` | string | Works only with timeseries (when fieldX is a date or datetime). Y values will be computed against this interval. For example, if you have daily values in a dataset and ask for a "month" timescale, the Y values for the series inside this query will aggregated month by month and computed. _(default: "year")_ |
| `maxpoints` | integer | Defines the maximum number of points fetched by the query. With a value of 0, all points will be fetched by the query. _(default: 50)_ |
| `stacked` | string | Stacks the resulting charts. Stacked values can 'normal' or 'percent'. Only works with columns, bar, line, spline, area, and spline area charts. _(default: null)_ |
| `reverseStacks` | boolean | Reverses the order of the displayed stack. Only works with stacked charts when the singleYAxis option is not active on the chart. _(default: false)_ |
| `seriesBreakdown` | string | When declared, all series are broken down by the defined facet. _(default: none)_ |
| `seriesBreakdownTimescale` | string | If the breakdown facet is a time serie (date or datetime), it defines the aggregation level for this facet. _(default: true)_ |
| `categoryColors` | object | A object containing a color for each category name. For example: {'my value': '#FF0000', 'my other value': '#0000FF'} _(default: {})_ |
| `sort` | string | Displays the results in a specific order. The following values are available:<br>* To sort based on horizontal axis, use `x` or `-x`. For date-based axes, you need to include the name of the field, and the highest precision in the displayed data. For example, if the field name is `mydate`, and the data includes the year, you can use `x.mydate.year`.<br>* To sort based on the displayed values, use `y` or `-y` if there is a single serie. If there are multiple series, use `series{n}-{m}` where `n` is the {n}th `ods-chart-query`, and m is the {m}th `ods-chart-serie`<br>_(default: none)_ |

## odsChartSerie

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsChartSerie widget is the sub widget that defines a series in the chart with all its parameters. For complete examples, see odsChart.

#### Available chart types:

There are two available types of charts: simple series and areas that take a minimal and a maximal value.

#### Simple series

  * line
  * spline
  * area
  * areaspline
  * column
  * bar
  * pie
  * scatter
  * polar
  * spiderweb
  * funnel

#### Areas

  * arearange
  * areasplinerange
  * columnrange

#### Available functions

  * COUNT
  * AVG
  * MIN
  * MAX
  * STDDEV
  * SUM
  * QUANTILES
  * CONSTANT

#### Usage

as element:

```html
<ods-chart-serie
       [chart-type]="{string}"
       [function-y]="{string}"
       [expression-y]="{string}"
       [color]="{string}"
       [label-y]="{string}"
       labelsposition="{string}"
       innersize="{number}"
       [cumulative]="{boolean}"
       logarithmic="{boolean}"
       min="{integer}"
       max="{integer}"
       step="{integer}"
       index="{integer}"
       scientific-display="{boolean}"
       [display-units]="{boolean}"
       [display-values]="{boolean}"
       [display-stack-values]="{boolean}"
       [multiplier]="{number}"
       [color-thresholds]="{string}"
       [subsets]="{string}"
       [subseries]="{boolean}"
       [refine-on-click-context]="{string}"
       [refine-on-click[context]-context-field]="{string}">
</ods-chart-serie>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `chartType` | string, optional | Available types are: 'line', 'spline', 'arearange', 'areasplinerange', 'columnrange', 'area', 'areaspline', 'column', 'bar', 'pie', 'scatter' |
| `functionY` | string, optional | Sets up the function that will be used to calculate aggregation value. 'COUNT' counts the number of documents for each category defined by expressionY. |
| `expressionY` | string, optional | Sets up the facet used for aggregation |
| `color` | string, optional | Defines the color used for this serie. see colors below |
| `labelY` | string, optional | Specifies a custom label for the series |
| `labelsposition` | string | Specifies the position of labels. The authorized values are 'inside' or 'outside' (for pie charts only). _(default: 'outside')_ |
| `innersize` | number | This parameter can be used to change a pie chart into a donut by creating a hole in the center. The value is expressed in pixels. _(default: 0)_ |
| `cumulative` | boolean, optional | Y values are accumulated |
| `logarithmic` | boolean | Displays the serie using a logarithmic scale _(default: false)_ |
| `min` | integer | Minimum value to be displayed on the Y-axis. If not defined, it is computed automatically. _(default: null)_ |
| `max` | integer | Maximum value to be displayed on the Y axis. If not defined, it is computed automatically. _(default: null)_ |
| `step` | integer | Specifies the step between each tick on the Y-axis. If not defined, it is computed automatically. _(default: null)_ |
| `index` | integer | Forces the display order of the serie. The higher is on top, the lower is below (starts from 1). _(default: null)_ |
| `scientificDisplay` | boolean | When set to false, force the full display of the numbers on the Y-axis. _(default: true)_ |
| `displayUnits` | boolean, optional | Enables the display of the units defined for the field in the tooltip |
| `displayValues` | boolean, optional | Enables the display of each invidual values in stacks |
| `displayStackValues` | boolean, optional | Enables the display of the cumulated values on top of stacks |
| `multiplier` | number, optional | Multiplies all values for this serie by the defined number |
| `colorThresholds` | string, optional | An array of (value, color) objects. For each threshold value, if the Y value is above the threshold, the defined color is used. The format for this parameter is color-thresholds="[{'value': 5, 'color': '#00ff00'},{'value': 10, 'color': '#ffff00'}]" |
| `subsets` | string, optional | Used when functionY is set to 'QUANTILES' to define the wanted quantile |
| `subseries` | boolean, optional | An array of subseries. They are used for range, columnrange, and boxplot charts. Each item of the array contains an object like: {"func": "AVG", "yAxis": "myfield"} |
| `refineOnClickContext` | string, optional | Context name or array of contexts name on which to refine when the series is clicked on. It won't work properly if the fieldX attribute of the parent odsChartQuery is a date or datetime field and if the associated timescale is not one of 'year', 'month', 'day', 'hour', 'minute'. |
| `refineOnClick[context]ContextField` | string, optional | Name of the field that will be refined for each context |

## odsLegend

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsLegend widget displays a map legend computed with the color gradient structure from the odsColorGradient widget. The `steps` display mode is a legend with different steps based on the range of values. Each step has its own color and value range. The `linear` display mode is a single color gradient from the minimum to the maximum value.

Note: You can use the `steps` display mode only if the ods-color-gradient-nb-classes option has been provided to the odsColorGradient widget.

#### Usage

as element:

```html
<ods-legend
       color-gradient="{object}"
       title="{string}"
       subtitle="{string}"
       no-value-color="{string}"
       decimal-precision="{integer}"
       display="{string}">
</ods-legend>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `colorGradient` | object | An object providing colors, values, and a range of value. It also provides the number of classes for the `steps` display mode. |
| `title` | string | Legend title |
| `subtitle` | string | Legend sub-title _(default: '')_ |
| `noValueColor` | string | Displays another step or square with the provided default color. The authorized values are any HTML color code. _(default: undefined)_ |
| `decimalPrecision` | integer | Sets the decimal values precision. _(default: 0)_ |
| `display` | string | Display mode. The authorized values are 'steps' and 'linear'. _(default: linear)_ |

## odsColorGradient

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsColorGradient widget exposes the results of an analysis transposed to a set of colors for each X value. The results are available in the scope.

This widget can be used directly on the odsMap's `color-categories` parameter with the `display=categories` mode. It can also be used on the AngularJS ngRepeat directive to build custom scales.

#### Usage

as attribute

```html
<ANY ods-color-gradient="{string}"
     ods-color-gradient-context="{DatasetContext}"
     ods-color-gradient-x="{string}"
     ods-color-gradient-serie="{string}"
     ods-color-gradient-high="{string}"
     ods-color-gradient-low="{string}"
     ods-color-gradient-nb-classes="{integer}"
     ods-color-gradient-pow-exponent="{integer}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `odsColorGradient` | string | Variable name to use to output the color gradient data structure. variable['colors'] can be used in ods-maps. 'values', 'range' keys are also available. |
| `odsColorGradientContext` | DatasetContext | Dataset Context to use |
| `odsColorGradientX` | string | The X-axis of the analysis |
| `odsColorGradientSerie` | string | FUNC(expression) where FUNC is AVG, SUM, MIN, MAX, etc... and expression is the field id to work on. |
| `odsColorGradientHigh` | string | RGB or HEX color code for highest value of the analysis serie. ex: "rgb(255, 0, 0)", "#abc" _(default: 'rgb(0, 55, 237)')_ |
| `odsColorGradientLow` | string | RGB or HEX color code for the lowest value of the analysis serie. ex: "rgb(125, 125, 125)", "#ff009a" _(default: 'rgb(180, 197, 241)')_ |
| `odsColorGradientNbClasses` | integer | Number of classes, ie number of color to compute. Mandatory to get a consistent legend with the corresponding number of grades/classes. _(default: undefined)_ |
| `odsColorGradientPowExponent` | integer | Set to `1` for a linear scale (default value), to `0.3` to approximate a logarithmic scale. Power scale tends to look like a log scale when the exponent is less than `1` and tends to an exponential scale when bigger than `1`. _(default: undefined)_ |

## odsTimescale

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsTimescale widget displays a control to select:

  * the last day,
  * the last week,
  * the last month, or
  * the last year.

#### Usage

as element:

```html
<ods-timescale
       context="{DatasetContext|DatasetContext[]}"
       [time-field="{string}"]
       [*-time-field="{string}"]
       [default-value="{string}"]>
</ods-timescale>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext or DatasetContext[] | Dataset Context or array of context to use |
| `timeField _(optional)_` | string | Name of the field (date or datetime) to filter on _(default: first date/datetime field available)_ |
| `*TimeField _(optional)_` | string | For each context, you can set the name of the field (date or datetime) to filter on. _(default: first date/datetime field available)_ |
| `defaultValue _(optional)_` | string | Sets the default timescale. _(default: everything)_ |
