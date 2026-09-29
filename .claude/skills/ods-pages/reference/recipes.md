# Page recipes

Complete fragments to start from. Each states what the dataset must provide.

Names in angle brackets are placeholders: `<dataset_id>`, `<category_field>`,
`<date_field>`, `<measure_field>` and so on stand for the portal's own
dataset IDs and field names (check them in the API first), and `<colour 1>`
and similar for the portal's palette. `ctx` is the page's main context.

**Tested** means the pattern has been rendered against a live portal and the
expected values confirmed in the DOM. **Untested** means it is assembled from
the reference and has not been run; verify it with `preview-harness.html`
before trusting it.

## Count of records (tested)

Needs: any dataset.

```html
<div ods-dataset-context
     context="ctx"
     ctx-dataset="<dataset_id>">
    <div ods-aggregation="n"
         ods-aggregation-context="ctx"
         ods-aggregation-function="COUNT">
        <p class="my-page-kpi">{{ n | number }} records</p>
    </div>
</div>
```

`ods-aggregation` is an attribute, and `n` is visible only inside the element
that declares it.

## Breakdown of a text field, without declared facets (tested)

Needs: any text field. This is the reliable way to group by a text field,
because it uses the search API, which accepts a facet name ad hoc.

```html
<ul class="my-page-bars"
    ods-facet-results="items"
    ods-facet-results-context="ctx"
    ods-facet-results-facet-name="<category_field>"
    ods-facet-results-sort="alphanum">
    <li ng-repeat="r in items">
        <span class="my-page-bars__label">{{ r.name }}</span>
        <span class="my-page-bars__bar"
              ng-style="{ width: (r.count / n * 100) + '%' }"></span>
        <span class="my-page-bars__value">{{ r.count | number }}</span>
    </li>
</ul>
```

Each item has `name`, `count` and `path`. Styles are in `css-and-layout.md`.

## Bar chart of a text field (tested)

Needs: the field **declared as a facet** on the dataset, in the back office.

This is the trap that sends people to the recipe above. `ods-chart` groups
through the analyze API, which only accepts declared facets. Without the
declaration the API returns `Unknown facet name` and the chart renders as an
empty box with a timezone footer underneath — no error in the console.

```html
<div class="chart-panel">
    <ods-chart>
        <ods-chart-query context="ctx"
                         field-x="<category_field>"
                         maxpoints="10">
            <ods-chart-serie chart-type="column"
                             function-y="COUNT"
                             expression-y="<category_field>"
                             color="<colour 1>">
            </ods-chart-serie>
        </ods-chart-query>
    </ods-chart>
</div>
```

Before writing this, confirm the facet exists. Either list the declared
facets, or run the chart's own query:

```
https://<portal>/api/explore/v2.1/catalog/datasets/<dataset>/facets
https://<portal>/api/records/1.0/analyze/?dataset=<dataset>&x=<field>&y.count.func=COUNT
```

A declared field returns `[{"x": "A", "count": 4848}, ...]`. An undeclared one
returns `{"error": "Unknown facet name '<field>'"}`, and that is exactly what
turns the chart into an empty box.

A chart needs a height on its wrapper or it collapses.

## Time series (line tested; stacked yearly columns tested)

Needs: a date or datetime field.

```html
<ods-chart>
    <ods-chart-query context="ctx"
                     field-x="<date_field>"
                     timescale="month">
        <ods-chart-serie chart-type="line"
                         function-y="COUNT"
                         expression-y="<date_field>"
                         color="<colour 1>">
        </ods-chart-serie>
    </ods-chart-query>
</ods-chart>
```

`timescale` is one of `year`, `month`, `week`, `day`, `hour`, `minute`. The
date field must be declared as a facet, as for any other chart grouping.
A yearly column version, stacked by category, is tested: see
"Category mix as 100% stacked bars".

Summing a measure per year, stacked by category, is tested
(`stacked="normal"`, `function-y="SUM"`,
`expression-y="<numeric field>"`, `series-breakdown="<facet>"`). Negative
values stack below the axis correctly.

`expression-y` is not known to update when it holds a `{{ }}` binding. To
switch the measure, render one chart per measure and show one with
`ng-if`; the chart is rebuilt when it reappears.

Highcharts paints a white background, which stands out on a tinted page:

```scss
.my-page .highcharts-background { fill: transparent; }
```

## Lines per category over a percentile band, switched by a dropdown (tested)

