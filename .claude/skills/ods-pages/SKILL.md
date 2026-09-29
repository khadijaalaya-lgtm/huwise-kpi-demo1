---
name: ods-pages
description: Build and debug Opendatasoft (Huwise) portal pages — ods-widgets directives, AngularJS templates, page CSS, the local dev kit. Use when writing or editing a portal page's HTML/EJS or SCSS, picking a widget, wiring contexts and filters, or when a widget renders blank.
---

# Opendatasoft page development

An ODS page is HTML plus CSS, held in two tabs in the portal back office. The
HTML is an AngularJS template in which **widgets** (`ods-*` directives) fetch
data from the portal API and publish it into scope for you to bind to. You
write no JavaScript.

Assume the reader knows the Opendatasoft platform — datasets, facets, the back
office — but is not fluent in AngularJS or CSS layout.

## Silent failures

Widgets fail by rendering nothing. They do not throw, and the console stays
clean, so a blank page is the normal symptom of every mistake below. Check
these before debugging anything else.

- **Element versus attribute.** Each widget is one or the other.
  `<ods-chart>` is an element; `ods-aggregation` is an attribute on a `div`.
  Writing an attribute directive as an element renders nothing. The Form
  column in `reference/widget-index.md` says which.
- **Attribute names are kebab-case in HTML** even though the reference lists
  them camelCase: `chartType` is written `chart-type`.
- **A widget's variable is scoped to the element that declares it.**
  `ods-aggregation="n"` makes `n` available inside that element only.
- **Context parameters carry the context's name as a prefix.**
  `context="epc"` means the dataset attribute is `epc-dataset`.
- **`ods-chart` can only group by a declared facet.** Grouping on a text field
  that is not declared as a facet in the back office returns
  `Unknown facet name` from the analyze API and draws an empty chart. Use
  `ods-facet-results` instead, which goes through the search API and accepts
  any field. See `reference/recipes.md`.
- **Charts and maps need an explicit height** on a wrapper element, or they
  collapse to nothing. `ods-map` then still draws itself at a fixed 400px
  inside the wrapper; make it fill with `height: 100%` on `ods-map`,
  `.odswidget-map` and `.odswidget-map__map` (recipe in `reference/recipes.md`).
- **A widget's result is invisible to sibling elements.** A sentence beside a
  chart cannot read a query declared on the chart's own `div`. Declare the
  query on the smallest element enclosing every place the value is used,
  such as the `<section>` holding both text and chart.
- **Facet counts are record counts.** When a dataset has many rows per
  entity (per year, sector, gas), the numbers beside each filter value mean
  nothing to a reader. Hide them with
  `.odswidget-facet__category-count { display: none; }`. Only the first
  `visible-items` values (default 6) show before a "More" link; raise it for
  short lists such as regions.
- **`ods-adv-analysis` drops the whole result if a `group-by` field holds
  nulls.** The API returns the rows, but the variable stays `[]` and nothing
  is logged. Group only on fields that are never null.
- **A widget variable named like a context shadows it.**
  `ods-adv-analysis="inds" ods-adv-analysis-context="inds"` works once, then
  fails with `context.wait is not a function`. Give results their own names.
- **`ods-chart` draws at a fixed 400px** whatever its wrapper's height, and
  spills over the text below. Add `.my-wrapper .odswidget-charts { height: 100%; }`.
- **`ng-style` cannot set a CSS custom property** (`{'--c': x}`) with the
  jQuery 2 the portal loads. Set the real property on each element.
- **Not every `ods-*` attribute in an existing page comes from ods-widgets.**
  `ods-tooltip` is used throughout the library's own templates but is not
  registered in `ods-widgets.js`, so it works on the portal and does nothing
  in a local kit or the preview harness. Before copying an attribute out of a
  live page, check it is in the index; if it is not, expect it to be inert
  locally and verify on the portal.

## Steps

### 1. Find the environment

Look for a local dev kit (a repo with `pages/views/*.ejs`, `pages/styles/*.scss`
and `config.project.js`). If there is one, read its `CLAUDE.md` and `README.md`
first: they hold the portal domain, the build and publish commands, and the
gotchas specific to that portal. Those files are authoritative where they
disagree with anything here.

With no local kit, write the HTML and CSS as two separate blocks for the user
to paste into the back office.

### 2. Confirm the data before writing markup

Never assume a field name or that a facet exists. Ask the API:

```
https://<portal>/api/explore/v2.1/catalog/datasets/<dataset>            # fields
https://<portal>/api/explore/v2.1/catalog/datasets/<dataset>/facets     # facets
https://<portal>/api/explore/v2.1/catalog/datasets/<dataset>/records?limit=3
```

Done when you have the exact field names, their types, and the list of
declared facets in hand. Most blank pages trace back to skipping this.

Also check whether any numeric field **repeats on every row** of an entity,
such as population or area on a table with one row per authority, year,
sector and gas. Summing it multiplies it by the number of rows. Find a
filter that leaves exactly one row per entity and period, and sum only
those rows (`widgets-aggregation.md`, ODSQL notes). ODSQL traps are listed
there too; test each query with `curl` before putting it in a widget.

If the page needs fields from two datasets, remember that ODSQL has no
`JOIN`, but the back office does: the **Join datasets processor** copies
fields from a remote dataset into each record at publish time, and other
processors derive or reshape fields. Proposing one to the user often beats
wiring several contexts together. See `reference/processors.md`.

### 3. Agree the layout before building

A page with more than one chart needs a layout decision, and the default of
stacking sections in one column reads as an endless scroll. Settle it with
the user before writing markup, as part of the plan:

- **Sections.** List them from the data: what the headline figures are, and
  which question each chart answers.
