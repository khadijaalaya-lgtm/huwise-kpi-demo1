---
name: weca-opendata
description: Query the West of England Combined Authority (WECA) Open Data portal (Opendatasoft Explore v2.1 API) with curl and jq. Use when the user wants to find, inspect, filter, aggregate or export datasets from opendata.westofengland-ca.gov.uk (also westofenglandca.opendatasoft.com), check field names or facets before building a portal page, or needs notes on specific WECA datasets such as greenhouse gas emissions, EPCs or combined authority boundaries. Covers ODSQL traps and export to CSV, Parquet, XLSX, GeoJSON, SHP and other formats.
---

# WECA Open Data portal

Plain `curl` against the Explore v2.1 API. No authentication for public
datasets. Everything below was checked against the live portal in
September 2026.

```bash
B=https://opendata.westofengland-ca.gov.uk/api/explore/v2.1
# Same portal: https://westofenglandca.opendatasoft.com/api/explore/v2.1
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
`-H "Authorization: Apikey $ODS_API_KEY"`. Without one the catalogue shows
119 datasets; the admin key sees a few more. Never print or echo the key.

On Windows, run these in Git Bash. PowerShell aliases `curl` to
`Invoke-WebRequest`, which takes different arguments.

## Before querying a dataset

1. **Find the id.** Full-text search, keyword facets, or the whole
   catalogue as CSV:
   ```bash
   curl -s -G "$B/catalog/datasets" --data-urlencode 'where="energy"' \
       --data-urlencode select=dataset_id --data-urlencode limit=100 | jq -r '.results[].dataset_id'
   curl -s "$B/catalog/facets?facet=keyword" | jq -r '.facets[0].facets[].name'
   curl -s "$B/catalog/exports/csv?delimiter=%2C" -o catalog.csv
   ```
2. **Read the schema.** Field names are inconsistent
   (`territorial_emissions_kt_co2e`, not `emissions`); types decide the
   syntax (date fields need `date'...'`); units are in `annotations`.
   ```bash
   curl -s "$B/catalog/datasets/<id>" | jq '.fields[] | {name, type, label, unit: .annotations.unit}'
   ```
3. **List the declared facets.** Portal charts can only group by these.
   Dataset metadata doesn't show them; this endpoint does.
   ```bash
   curl -s "$B/catalog/datasets/<id>/facets" | jq -c '.facets[] | {name, n: (.facets | length)}'
   ```
4. **Sample a few rows.** Leave out geometry (`geo_shape` can be ~200 KB a
   row) with `select`:
   ```bash
   curl -s -G "$B/catalog/datasets/<id>/records" --data-urlencode limit=3 | jq '.results'
   ```
5. **Check the grain before summing.** If a value such as population
   repeats on every row of an entity, summing it over-counts. See the
   dataset notes below.

## Queries

```bash
# Filter, select, sort
curl -s -G "$B/catalog/datasets/air-quality-measurements/records" \
    --data-urlencode "select=la_name, year, annual_mean_no2" \
    --data-urlencode "where=year = date'2022'" \
    --data-urlencode "order_by=annual_mean_no2 desc" --data-urlencode limit=10 | jq '.results // .'

# Aggregate
curl -s -G "$B/catalog/datasets/ca_la_ghg_emissions_sub_sector_ods_vw/records" \
    --data-urlencode "select=local_authority, sum(territorial_emissions_kt_co2e) as total_kt" \
    --data-urlencode "where=calendar_year = date'2021' AND cauthnm = 'West of England'" \
    --data-urlencode "group_by=local_authority" \
    --data-urlencode "order_by=total_kt desc" | jq '.results // .'

# Values of one facet, with counts
curl -s "$B/catalog/datasets/<id>/facets?facet=<field>" | jq '.facets[0].facets[] | {name, count}'