Needs: a date facet, a text facet to break down by, and per-row band
columns (low, median and high values of the comparison group). One context
per card; the dropdown sets the context's refine. `options` holds one row
per selectable series, with its display unit and timescale, for example from
an `ods-adv-analysis` on a lookup dataset.

```html
<div ng-if="options.length"
     ng-init="sel.c = options[0]; card.parameters['refine.<series_field>'] = sel.c.<series_field>">
    <select ng-model="sel.c"
            ng-options="r as r.<series_field> for r in options track by r.<series_field>"
            ng-change="card.parameters['refine.<series_field>'] = sel.c.<series_field>"></select>
    <div class="chart-wrap">
        <ods-chart ng-repeat="k in [sel.c.<series_field>]" single-y-axis="true"
                   single-y-axis-label="{{ sel.c.<unit_field> }}" display-legend="false">
            <ods-chart-query context="card" field-x="<date_field>" timescale="{{ sel.c.<timescale_field> }}" maxpoints="0">
                <ods-chart-serie chart-type="arearange" color="#cfcfcf" index="1"
                                 subseries='[{"func": "MIN", "yAxis": "<band_low_field>"}, {"func": "MAX", "yAxis": "<band_high_field>"}]'>
                </ods-chart-serie>
                <ods-chart-serie chart-type="line" function-y="AVG" expression-y="<band_median_field>" color="#6f6f6f" index="2">
                </ods-chart-serie>
            </ods-chart-query>
            <ods-chart-query context="card" field-x="<date_field>" timescale="{{ sel.c.<timescale_field> }}" maxpoints="0"
                             series-breakdown="<area_field>" category-colors="areaColours">
                <ods-chart-serie chart-type="line" function-y="AVG" expression-y="<value_field>" index="3">
                </ods-chart-serie>
            </ods-chart-query>
        </ods-chart>
    </div>
</div>
```

- `category-colors` takes a scope object mapping each breakdown value to a
  colour, so fixed colours per category need no serie per category.
- The band goes in its own query: inside the breakdown query it would be
  split by category too.
- `timescale="{{ }}"` on `ods-chart-query` updates live (month to year and
  back). `single-y-axis-label="{{ }}"` does not; the one-item `ng-repeat`
  rebuilds the chart whenever the selection changes, which fixes it.
- Tooltips show the date ("November 2017", or "2023" for a financial year)
  and the value with space thousands separators. They cannot show a unit
  that varies by row or a display label for the period, so put those in
  text beside the chart.
- An `ng-if` on a field of the selected option (such as a chart-type
  column) swaps in a different view per series.

A population pyramid is easier as HTML bars from `ods-adv-analysis`
(group by `<age_order_field>, <age_band_field>, <sex_field>`, order by
`<age_order_field> desc`, `ng-style` widths)
than as a chart: the order is under your control and a comparison
outline is a bordered box.

## Filters beside a result list (tested)

Needs: the filtered fields declared as facets.

```html
<div class="container"
     ods-dataset-context
     context="ctx"
     ctx-dataset="<dataset_id>">
    <div class="row">
        <div class="col-md-3">
            <ods-facets context="ctx">
                <ods-facet name="<category_field>" title="Category"></ods-facet>
                <ods-facet name="<area_field>" title="Area"></ods-facet>
            </ods-facets>
            <ods-clear-all-filters context="ctx"></ods-clear-all-filters>
        </div>
        <div class="col-md-9">
            <ods-filter-summary context="ctx"></ods-filter-summary>
            <ods-table context="ctx"></ods-table>
        </div>
    </div>
</div>
```

Every widget sharing `context="ctx"` reacts to the filters automatically;
there is nothing to wire up.

## Free-text search (tested)

```html
<ods-text-search context="ctx"
                 placeholder="Search">
</ods-text-search>
```

## Map of geographic records (tested)

Needs: a geo point or geo shape field. Tested with a boundary dataset of
administrative areas.

```html
<div class="map-panel">
    <ods-map location="<zoom>,<lat>,<lon>"
             scroll-wheel-zoom="false"
             toolbar-drawing="false"
             toolbar-geolocation="false">
        <ods-map-layer context="bounds"
                       display="categories"
                       color-by-field="name_field"
                       color-categories="{'<area value>': '<highlight colour>'}"
                       color-categories-other="<other colour>"
                       border-color="#FFFFFF"
                       shape-opacity="0.6">
        </ods-map-layer>
    </ods-map>
</div>
```

