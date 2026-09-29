---
name: huwise-opendata
description: Query any Huwise (Opendatasoft) data portal through the Explore v2.1 API with curl and jq. Use when the user wants to find, inspect, filter, aggregate or export datasets from a Huwise portal (a *.opendatasoft.com domain or a custom portal domain), check field names, types or facets before building a portal page or widget, or sanity-check numbers before charting them. Covers ODSQL traps and export to CSV, Parquet, XLSX, GeoJSON, SHP and other formats.
---

# Huwise data portal (Explore v2.1 API)

Plain `curl` against the Explore v2.1 API. Public datasets need no
authentication.

## Pick the portal

Every call starts from the portal's API base URL:

```bash
B=https://<domain-id>.opendatasoft.com/api/explore/v2.1
# A portal on a custom domain works the same way:
# B=https://data.example.org/api/explore/v2.1
```

Where to find the domain, in order:

1. The user's request (a portal URL or a domain ID).
2. `$HUWISE_BASE_URL`, if set (the portal root, e.g.
   `https://<domain-id>.opendatasoft.com`); then `B=${HUWISE_BASE_URL%/}/api/explore/v2.1`.
3. In a project built on the ODS local dev kit, `DEFAULT_DOMAIN_URL` (or
   `ODS_PORTAL_DOMAIN_ID`) in `config.project.js`.
4. Otherwise ask. Don't guess a domain.

Confirm the base works before anything else:

```bash
curl -s "$B/catalog/datasets?limit=0" | jq '.total_count // .'
```

Always pass query parameters with `curl -G --data-urlencode`, so quotes,
spaces and `date'...'` literals arrive intact:

```bash
curl -s -G "$B/catalog/datasets/<id>/records" \
    --data-urlencode "select=..." \
    --data-urlencode "where=..." \
    --data-urlencode "group_by=..." | jq '.results // .'
```

An error comes back as JSON with `error_code` and `message` instead of
`results`. Print `.results // .` so errors aren't swallowed as `null`.

**Private datasets** need an API key: add
`-H "Authorization: Apikey $HUWISE_API_KEY"`. Read the key from the
environment (or the gitignored `config.js` of a dev-kit project); never
print, echo or commit it. The catalogue a key sees can be larger than the
public one, so say which one a count comes from.

On Windows, run these in Git Bash. PowerShell aliases `curl` to
`Invoke-WebRequest`, which takes different arguments.

## Before querying a dataset

1. **Find the id.** Full-text search, keyword or theme facets, or the whole
   catalogue as CSV:
   ```bash
   curl -s -G "$B/catalog/datasets" --data-urlencode 'where="<search term>"' \
       --data-urlencode select=dataset_id,title --data-urlencode limit=100 \
       | jq -r '.results[] | "\(.dataset_id)\t\(.title // "")"'
   curl -s "$B/catalog/facets?facet=keyword" | jq -r '.facets[0].facets[].name'
   curl -s "$B/catalog/facets?facet=theme" | jq -r '.facets[0].facets[].name'
   curl -s "$B/catalog/exports/csv?delimiter=%2C" -o catalog.csv
   ```
2. **Read the schema.** Field names rarely match their labels, so never
   guess them; types decide the syntax (date fields need `date'...'`);
   units are in `annotations`.
   ```bash
   curl -s "$B/catalog/datasets/<id>" | jq '.fields[] | {name, type, label, unit: .annotations.unit}'
   ```
3. **List the declared facets.** Refine filters and facet-based widgets
   only work on these. Dataset metadata doesn't show them; this endpoint
   does.
   ```bash
   curl -s "$B/catalog/datasets/<id>/facets" | jq -c '.facets[] | {name, n: (.facets | length)}'
   ```
4. **Sample a few rows.** Leave out geometry (a `geo_shape` can be hundreds
   of KB per row) with `select`:
   ```bash
   curl -s -G "$B/catalog/datasets/<id>/records" \
       --data-urlencode "select=<field_a>, <field_b>, <field_c>" \
       --data-urlencode limit=3 | jq '.results'
   ```
5. **Check the grain before summing.** Work out what one row is (one
   entity? one entity per year and category?). A value that repeats on
   every row of an entity, such as a population or an area, over-counts
   when summed. See *Data pitfalls* below.

## Queries

```bash
# Filter, select, sort
curl -s -G "$B/catalog/datasets/<id>/records" \
    --data-urlencode "select=<category_field>, <date_field>, <measure_field>" \
    --data-urlencode "where=<date_field> = date'2024'" \
    --data-urlencode "order_by=<measure_field> desc" --data-urlencode limit=10 | jq '.results // .'

# Aggregate
curl -s -G "$B/catalog/datasets/<id>/records" \
    --data-urlencode "select=<category_field>, sum(<measure_field>) as total" \
    --data-urlencode "where=<date_field> >= date'2020'" \
    --data-urlencode "group_by=<category_field>" \
    --data-urlencode "order_by=total desc" | jq '.results // .'

# Group by year of a date field
curl -s -G "$B/catalog/datasets/<id>/records" \
    --data-urlencode "select=count(*) as n" \
    --data-urlencode "group_by=year(<date_field>) as y" \
    --data-urlencode "order_by=y" | jq '.results // .'

# Refine / exclude on a facet value (same effect as clicking a facet)
curl -s -G "$B/catalog/datasets/<id>/records" \
    --data-urlencode "refine=<facet_field>:<value>" \
    --data-urlencode "exclude=<other_facet>:<value>" --data-urlencode limit=5 | jq '.results // .'

# Values of one facet, with counts
curl -s "$B/catalog/datasets/<id>/facets?facet=<field>" | jq '.facets[0].facets[] | {name, count}'

# Record count only
curl -s "$B/catalog/datasets/<id>/records?limit=0" | jq .total_count
```