# Record count only
curl -s "$B/catalog/datasets/<id>/records?limit=0" | jq .total_count
```

**Limits:** `limit` is at most 100 without `group_by` and 20,000 with it.
For more rows, export instead of paging with `offset`.

## ODSQL traps

- **Dates compare with date literals:** `calendar_year = date'2024'`,
  `year >= date'2020-01-01'`. A plain `'2024'` fails with
  `IncompatibleTypesInComparisonFilter`.
- **No `IN` on a function or with date literals:**
  `year(calendar_year) in (2005, 2024)` and
  `calendar_year in (date'2005', date'2024')` are syntax errors. Use `OR`.
  `IN` on a text field works: `cauthnm IN ("West of England", "Tees Valley")`.
- **Declare an alias once.** The same alias in both `select` and
  `group_by` fails with "Alias 'y' is declared several times". Put it in
  `group_by` only (`group_by=year(calendar_year) as y`); the rows still
  come back with `y`.
- **Aliases work in `order_by`**, for both groups and aggregates
  (`order_by=total_kt desc`).
- **An aggregate with no `group_by` repeats itself** once per `limit` row
  (ten identical rows by default). Add `limit=1`, or group by something.
- **`min`/`max`/`avg` take numbers or dates only.** `min(period_label)` on a
  text field fails with "StatAggregation only supports numeric or date
  expression". Put the text field in `group_by` instead.
- **Strings take single or double quotes.** Double quotes help when the
  query sits inside single-quoted shell text or an HTML attribute.
- **Full-text search** is a quoted term on its own: `where="transport"`.
- **Geo filter:**
  `within_distance(geo_point_2d, geom'POINT(-2.587 51.454)', 1km)`
  (longitude first).

## Exports

Formats: `csv`, `json`, `jsonl`, `jsonld`, `geojson`, `fgb`, `shp`, `kml`,
`gpx`, `ov2`, `parquet`, `xlsx`, `rdfxml`, `turtle`, `n3`. List them for a
dataset with `curl -s "$B/catalog/datasets/<id>/exports" | jq '[.links[].rel]'`.

Exports take the same `select`, `where`, `order_by` and `limit` parameters
as queries, without the 100-row cap. Write binary formats straight to a
file with `-o`; never pipe them through a text tool.

```bash
curl -s -G "$B/catalog/datasets/ca_la_ghg_emissions_sub_sector_ods_vw/exports/parquet" \
    --data-urlencode "where=cauthnm = 'West of England'" -o ghg_woe.parquet

curl -s -G "$B/catalog/datasets/ca_la_ghg_emissions_sub_sector_ods_vw/exports/xlsx" \
    --data-urlencode "where=cauthnm = 'West of England'" -o ghg_woe.xlsx

curl -s "$B/catalog/datasets/weca_caz/exports/geojson" -o caz_boundary.geojson
```

**CSV:**
- The default delimiter is a **semicolon**. Add `delimiter=,` for commas;
  it works together with `where` and `select`.
- The file starts with a **UTF-8 byte-order mark**, so a naive reader sees
  the first column as `﻿urn`. Read with `encoding='utf-8-sig'` in
  Python; DuckDB and `readr` handle it.

```bash
curl -s -G "$B/catalog/datasets/ca_la_ghg_emissions_sub_sector_ods_vw/exports/csv" \
    --data-urlencode "where=cauthnm = 'West of England' AND calendar_year = date'2024'" \
    --data-urlencode "delimiter=," -o ghg_woe_2024.csv