```scss
.map-panel {
    height: 520px;

    // ods-map fixes itself at 400px; without this it stops short of the panel
    ods-map,
    .odswidget-map,
    .odswidget-map__map {
        display: block;
        height: 100%;
    }
}
```

- **Set `location`** (`zoom,latitude,longitude`). Without it the map is
  meant to fit the data, but Leaflet threw "Set map center and zoom first"
  and the map opened zoomed out over Europe.
- **`basemap` is an ID from the portal's `ODSWidgetsConfig.basemaps`**, not
  a provider name. Leave it out to use the portal default.
- `toolbar-drawing="false"` stops readers drawing an area that filters the
  layer's context.
- `display="categories"` with `color-categories` picks out one area; the
  rest take `color-categories-other`.

## Map click fills a side panel (tested)

Needs: a boundary dataset and a data dataset that share a name or code.
The click refines a separate context on the data dataset; the panel reads
it. More robust than a custom tooltip template, whose scope may not reach
the page's contexts.

```html
<div ods-dataset-context
     context="bounds,pick"
     bounds-dataset="<boundary_dataset_id>"
     pick-dataset="<dataset_id>"
     pick-parameters="{'refine.<area_field>': '<area value>'}">

    <div class="map-grid">
        <div class="map-panel">
            <ods-map location="<zoom>,<lat>,<lon>">
                <ods-map-layer context="bounds"
                               tooltip-disabled="true"
                               refine-on-click-context="pick"
                               refine-on-click-map-field="<boundary_name_field>"
                               refine-on-click-context-field="<area_field>"
                               refine-on-click-replace-refine="true">
                </ods-map-layer>
            </ods-map>
        </div>
        <aside class="map-card" aria-live="polite">
            <p ng-if="!pick.parameters['refine.<area_field>']">Click an area on the map.</p>
            <div ng-if="pick.parameters['refine.<area_field>']"
                 ods-adv-analysis="latest"
                 ods-adv-analysis-context="pick"
                 ods-adv-analysis-select="sum(<measure_field>) as t"
                 ods-adv-analysis-group-by="year(<date_field>) as y"
                 ods-adv-analysis-order-by="y desc"
                 ods-adv-analysis-limit="1">
                <h3>{{ [].concat(pick.parameters['refine.<area_field>']).join(', ') }}</h3>
                <p>{{ latest[0].y }}: {{ latest[0].t | number:0 }}</p>
            </div>
        </aside>
    </div>
</div>
```

```scss
@media (min-width: 992px) {
    .map-grid {
        display: grid;
        grid-template-columns: 3fr 1fr;
        align-items: stretch; // card matches the map, given the map fills .map-panel
    }
}
```

- `pick-parameters` sets the area shown before any click.
- After a click the refine is stored as an **array**, so print it with
  `[].concat(x).join(', ')`; a bare binding shows `["Area A"]`.
- Clicking the selected area again removes the refine; the `ng-if`
  message covers that.
- "Latest" is `group-by` year, `order-by` descending, `limit` 1, so it
  moves on when a new year is loaded.

## Two datasets on one page (tested)

```html
<div ods-dataset-context
     context="ctx,ref"
     ctx-dataset="<dataset_id>"
     ref-dataset="<second_dataset_id>">
    ...
</div>
```

Each context's settings carry its own prefix. Widgets name the one they want
with `context="ctx"` or `context="ref"`.

Two contexts on the **same** dataset are also useful: one driven by the
page filters, one never filtered, for denominators and lookups that must
ignore the filters. Tested with four contexts in one declaration.

## Category mix as 100% stacked bars (tested)

Needs: both fields declared as facets. Tested with four charts on one
page, each breaking a different facet down by the same category field.

```html
<div class="chart-panel">
    <ods-chart single-y-axis="true"
               single-y-axis-label="Share of records"
               scientific-display="false">
        <ods-chart-query context="ctx"
                         field-x="<group_field>"
                         maxpoints="0"
                         stacked="percent"
                         series-breakdown="<category_field>"
                         category-colors="{'<value 1>': '<colour 1>', '<value 2>': '<colour 2>', '<value 3>': '<colour 3>'}">
            <ods-chart-serie chart-type="bar"
                             function-y="COUNT"
                             expression-y="<category_field>"
                             label-y="Records">
            </ods-chart-serie>
        </ods-chart-query>
    </ods-chart>
</div>
```