**Limits:** `limit` is at most 100 without `group_by` and 20,000 with it.
For more rows, export instead of paging with `offset`.

## ODSQL traps

- **Dates compare with date literals:** `<date_field> = date'2024'`,
  `<date_field> >= date'2020-01-01'`. A plain `'2024'` fails with
  `IncompatibleTypesInComparisonFilter`.
- **No `IN` on a function or with date literals:**
  `year(<date_field>) in (2005, 2024)` and
  `<date_field> in (date'2005', date'2024')` are syntax errors. Use `OR`.
  `IN` on a text field works: `<text_field> IN ("value A", "value B")`.
- **Declare an alias once.** The same alias in both `select` and
  `group_by` fails with "Alias 'y' is declared several times". Put it in
  `group_by` only (`group_by=year(<date_field>) as y`); the rows still
  come back with `y`.
- **Aliases work in `order_by`**, for both groups and aggregates
  (`order_by=total desc`).
- **An aggregate with no `group_by` repeats itself** once per `limit` row
  (ten identical rows by default). Add `limit=1`, or group by something.
- **`min`/`max`/`avg` take numbers or dates only.** `min(<text_field>)`
  fails with "StatAggregation only supports numeric or date expression".
  Put the text field in `group_by` instead.
- **Strings take single or double quotes.** Double quotes help when the
  query sits inside single-quoted shell text or an HTML attribute (for
  example a widget's `context-parameters`).
- **Full-text search** is a quoted term on its own: `where="<term>"`.
- **Geo filter:**
  `within_distance(<geo_point_field>, geom'POINT(<lon> <lat>)', 1km)`
  (longitude first).

## Exports

Formats: `csv`, `json`, `jsonl`, `jsonld`, `geojson`, `fgb`, `shp`, `kml`,
`gpx`, `ov2`, `parquet`, `xlsx`, `rdfxml`, `turtle`, `n3`. Not every
dataset offers every format; list them for a dataset with
`curl -s "$B/catalog/datasets/<id>/exports" | jq '[.links[].rel]'`.

Exports take the same `select`, `where`, `refine`, `order_by` and `limit`
parameters as queries, without the 100-row cap. Write binary formats
straight to a file with `-o`; never pipe them through a text tool.

```bash
curl -s -G "$B/catalog/datasets/<id>/exports/parquet" \
    --data-urlencode "where=<filter>" -o <id>.parquet

curl -s -G "$B/catalog/datasets/<id>/exports/xlsx" \
    --data-urlencode "where=<filter>" -o <id>.xlsx

# Geographic datasets
curl -s "$B/catalog/datasets/<id>/exports/geojson" -o <id>.geojson
```

**CSV:**
- The default delimiter is a **semicolon**. Add `delimiter=,` for commas;
  it works together with `where` and `select`.
- The file starts with a **UTF-8 byte-order mark**, so a naive reader
  mangles the first column name. Read with `encoding='utf-8-sig'` in
  Python; DuckDB and `readr` handle it.

```bash
curl -s -G "$B/catalog/datasets/<id>/exports/csv" \
    --data-urlencode "where=<filter>" \
    --data-urlencode "delimiter=," -o <id>.csv
```

For analysis, prefer Parquet: it is typed and much smaller. Query it with
DuckDB without loading it: `duckdb -c "FROM '<id>.parquet' LIMIT 5"`.

## Data pitfalls

What the API won't tell you. Check for these before reporting a number or
building a chart:

- **Repeated attributes.** Entity-level values (population, area, a
  reference value, a band) copied onto every row of a longer table. Never
  `sum` them across rows: pick one row per entity (a filter that leaves
  exactly one row each), or use `min`/`max`/`avg`.
- **Wider scope than the name suggests.** A dataset may cover more areas
  or organisations than the portal's own. Look at the facet values and
  filter explicitly.
- **Total rows mixed with detail rows.** Values such as `All`, `Total` or
  a parent area sitting next to their parts double-count when summed.
  Exclude them.
- **Inconsistent spellings.** The same value in two casings or spellings
  (often from older records) appears twice in a facet. Normalise or group
  both.
- **Text that looks typed.** Booleans stored as `'true'`/`'false'` text,
  numbers or periods stored as text (sorting as text puts `10` before
  `9`); check `type` in the schema and sort on a numeric field if one
  exists.
- **Mostly-null fields.** Grouping or faceting on a field that is null on
  nearly every row gives misleading results; check with a facet count
  first.
- **Negative values** can be legitimate (net flows, sinks, corrections).
  Don't drop them without asking.
- **Units** come from `annotations.unit` and can be wrong at the source.
  State the unit you used.

## Portal notes

Record here, per portal, anything about a specific dataset that caused a
wrong result (grain, repeated fields, scope, odd spellings, declared
facets), so the next query gets it right:

```markdown
### <domain-id>: `<dataset_id>` (<short title>)
- Grain: one row per ...
- Declared facets: ...
- Pitfalls: ...
```
