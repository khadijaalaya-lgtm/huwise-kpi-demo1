# Back-office processors

ODSQL has no `JOIN`, and a widget queries one dataset at a time. That does
not mean two datasets cannot be combined. **Processors** run in the back
office when a dataset is published. They transform or enrich its records
before any API or widget sees them. Page markup cannot add one: suggest it to
the user, who configures it on the dataset's Processing tab and republishes.

Full list: <https://userguide.huwise.com/en/categories/480706-processors>
(checked 2026-09-27).

## When to reach for one

Do the work in a processor when the page would otherwise need:

- fields from a second dataset on every row, such as indicator metadata
  (unit, description, source) beside each value, or a lookup from a code to
  a name or region;
- a derived field that the page would recompute in every binding (an
  `Expression` processor, computed per record);
- a field reshaped for faceting, such as a date normalised or a text value
  split into a multivalued field.

Doing it at publish time keeps the page to one context and one query, and
the derived field can be declared a facet, so `ods-chart` can group by it.

The cost: the user has to change and republish the dataset, and the result
depends on the remote dataset staying consistent. Say what you are proposing
and why. Don't assume the processor exists already; check the field list in
the API.

## Join datasets processor

<https://userguide.huwise.com/en/articles/2034370>

Enriches the local dataset with fields from a remote dataset (on the same
portal or elsewhere on the Huwise network), matched on one or more key
fields.

| Parameter | Notes |
|---|---|
| Dataset | The remote dataset |
| Local keys / Remote keys | One or more fields each. Integer, decimal and numeric-text fields can match each other; a leading zero in text is significant |
| Output fields | The remote fields to copy in, or tick *Retrieve all fields on publish* |
| Output fields prefix | Stops copied fields overwriting local fields of the same name; needed when joining twice |
| Case sensitive | On by default. Turning it off is slower; not needed for codes |
| Multivalued + separator | Several remote rows matching one key are collapsed into **one multivalued field** (default separator `/`) |
| Reprocess all records on schedule | See the update trap below |

How it behaves, compared with SQL:

- **A lookup, not a relational join.** Multiple matches become one
  multivalued field, not extra rows, so the local dataset keeps its row
  count and grain. For one-to-one metadata lookups (indicator → unit, GSS
  code → name) this is exactly what you want.
- **Join type is not documented.** The guide describes enriching local
  records when a match exists, which suggests local rows without a match are
  kept with empty fields (a left join). Untested: check the record count and
  a known non-matching key after publishing.
- **Updates to the remote dataset don't reach existing records by default.**
  Processing is incremental. Tick *Reprocess all records on schedule*, which
  needs a scheduler on the dataset, or republish the local dataset by hand.
- **Geoshapes inflate memory.** Don't copy a geo shape field in unless the
  page draws it; join on the code and let `ods-map` fetch shapes from the
  boundary dataset.

## Other processors worth knowing

| Processor | Use |
|---|---|
| Expression | Formula per record into a new or existing field (`=value * 100`). Can't see other records or datasets |
| Add a field / Copy a field / Concatenate text | Build keys or labels for joins and facets |
| Normalise date / Set timezone | Make a text date a real date so `timescale` and date facets work |
| Split text / JSON array to multivalued | Turn a delimited text field into a multivalued facet |
| Transpose columns to rows | Wide to long, so years or measures become one facet |
| Skip records / Delete record | Drop rows the page never needs |
| GeoJoin / Retrieve administrative divisions | Attach boundary shapes by admin code. Coverage outside France is unverified; for UK boundaries, joining on GSS codes from a boundary dataset on the portal is safer |

## Widget-side alternatives (no republish)

- `ods-map` in `aggregation` mode accepts `joinContext`, `localKey` and
  `remoteKey` to colour shapes from one context by values from another
  (`widgets-map.md`).
- Two contexts side by side, with the second filtered from a value bound out
  of the first. This works for a card or two, but every extra context is
  another query, and the page can't group or facet on the combined fields.