- `series-breakdown` splits each bar by a second facet, and `stacked="percent"`
  makes every bar sum to 100%. Use `stacked="normal"` for counts.
- `category-colors` maps each breakdown value to a colour. Without it the
  widget picks default colours.
- For a date axis, add `timescale="year"` to the query and use
  `chart-type="column"`.
- `sort` is ignored when there is a breakdown.

The widget sends the breakdown as a **second `x` parameter**, so this is how
to test the query before drawing it:

```
<portal>/api/records/1.0/analyze/?dataset=<id>&x=<field>&x=<breakdown>&y.s.func=COUNT&y.s.expr=<breakdown>
```

It returns one cell per combination:
`{"x": {"<group_field>": "<group value>", "<category_field>": "<value 1>"}, "s": 368}`.
A `series_breakdown=` parameter is silently ignored and returns totals only.

## Several aggregations on one element (tested)

```html
<div ods-aggregation="n, cur, pot"
     ods-aggregation-n-context="ctx"
     ods-aggregation-n-function="COUNT"
     ods-aggregation-cur-context="ctx"
     ods-aggregation-cur-function="AVG"
     ods-aggregation-cur-expression="<measure_field>"
     ods-aggregation-pot-context="ctx"
     ods-aggregation-pot-function="AVG"
     ods-aggregation-pot-expression="<measure_field_2>">
    {{ n | number }} records, average {{ cur | number:0 }} (target {{ pot | number:0 }})
</div>
```

Each variable takes its own `-<name>-context`, `-<name>-function` and
`-<name>-expression`. Put the element high enough in the page to enclose
everything that uses the values, such as headline figures and narrative. All
of them update with the context's filters.

## Share of records meeting a condition (tested)

Needs: any fields. For example, "% in the top three categories", which a facet count
cannot give directly.

```html
<div ods-adv-analysis="good"
     ods-adv-analysis-context="ctx"
     ods-adv-analysis-select="count(*) as n"
     ods-adv-analysis-where="<category_field> in ('<value 1>','<value 2>','<value 3>')">
    {{ good[0].n / n * 100 | number:0 }}% in the top three categories
</div>
```

`ods-adv-analysis` uses the Explore v2.1 API with ODSQL. It **combines its
`where` with the context's active filters** (`(where) AND (filters)`), so
the share follows the page's filters without a second context. The result
is an array of rows, hence `good[0].n`. `n` here comes from an enclosing
`ods-aggregation`, as in the recipe above.

## Two distributions side by side (tested)

Needs: two text fields with the same categories, such as a current and a
target category. Neither needs to be a declared facet.

```html
<div ods-facet-results="current"
     ods-facet-results-context="ctx"
     ods-facet-results-facet-name="<category_field>">
    <div ods-facet-results="potential"
         ods-facet-results-context="ctx"
         ods-facet-results-facet-name="<category_field_2>">
        <div class="compare__row" ng-repeat="band in ['<value 1>', '<value 2>', '<value 3>']">
            <span>{{ band }}</span>
            <div class="compare__bar"
                 ng-style="{ width: (((current | filter:{name: band}:true)[0].count || 0) / n * 100) + '%' }"></div>
            <div class="compare__bar compare__bar--potential"
                 ng-style="{ width: (((potential | filter:{name: band}:true)[0].count || 0) / n * 100) + '%' }"></div>
        </div>
    </div>
</div>
```

- **Fixed category list.** Iterating over the list rather than over either
  result keeps both bars aligned, and shows a zero-width bar for a band one
  field lacks.
- **Lookup filter.** `(results | filter:{name: band}:true)[0].count` looks up
  one category; the `true` makes the match exact. `|| 0` covers a missing
  band.
- **Don't cache in `ng-init`.** It runs once, before the results arrive, so
  it would hold `undefined`. Keep the lookup inline.

## Page layout: headline figures, filters, alternating story rows (tested)

Tested at 1600px and 390px. The layout:

1. Headline figures run full width under the page header.
2. Below them are two columns: a filter panel (a quarter of the width, pinned
   while scrolling) and the story.
3. Each story row puts narrative beside a chart, swapping sides on
   alternate rows.

On phones everything stacks, narrative before chart, with the filters
collapsed behind a button.

Use CSS grid, not Bootstrap `col-md-*` columns. In the local kit the
Bootstrap version dropped the main column below the filter panel; the cause
was not diagnosed. Grid also keeps the page independent of the portal's
Bootstrap version.