```

For analysis, prefer Parquet: it is typed and much smaller. Query it with
DuckDB without loading it: `duckdb -c "FROM 'ghg_woe.parquet' LIMIT 5"`.

## Dataset notes

What the API won't tell you.

### `ca_la_ghg_emissions_sub_sector_ods_vw` (greenhouse gas emissions)

- One row per local authority, year, sub-sector and gas: 107 local
  authorities in 15 combined authorities, 2005 to 2024, about 177,000 rows.
  All English combined authorities, not only WECA; filter
  `cauthnm = 'West of England'`. West of England here **includes North
  Somerset**.
- Two measures: `territorial_emissions_kt_co2e` (everything) and
  `emissions_within_the_scope_of_influence_of_las_kt_co2` (leaves out
  motorways, diesel railways, large industrial sites and land use).
- **`midyear_population_thousands` and `area_km2` repeat on every row.**
  Don't sum them across rows. Each authority has exactly one
  `la_ghg_sub_sector = 'Domestic Electricity' AND greenhouse_gas = 'CO2'`
  row per year, so sum over those:
  ```bash
  curl -s -G "$B/catalog/datasets/ca_la_ghg_emissions_sub_sector_ods_vw/records" \
      --data-urlencode "select=sum(midyear_population_thousands) as pop_k, sum(area_km2) as km2" \
      --data-urlencode "where=calendar_year = date'2024' AND la_ghg_sub_sector = 'Domestic Electricity' AND greenhouse_gas = 'CO2'" \
      --data-urlencode "group_by=cauthnm" | jq '.results'
  ```
  West of England 2024: 1,225k people, 1,514 km², 4,824 kt, so
  3.9 t CO₂e per person.
- The LULUCF sector (land use and forestry) is often **negative**, a net
  carbon sink.
- Declared facets: `cauthnm`, `local_authority`, `calendar_year`,
  `la_ghg_sector`, `la_ghg_sub_sector`, `greenhouse_gas`.
- `cauthcd` matches `cauth25cd` in `cauths_weca_as_lep`.

### `cauths_weca_as_lep` (combined authority boundaries)

- 15 shapes: `cauth25nm`, `cauth25cd`, `geo_point_2d`, `geo_shape`. West of
  England includes North Somerset, as in the emissions dataset.
- Leave `geo_shape` out of previews.

### `epc_domestic_lep_ods` (domestic EPCs)

- Latest certificate per home, about 344,000 rows, for the four West of
  England authorities including North Somerset.
- Declared facets: `local_authority_label`, `property_type`, `tenure`,
  `current_energy_rating`, `transaction_type`, `lodgement_datetime`.
- `tenure` and `transaction_type` use two spellings (capitalised for
  certificates lodged 2012 to 2014), so each value appears twice.

### `ons_values_west_of_england` and `ons_indicators` (ONS local statistics)

- Exported from the MotherDuck views `ons_explore.main.export_ons_values` and
  `export_ons_indicators` (repo `~/projects/west-of-england-ons`,
  `sql/02_export_views.sql`). Uploaded 2026-09-25; page
  `west-of-england-indicators`.
- `ons_values_west_of_england`: 13,041 rows, one per authority, indicator,
  period (and sex and age for the pyramid). Only the four West of England
  authorities; everyone else is summarised on each row as
  `other_p10`/`other_median`/`other_p90`/`other_min`/`other_max`.
- **Band, `england_value` and `n_*` repeat on each authority's row.** Use
  MIN, MAX or AVG, never SUM.
- `Population by age and sex` has sex `Male`, `Female` **and `All`**: exclude
  `All` for a pyramid. `age_min` (int) orders the age bands; `age` sorts as
  text.
- `status` is null on all but 16 rows (all 2019/20 child-weight
  indicators). Grouping on it through `ods-adv-analysis` breaks the widget
  (see the `ods-pages` skill).
- Facets on values: `indicator`, `category`, `chart_type`, `areanm`,
  `period`, `period_label`, `sex`, `age`, `age_min`. On indicators:
  `indicator`, `category`, `chart_type`, `is_category_default`.
- `is_category_default` is **text** (`'true'`/`'false'`), not boolean.
- `period` is the start of the period; `period_label` is the display form
  (2023/24, Mid-2024, Jun 2026). `timescale` on the indicators dataset
  says whether to chart by `year` or `month`.
- The unit of `Housing affordability ratio (residence-based)` is `%` in the
  source metadata, though the indicator is a ratio.

### Other frequently used datasets

| Dataset id | Content | Scope |
|---|---|---|
| `air-quality-measurements` | Annual NO2, PM10, PM2.5 by monitoring site | WECA |
| `electricity-consumption` | Postcode-level electricity consumption | WECA |
| `priorities-grouped-tbl` | LNRS biodiversity priorities by theme | WECA |
| `weca_caz` | Clean Air Zone boundary | WECA |
| `woe_deri_score` | Digital Exclusion Risk Index scores | WECA |
| `schools-lep` | Schools in the LEP area | WECA |
| `weca-apprenticeship-starts` | Apprenticeship starts | WECA |

Add a note here whenever a dataset's structure causes a wrong result.