- **Filters.** Ask whether they should drive the whole page. If yes, every
  widget shares one context and the filters need a permanent place on screen.
- **Devices.** Ask who reads the page and on what. Plan the phone view
  explicitly, including where the filters go.
- **Wireframe.** Sketch one in ASCII for the user to confirm or change.
  Asking the layout, measure and default-view questions in one
  AskUserQuestion call, with the wireframe as an option preview, settled
  them in one round. For
  a data story with filters, propose the tested layout in
  `reference/recipes.md`: headline figures across the top, a pinned filter
  column, and narrative beside each chart on alternating sides. Keep a
  single column for short pages only.

Done when the user has agreed a wireframe, or explicitly left the layout to
you.

### 4. Choose the widgets

Read `reference/widget-index.md` in full — it is short, and it is the only
file that maps a need to a widget. Then open **one** family file, the one the
index points at. Do not read the other eight: they are 200 to 550 lines each
and hold unrelated widgets.

Family files group widgets that must be used together, so a chart task gets
`odsChart`, `odsChartQuery` and `odsChartSerie` in one read.

Load `reference/filters-and-config.md` only for a binding filter, a date or
number format, or a portal config value such as basemaps or chart colours.

### 5. Write the page

Start from the nearest fragment in `reference/recipes.md` rather than from
scratch, and check whether it is marked tested.

Load `reference/angularjs-in-ods.md` when a binding misbehaves or you are
unsure how a widget's variable reaches the template — it covers the ODS
specifics, not AngularJS generally. Load `reference/css-and-layout.md` when
laying out more than one element, or when a chart or map needs sizing.

### 6. Verify that it renders real values

Build, serve, and render the page, then confirm the expected values are in the
DOM — not merely that the build passed.

```bash
google-chrome --headless=new --dump-dom --virtual-time-budget=30000 <url>
```

With no dev kit, or to check one widget in isolation, copy
`reference/preview-harness.html`, fill in the portal and dataset, and render
that file directly. It loads the widget library from the CDN and queries the
live portal from a `file://` URL.

Wrap values in sentinels (`RATING:{{ r.name }}:END`) so you can grep them out
of the dumped DOM.

Done when every figure, label and list you added appears in the dumped DOM
with real data in it. An empty element that should hold a number means the
page is broken, however clean the build was.

Headless Chrome does not wait for the chart library's lazily-loaded modules,
so a chart shows only its loading spinner even when correct. Confirm a chart
by running its query instead:

```
<portal>/api/records/1.0/analyze/?dataset=<dataset>&x=<field>&y.count.func=COUNT
```

Then ask the user to look at the chart in a real browser, saying plainly that
is what remains unverified.

Check the layout from screenshots at desktop and phone widths, not from the
DOM:

```bash
google-chrome --headless=new --hide-scrollbars --window-size=1600,2400 \
    --virtual-time-budget=30000 --screenshot=desk.png <url>
google-chrome --headless=new --hide-scrollbars --window-size=390,2400 \
    --virtual-time-budget=30000 --screenshot=phone.png <url>
```

To check anything that needs a click, such as a toggle or a filter, drive
real Chrome with Playwright (`uv run --with playwright python ...`,
`p.chromium.launch(channel="chrome")`) and assert visibility before and
after.

**Charts do draw under Playwright** once Highcharts can load:
`code.highcharts.com` answers automated Chrome (and `curl`) with 403, so the
library never arrives and the chart never even sends its query. Serve the
same version from jsdelivr (tested 2026-09-25):

```python
import re
def reroute_highcharts(page):
    def handle(route):
        m = re.match(r'https://code\.highcharts\.com/([\d.]+)/(.*)', route.request.url)
        route.fulfill(response=route.fetch(url=f'https://cdn.jsdelivr.net/npm/highcharts@{m[1]}/{m[2]}'))
    page.route('https://code.highcharts.com/**', handle)
```

Call it before `page.goto`. Then count `.highcharts-series`, read axis
titles and tooltips (`.highcharts-tooltip-container`) and screenshot the
charts. Leave only the final look on the portal to the user. Maps do draw: click a shape at the centre of its
`.map-panel path.leaflet-clickable` bounding box with `page.mouse.click`
(a forced locator click can hit a second part of a multi-part shape and
toggle the refine off). Measure alignment with `bounding_box()` rather than
judging it from a screenshot.

Facet values beyond `visible-items` are hidden, so a Playwright click on
them times out as "element is not visible".

### 7. Hand over for publishing

Publishing is a manual paste into the back office unless the project's own
docs say otherwise: `output/<slug>.html` into the HTML tab,
`output/<slug>.css` into the CSS tab. Tell the user to keep a copy of the live
page first, because the portal has no undo.

## Reference

| File | Holds |
|---|---|
| `reference/widget-index.md` | All 67 widgets: form, purpose, which family file |
| `reference/widgets-<family>.md` | Full parameters and examples, nine families |
| `reference/filters-and-config.md` | The 34 ods-widgets filters, AngularJS built-ins, `ODSWidgetsConfig` |
| `reference/angularjs-in-ods.md` | The AngularJS subset ODS pages use |
| `reference/css-and-layout.md` | Bootstrap 3 grid, sizing, SCSS in the kit |
| `reference/recipes.md` | Working page fragments, marked tested or untested |
| `reference/processors.md` | Back-office processors: dataset joins, derived fields, when to propose one |
| `reference/preview-harness.html` | Standalone page for checking widgets against a live portal |

The online code library at <https://codelibrary.opendatasoft.com/> has fuller
worked examples — page templates, components, widget tricks — and is worth
pointing the user at when they want to browse for ideas.