```html
<div class="container" ods-aggregation="n" ...>
    <section class="kpis">...</section>

    <div class="layout">
        <aside class="filters"
               ng-init="filtersOpen = false"
               ng-class="{ 'filters--open': filtersOpen }">
            <h2>Filter the data</h2>
            <button type="button" class="filters__toggle"
                    aria-controls="filters-body"
                    aria-expanded="{{ filtersOpen }}"
                    ng-click="filtersOpen = !filtersOpen">
                {{ filtersOpen ? 'Hide filters' : 'Show filters' }}
            </button>
            <ods-filter-summary context="ctx"></ods-filter-summary>
            <div id="filters-body" class="filters__body">
                <ods-facets context="ctx">...</ods-facets>
                <ods-clear-all-filters context="ctx"></ods-clear-all-filters>
            </div>
        </aside>

        <main class="story-column">
            <section class="story">
                <div class="story__text">...</div>
                <div class="story__visual"><div class="chart-panel">...</div></div>
            </section>
            <section class="story story--flip">
                <div class="story__text">...</div>
                <div class="story__visual">...</div>
            </section>
        </main>
    </div>
</div>
```

```scss
.layout { display: grid; gap: 2rem; }
.story  { display: grid; gap: 1.5rem; padding: 2rem 0; }

// Grid children default to min-width: auto, which lets a chart widen its column
.story-column, .story__visual { min-width: 0; }

@media (max-width: 991px) {
    .filters__body { display: none; }
    .filters--open .filters__body { display: block; }
}

@media (min-width: 992px) {
    .layout { grid-template-columns: minmax(15rem, 1fr) 3fr; align-items: start; }
    .filters {
        position: sticky;
        top: 1rem;
        max-height: calc(100vh - 2rem);
        overflow-y: auto;
    }
    .filters__toggle { display: none; }
    .story { grid-template-columns: 5fr 7fr; align-items: center; }
    .story--flip { grid-template-columns: 7fr 5fr; }
    .story--flip .story__text { order: 2; }
}
```

- **Source order.** The narrative stays first in the source so it reads
  first on a phone and to screen readers; `order` only moves it visually.
- **Toggle.** `ng-click` needs no script, so the same markup works on the
  portal. `ods-filter-summary` sits outside the collapsed body so active
  filters stay visible.
- **Width.** Bootstrap's `.container` stops at 1170px, which is cramped for
  narrative beside a chart. Widen it for the page:
  `@media (min-width: 992px) { .my-page .container { width: auto; max-width: 1440px; } }`.

## Repeated chart markup as an EJS partial (tested, dev kit only)

When several charts differ only in their field, put the markup in
`pages/views/components/<name>.ejs` and include it with parameters:

```ejs
<%- include('components/category-chart.ejs', {field: '<group_field>', type: 'bar', label: 'Records'}); %>
```

Inside the partial, test optional parameters with `locals.timescale`,
because a bare `timescale` throws when it is not passed. The build inlines
the partial, so `output/<slug>.html` is still a single paste for the back
office.

## Page controls: year selector and measure switch (tested)

Needs: a date field, and optionally two numeric fields to switch between.
`ods-adv-analysis` re-runs whenever a `{{ }}`
binding in `select`, `where` or `group-by` changes, so plain scope
variables become page-wide controls with no script.

```html
<div ods-dataset-context context="ctx,base" ...
     ng-init="sel = {m: '<measure_field>'}">

    <div ods-adv-analysis="years"
         ods-adv-analysis-context="base"
         ods-adv-analysis-group-by="year(<date_field>) as y"
         ods-adv-analysis-order-by="y desc">
    <div ng-if="years.length"
         ng-init="sel.yr = years[0].y">

        <select ng-model="sel.yr" ng-options="r.y as r.y for r in years"></select>
        <label><input type="radio" ng-model="sel.m" value="<measure_field>"> Measure A</label>
        <label><input type="radio" ng-model="sel.m" value="<measure_field_2>"> Measure B</label>

        <div ods-adv-analysis="tot"
             ods-adv-analysis-context="ctx"
             ods-adv-analysis-select="sum({{ sel.m }}) as t"
             ods-adv-analysis-where="<date_field> = date'{{ sel.yr }}'"
             ods-adv-analysis-group-by="<date_field>">
            {{ tot[0].t | number:0 }} in {{ sel.yr }}
        </div>
    </div>
    </div>
</div>
```

