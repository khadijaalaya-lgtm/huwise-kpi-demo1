# CSS and layout for ODS pages

A page is two files: HTML (the widgets) and CSS. On the portal they are two
tabs on the page editor. In the local dev kit they are
`pages/views/<slug>.ejs` and `pages/styles/<slug>.scss`, compiled to
`output/<slug>.html` and `output/<slug>.css`.

## What the portal already gives you

The portal loads Bootstrap 3's grid. `container`, `row` and the
`col-xs|sm|md|lg-N` classes are available and stable, so use them for layout
rather than writing your own float or flex scaffolding.

```html
<div class="container">
    <div class="row">
        <div class="col-md-8">Main chart</div>
        <div class="col-md-4">Filters</div>
    </div>
</div>
```

Twelve columns per row. The prefix is the width at which the columns start
sitting side by side; below it they stack full width. `col-md-*` (from 992px)
is the usual choice: stacked on a phone, side by side on a laptop. Add a
second class to change the split at another size:
`class="col-sm-6 col-md-4"`.

Columns must be inside a `row`, and a `row` inside a `container`, or the
negative margins leave the content misaligned.

For a simple split like the one above, Bootstrap is enough. For a pinned
filter column with story rows that swap sides, use CSS grid instead, following
the page layout recipe in `recipes.md`. The Bootstrap version of that layout
dropped the main column below the filters in the local kit.

The portal also ships around 900 `.ods-*` classes. Those are internal BEM
classes for the portal's own screens, they are undocumented, and they change
between releases. Do not target them. Style your own wrapper classes instead.

## Sizing widgets

Most widgets fill their container's width and have a default height. Charts
and maps need an explicit height or they collapse:

```scss
.chart-panel {
    height: 24rem;
}
```

```html
<div class="chart-panel">
    <ods-chart>...</ods-chart>
</div>
```

Set the height on your own wrapper, not on the widget element, so the widget
keeps its own internal layout.

**`ods-map` is the exception.** It sets its inner elements to a fixed 400px,
so in a taller wrapper the map stops short, and anything aligned to the
wrapper (a card beside it with `align-items: stretch`) overshoots the map.
Make the map fill the wrapper:

```scss
.map-panel {
    height: 520px;

    ods-map,
    .odswidget-map,
    .odswidget-map__map {
        display: block;
        height: 100%;
    }
}
```

Leaflet sized itself correctly with this, with no grey band of missing
tiles (tested at 1280, 1440 and 1920px).

## Naming

Prefix your classes with something page-specific. The page's CSS is injected
into a portal that already has hundreds of rules, and a bare `.header` or
`.card` will collide.

```scss
.epc-summary { }
.epc-summary__figure { }
```

## SCSS in the local kit

The kit compiles SCSS with Dart Sass, so nesting, variables and partials all
work. Shared rules go in `pages/styles/common.scss` and are pulled in with
`@import "common";` at the top of the page's stylesheet.

Keep nesting shallow, about three levels. Deep nesting produces long selectors
that are hard to override from the portal's own cascade.

## Making a value look like a headline figure

The most common page element is a single number from an aggregation. It needs
no library:

```html
<p class="epc-kpi">{{ n | number }} certificates</p>
```

```scss
.epc-kpi {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
}
```

## Bars without a chart widget

When a chart widget is more trouble than it is worth (see the facet
requirement in `recipes.md`), a list plus `ng-style` gives a horizontal bar
chart with no dependencies:

```html
<ul class="epc-bars">
    <li ng-repeat="r in ratings">
        <span class="epc-bars__label">{{ r.name }}</span>
        <span class="epc-bars__bar" ng-style="{ width: (r.count / n * 100) + '%' }"></span>
        <span class="epc-bars__value">{{ r.count | number }}</span>
    </li>
</ul>
```

```scss
.epc-bars {
    list-style: none;
    padding: 0;
    max-width: 40rem;

    li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
}

.epc-bars__label { width: 1.5rem; font-weight: 700; }
.epc-bars__bar   { height: 1.25rem; min-width: 2px; background: #40A832; }
.epc-bars__value { white-space: nowrap; font-size: 0.875rem; }
```

`min-width` keeps a zero-ish category visible rather than collapsing it to
nothing.

## Checking it on a phone

The portal is responsive and a good proportion of traffic is mobile. Resize
the browser to about 360px wide before calling a page finished. The usual
failures are a fixed-width wrapper, a table that will not fit, and a chart
with a height set in pixels that leaves no room for anything else.
