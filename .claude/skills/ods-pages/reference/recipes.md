# Page recipes

Complete fragments to start from. Each states what the dataset must provide.

**Tested** means the pattern has been rendered against a live portal and the
expected values confirmed in the DOM. **Untested** means it is assembled from
the reference and has not been run; verify it with `preview-harness.html`
before trusting it.

## Count of records (tested)

Needs: any dataset.

```html
<div ods-dataset-context
     context="epc"
     epc-dataset="epc_domestic_lep_ods">
    <div ods-aggregation="n"
         ods-aggregation-context="epc"
         ods-aggregation-function="COUNT">
        <p class="epc-kpi">{{ n | number }} certificates</p>
    </div>
</div>
```

`ods-aggregation` is an attribute, and `n` is visible only inside the element
that declares it.

## Breakdown of a text field, without declared facets (tested)

Needs: any text field. This is the reliable way to group by a text field,
because it uses the search API, which accepts a facet name ad hoc.

```html
<ul class="epc-bars"
    ods-facet-results="ratings"
    ods-facet-results-context="epc"
    ods-facet-results-facet-name="current_energy_rating"
    ods-facet-results-sort="alphanum">
    <li ng-repeat="r in ratings">
        <span class="epc-bars__label">{{ r.name }}</span>
        <span class="epc-bars__bar"
              ng-style="{ width: (r.count / n * 100) + '%' }"></span>
        <span class="epc-bars__value">{{ r.count | number }}</span>
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
        <ods-chart-query context="epc"
                         field-x="current_energy_rating"
                         maxpoints="10">
            <ods-chart-serie chart-type="column"
                             function-y="COUNT"
                             expression-y="current_energy_rating"
                             color="#40A832">
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
    <ods-chart-query context="epc"
                     field-x="lodgement_datetime"
                     timescale="month">
        <ods-chart-serie chart-type="line"
                         function-y="COUNT"
                         expression-y="lodgement_datetime"
                         color="#40A832">
        </ods-chart-serie>
    </ods-chart-query>
</ods-chart>
```

`timescale` is one of `year`, `month`, `week`, `day`, `hour`, `minute`. The
date field must be declared as a facet, as for any other chart grouping.
A yearly column version, stacked by category, is tested: see
"Category mix as 100% stacked bars".