- **The `ng-if` gate** holds everything back until the year list arrives,
  then `ng-init` sets the default to the newest year once. Without it the
  first queries go out with `date''` and fail.
- **Keep the controls in an object** (`sel.yr`, not `yr`). `ng-if` and each
  widget create child scopes, and assigning a bare name in a child scope
  hides the parent's value instead of changing it.
- Don't expose the year as an `ods-facet` when the page has a time series:
  refining one year collapses the series to a single point.

## Drill-down on the active filter (tested)

Needs: two levels of text facet, such as region and area, or sector and
sub-sector. A context's active filters are in
`ctx.parameters['refine.<field>']`: a string for one value, an array for
several. Group by the lower level once the higher one is filtered.

```html
<div ods-adv-analysis="areas"
     ods-adv-analysis-context="ctx"
     ods-adv-analysis-select="sum(<measure_field>) as t"
     ods-adv-analysis-group-by="{{ ctx.parameters['refine.<area_field>'] ? '<sub_area_field>' : '<area_field>' }} as name"
     ods-adv-analysis-order-by="t desc">
    <h2>{{ ctx.parameters['refine.<area_field>'] ? 'Sub-areas' : 'Areas' }}</h2>
    <ul><li ng-repeat="r in areas">{{ r.name }}: {{ r.t | number:0 }}</li></ul>
</div>
```

To reuse the active filter in another context's `where`, build an ODSQL
list from it. ODSQL accepts double-quoted strings, written `&quot;`
inside the attribute:

```
{{ ctx.parameters['refine.<area_field>'] ? ' AND <area_field> IN (&quot;' + [].concat(ctx.parameters['refine.<area_field>']).join('&quot;,&quot;') + '&quot;)' : '' }}
```

This is how an unfiltered `base` context follows only the geographic
filters, for a denominator that the other filters must not shrink.

## Bars from a query, with a ratio from a second query (tested)

Needs: nothing declared. For what `ods-chart` can't draw: a ratio of two
queries (a value per person), negative values, or a second figure per
bar.

```html
<div ods-adv-analysis="areas"
     ods-adv-analysis-context="ctx"
     ods-adv-analysis-select="sum(<measure_field>) as t"
     ods-adv-analysis-group-by="<area_field> as name"
     ods-adv-analysis-order-by="t desc">
    <div ods-adv-analysis="pops"
         ods-adv-analysis-context="base"
         ods-adv-analysis-select="sum(<population_field>) as p"
         ods-adv-analysis-where="<one_row_per_area_filter>"
         ods-adv-analysis-group-by="<area_field> as name">
        <ul class="bars">
            <li class="bars__row" ng-repeat="r in areas">
                <span>{{ r.name }}</span>
                <span class="bars__bar"
                      ng-style="{ width: ((r.t < 0 ? -r.t : r.t) / areas[0].t * 100) + '%',
                                  background: r.t < 0 ? '<negative colour>' : '<positive colour>' }"></span>
                <span>{{ r.t | number:0 }}</span>
                <span>{{ r.t / (pops | filter:{name: r.name}:true)[0].p | number:1 }} per person</span>
            </li>
        </ul>
    </div>
</div>
```

- Order by the query's own measure: `orderBy` in the template cannot see
  the second query, so it cannot sort by the ratio.
- To scale columns of a ratio without its maximum, divide by
  `(nums | orderBy:'-t')[0].t / (dens | orderBy:'p')[0].p`: the largest
  numerator over the smallest denominator is at least as big as every ratio.

## Long expressions as EJS constants (tested, dev kit only)

Drill-down and filter expressions get long and repeat. Define them once as
EJS constants at the top of the view; the build writes them out in full, so
the pasted HTML is plain AngularJS.

```ejs
<%
const refine = (f) => `ctx.parameters['refine.${f}']`;
const GEO_PICKED = `(${refine('<area_field>')} || ${refine('<sub_area_field>')})`;
const AREA_FIELD = `(${GEO_PICKED} ? '<sub_area_field>' : '<area_field>')`;
-%>
<div ods-adv-analysis-group-by="{{ <%- AREA_FIELD %> }} as name" ...>
```

Use `<%-` (raw), not `<%=`, or quotes are escaped.

## Debugging a blank binding

Drop this beside anything that is not appearing:

```html
<pre>{{ items | json }}</pre>
```

If it prints `undefined`, the variable name or its scope is wrong. If it
prints an empty array, the query ran and matched nothing, so look at the
field name, the facet declaration, or an active filter.