Summing a measure per year, stacked by category, is tested on
`ghg-emissions` (`stacked="normal"`, `function-y="SUM"`,
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
columns. Tested on `west-of-england-indicators` (2026-09-25). One context
per card; the dropdown sets the context's refine.

```html
<div ng-if="options.length"
     ng-init="sel.c = options[0]; card.parameters['refine.indicator'] = sel.c.indicator">
    <select ng-model="sel.c"
            ng-options="r as r.indicator for r in options track by r.indicator"
            ng-change="card.parameters['refine.indicator'] = sel.c.indicator"></select>
    <div class="chart-wrap">
        <ods-chart ng-repeat="k in [sel.c.indicator]" single-y-axis="true"
                   single-y-axis-label="{{ sel.c.unit }}" display-legend="false">
            <ods-chart-query context="card" field-x="period" timescale="{{ sel.c.timescale }}" maxpoints="0">
                <ods-chart-serie chart-type="arearange" color="#cfcfcf" index="1"
                                 subseries='[{"func": "MIN", "yAxis": "other_p10"}, {"func": "MAX", "yAxis": "other_p90"}]'>
                </ods-chart-serie>
                <ods-chart-serie chart-type="line" function-y="AVG" expression-y="other_median" color="#6f6f6f" index="2">
                </ods-chart-serie>
            </ods-chart-query>
            <ods-chart-query context="card" field-x="period" timescale="{{ sel.c.timescale }}" maxpoints="0"
                             series-breakdown="areanm" category-colors="areaColours">
                <ods-chart-serie chart-type="line" function-y="AVG" expression-y="value" index="3">
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
  rebuilds the chart whenever the indicator changes, which fixes it.
- Tooltips show the date ("November 2017", or "2023" for a financial year)
  and the value with space thousands separators. They cannot show a unit
  that varies by row or a display label for the period, so put those in
  text beside the chart.
- An `ng-if` on `chart_type` swaps in a different view per indicator.

A population pyramid is easier as HTML bars from `ods-adv-analysis`
(group by `age_min, age, sex`, order by `age_min desc`, `ng-style` widths)
than as a chart: the order is under your control and a comparison
outline is a bordered box.

## Filters beside a result list (tested)

Needs: the filtered fields declared as facets.

```html
<div class="container"
     ods-dataset-context
     context="epc"
     epc-dataset="epc_domestic_lep_ods">
    <div class="row">
        <div class="col-md-3">
            <ods-facets context="epc">
                <ods-facet name="current_energy_rating" title="Rating"></ods-facet>
                <ods-facet name="local_authority_label" title="Authority"></ods-facet>
            </ods-facets>
            <ods-clear-all-filters context="epc"></ods-clear-all-filters>
        </div>
        <div class="col-md-9">
            <ods-filter-summary context="epc"></ods-filter-summary>
            <ods-table context="epc"></ods-table>
        </div>
    </div>
</div>
```

Every widget sharing `context="epc"` reacts to the filters automatically;
there is nothing to wire up.

## Free-text search (tested)

```html
<ods-text-search context="epc"
                 placeholder="Search addresses">
</ods-text-search>
```

## Map of geographic records (tested)

Needs: a geo point or geo shape field. Tested on `ghg-emissions` with
combined authority boundaries.

```html
<div class="map-panel">
    <ods-map location="6,53.1,-1.9"
             scroll-wheel-zoom="false"
             toolbar-drawing="false"
             toolbar-geolocation="false">
        <ods-map-layer context="bounds"
                       display="categories"
                       color-by-field="name_field"
                       color-categories="{'West of England': '#40A832'}"
                       color-categories-other="#1D4F2B"
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
the page's contexts. Tested on `ghg-emissions`.

```html
<div ods-dataset-context
     context="bounds,pick"
     bounds-dataset="cauths_weca_as_lep"
     pick-dataset="ca_la_ghg_emissions_sub_sector_ods_vw"
     pick-parameters="{'refine.cauthnm': 'West of England'}">

    <div class="map-grid">
        <div class="map-panel">
            <ods-map location="6,53.1,-1.9">
                <ods-map-layer context="bounds"
                               tooltip-disabled="true"
                               refine-on-click-context="pick"
                               refine-on-click-map-field="cauth25nm"
                               refine-on-click-context-field="cauthnm"
                               refine-on-click-replace-refine="true">
                </ods-map-layer>
            </ods-map>
        </div>
        <aside class="map-card" aria-live="polite">
            <p ng-if="!pick.parameters['refine.cauthnm']">Click an area on the map.</p>
            <div ng-if="pick.parameters['refine.cauthnm']"
                 ods-adv-analysis="latest"
                 ods-adv-analysis-context="pick"
                 ods-adv-analysis-select="sum(territorial_emissions_kt_co2e) as t"
                 ods-adv-analysis-group-by="year(calendar_year) as y"
                 ods-adv-analysis-order-by="y desc"
                 ods-adv-analysis-limit="1">
                <h3>{{ [].concat(pick.parameters['refine.cauthnm']).join(', ') }}</h3>
                <p>{{ latest[0].y }}: {{ latest[0].t | number:0 }} kt</p>
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
  `[].concat(x).join(', ')`; a bare binding shows `["Devon and Torbay"]`.
- Clicking the selected area again removes the refine; the `ng-if`
  message covers that.
- "Latest" is `group-by` year, `order-by` descending, `limit` 1, so it
  moves on when a new year is loaded.

## Two datasets on one page (tested)

```html
<div ods-dataset-context
     context="epc,pop"
     epc-dataset="epc_domestic_lep_ods"
     pop-dataset="population_estimates">
    ...
</div>
```

Each context's settings carry its own prefix. Widgets name the one they want
with `context="epc"` or `context="pop"`.

Two contexts on the **same** dataset are also useful: one driven by the
page filters, one never filtered, for denominators and lookups that must
ignore the filters. Tested on `ghg-emissions` with four contexts in one
declaration.

## Category mix as 100% stacked bars (tested)

Needs: both fields declared as facets. Tested on `epc-domestic` with four
charts: rating mix by local authority, property type, tenure, and year.

```html
<div class="chart-panel">
    <ods-chart single-y-axis="true"
               single-y-axis-label="Share of homes"
               scientific-display="false">
        <ods-chart-query context="epc"
                         field-x="property_type"
                         maxpoints="0"
                         stacked="percent"
                         series-breakdown="current_energy_rating"
                         category-colors="{'A': '#1D4F2B', 'B': '#40A832', 'C': '#8FCC87', 'D': '#A6A6A5', 'E': '#ED8073', 'F': '#CE132D', 'G': '#8C0017'}">
            <ods-chart-serie chart-type="bar"
                             function-y="COUNT"
                             expression-y="current_energy_rating"
                             label-y="Homes">
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
`{"x": {"property_type": "Bungalow", "current_energy_rating": "A"}, "s": 368}`.
A `series_breakdown=` parameter is silently ignored and returns totals only.

## Several aggregations on one element (tested)

```html
<div ods-aggregation="n, cur, pot"
     ods-aggregation-n-context="epc"
     ods-aggregation-n-function="COUNT"
     ods-aggregation-cur-context="epc"
     ods-aggregation-cur-function="AVG"
     ods-aggregation-cur-expression="current_energy_efficiency"
     ods-aggregation-pot-context="epc"
     ods-aggregation-pot-function="AVG"
     ods-aggregation-pot-expression="potential_energy_efficiency">
    {{ n | number }} homes, average score {{ cur | number:0 }} (could be {{ pot | number:0 }})
</div>
```

Each variable takes its own `-<name>-context`, `-<name>-function` and
`-<name>-expression`. Put the element high enough in the page to enclose
everything that uses the values, such as headline figures and narrative. All
of them update with the context's filters.

## Share of records meeting a condition (tested)

Needs: any fields. For example, "% rated A to C", which a facet count cannot
give directly.

```html
<div ods-adv-analysis="good"
     ods-adv-analysis-context="epc"
     ods-adv-analysis-select="count(*) as n"
     ods-adv-analysis-where="current_energy_rating in ('A','B','C')">
    {{ good[0].n / n * 100 | number:0 }}% rated A to C
</div>
```

`ods-adv-analysis` uses the Explore v2.1 API with ODSQL. It **combines its
`where` with the context's active filters** (`(where) AND (filters)`), so
the share follows the page's filters without a second context. The result
is an array of rows, hence `good[0].n`. `n` here comes from an enclosing
`ods-aggregation`, as in the recipe above.

## Two distributions side by side (tested)

Needs: two text fields with the same categories, such as current and
potential rating. Neither needs to be a declared facet.

```html
<div ods-facet-results="current"
     ods-facet-results-context="epc"
     ods-facet-results-facet-name="current_energy_rating">
    <div ods-facet-results="potential"
         ods-facet-results-context="epc"
         ods-facet-results-facet-name="potential_energy_rating">
        <div class="compare__row" ng-repeat="band in ['A', 'B', 'C', 'D', 'E', 'F', 'G']">
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

Tested on `epc-domestic` at 1600px and 390px. The layout:

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
            <ods-filter-summary context="epc"></ods-filter-summary>
            <div id="filters-body" class="filters__body">
                <ods-facets context="epc">...</ods-facets>
                <ods-clear-all-filters context="epc"></ods-clear-all-filters>
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
<%- include('components/epc-rating-chart.ejs', {field: 'tenure', type: 'bar', label: 'Homes'}); %>
```

Inside the partial, test optional parameters with `locals.timescale`,
because a bare `timescale` throws when it is not passed. The build inlines
the partial, so `output/<slug>.html` is still a single paste for the back
office.

## Page controls: year selector and measure switch (tested)

Needs: a date field, and optionally two numeric fields to switch between.
Tested on `ghg-emissions`. `ods-adv-analysis` re-runs whenever a `{{ }}`
binding in `select`, `where` or `group-by` changes, so plain scope
variables become page-wide controls with no script.

```html
<div ods-dataset-context context="ghg,base" ...
     ng-init="sel = {m: 'territorial_emissions_kt_co2e'}">

    <div ods-adv-analysis="years"
         ods-adv-analysis-context="base"
         ods-adv-analysis-group-by="year(calendar_year) as y"
         ods-adv-analysis-order-by="y desc">
    <div ng-if="years.length"
         ng-init="sel.yr = years[0].y">

        <select ng-model="sel.yr" ng-options="r.y as r.y for r in years"></select>
        <label><input type="radio" ng-model="sel.m" value="territorial_emissions_kt_co2e"> All</label>
        <label><input type="radio" ng-model="sel.m" value="emissions_within_the_scope_of_influence_of_las_kt_co2"> Within influence</label>

        <div ods-adv-analysis="tot"
             ods-adv-analysis-context="ghg"
             ods-adv-analysis-select="sum({{ sel.m }}) as t"
             ods-adv-analysis-where="calendar_year = date'{{ sel.yr }}'"
             ods-adv-analysis-group-by="calendar_year">
            {{ tot[0].t | number:0 }} kt in {{ sel.yr }}
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
sub-sector. Tested on `ghg-emissions`. A context's active filters are in
`ctx.parameters['refine.<field>']`: a string for one value, an array for
several. Group by the lower level once the higher one is filtered.

```html
<div ods-adv-analysis="areas"
     ods-adv-analysis-context="ghg"
     ods-adv-analysis-select="sum(territorial_emissions_kt_co2e) as t"
     ods-adv-analysis-group-by="{{ ghg.parameters['refine.cauthnm'] ? 'local_authority' : 'cauthnm' }} as name"
     ods-adv-analysis-order-by="t desc">
    <h2>{{ ghg.parameters['refine.cauthnm'] ? 'Local authorities' : 'Combined authorities' }}</h2>
    <ul><li ng-repeat="r in areas">{{ r.name }}: {{ r.t | number:0 }}</li></ul>
</div>
```

To reuse the active filter in another context's `where`, build an ODSQL
list from it. ODSQL accepts double-quoted strings, written `&quot;`
inside the attribute:

```
{{ ghg.parameters['refine.cauthnm'] ? ' AND cauthnm IN (&quot;' + [].concat(ghg.parameters['refine.cauthnm']).join('&quot;,&quot;') + '&quot;)' : '' }}
```

This is how an unfiltered `base` context follows only the geographic
filters, for a population that sector filters must not shrink.

## Bars from a query, with a ratio from a second query (tested)

Needs: nothing declared. For what `ods-chart` can't draw: a ratio of two
queries (emissions per person), negative values, or a second figure per
bar. Tested on `ghg-emissions`.

```html
<div ods-adv-analysis="areas"
     ods-adv-analysis-context="ghg"
     ods-adv-analysis-select="sum(territorial_emissions_kt_co2e) as t"
     ods-adv-analysis-group-by="cauthnm as name"
     ods-adv-analysis-order-by="t desc">
    <div ods-adv-analysis="pops"
         ods-adv-analysis-context="base"
         ods-adv-analysis-select="sum(midyear_population_thousands) as p"
         ods-adv-analysis-where="la_ghg_sub_sector = 'Domestic Electricity' AND greenhouse_gas = 'CO2'"
         ods-adv-analysis-group-by="cauthnm as name">
        <ul class="bars">
            <li class="bars__row" ng-repeat="r in areas">
                <span>{{ r.name }}</span>
                <span class="bars__bar"
                      ng-style="{ width: ((r.t < 0 ? -r.t : r.t) / areas[0].t * 100) + '%',
                                  background: r.t < 0 ? '#A6A6A5' : '#1D4F2B' }"></span>
                <span>{{ r.t | number:0 }}</span>
                <span>{{ r.t / (pops | filter:{name: r.name}:true)[0].p | number:1 }} t per person</span>
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
const refine = (f) => `ghg.parameters['refine.${f}']`;
const GEO_PICKED = `(${refine('cauthnm')} || ${refine('local_authority')})`;
const AREA_FIELD = `(${GEO_PICKED} ? 'local_authority' : 'cauthnm')`;
-%>
<div ods-adv-analysis-group-by="{{ <%- AREA_FIELD %> }} as name" ...>
```

Use `<%-` (raw), not `<%=`, or quotes are escaped.

## Debugging a blank binding

Drop this beside anything that is not appearing:

```html
<pre>{{ ratings | json }}</pre>
```

If it prints `undefined`, the variable name or its scope is wrong. If it
prints an empty array, the query ran and matched nothing, so look at the
field name, the facet declaration, or an active filter.
