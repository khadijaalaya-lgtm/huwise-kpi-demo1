# Filters and configuration

A **filter** transforms a value inside a `{{ }}` binding, after a pipe:

```html
{{ record.fields.price | number:2 }}
{{ record.fields.name | capitalize }}
{{ record.fields.tags | join:', ' }}
```

Filters chain left to right, and arguments follow the name after colons:

```html
{{ record.fields.description | truncate:80 | capitalize }}
```

They work only inside bindings and in `ng-repeat` expressions. They cannot be
used in a widget's own attributes, because those are parsed by the widget
rather than by AngularJS.

## AngularJS built-in filters

These ship with AngularJS itself, not with ods-widgets, so they are absent
from the widget documentation. They are the ones you reach for most.

| Filter | Example | Effect |
|---|---|---|
| `number` | `{{ n \| number }}` | Thousands separators. `number:1` fixes one decimal place |
| `date` | `{{ d \| date:'dd/MM/yyyy' }}` | Formats a date or datetime |
| `currency` | `{{ v \| currency:'£' }}` | Currency symbol and two decimals |
| `uppercase` / `lowercase` | `{{ s \| uppercase }}` | Case conversion |
| `limitTo` | `{{ items \| limitTo:5 }}` | First n items of an array or string |
| `orderBy` | `ng-repeat="r in rows \| orderBy:'-count'"` | Sorts; `-` reverses |
| `json` | `{{ obj \| json }}` | Pretty-prints an object. Useful for debugging a binding |

`{{ value | json }}` is the fastest way to find out what a widget actually put
into scope when a binding renders blank.

## ods-widgets filters


| Filter | Usage |
|---|---|
| [`capitalize`](#capitalize) | `{{ capitalize_expression \| capitalize }}` |
| [`fieldsFilter`](#fieldsfilter) | `{{ fieldsFilter_expression \| fieldsFilter:fields }}` |
| [`firstValue`](#firstvalue) | `{{ firstValue_expression \| firstValue }}` |
| [`fromjson`](#fromjson) | `{{ fromjson_expression \| fromjson }}` |
| [`imageify`](#imageify) | `{{ imageify_expression \| imageify }}` |
| [`imageUrl`](#imageurl) | `{{ imageUrl_expression \| imageUrl:context }}` |
| [`isAfter`](#isafter) | `{{ isAfter_expression \| isAfter:date2 }}` |
| [`isBefore`](#isbefore) | `{{ isBefore_expression \| isBefore:date2 }}` |
| [`isDefined`](#isdefined) | `{{ isDefined_expression \| isDefined }}` |
| [`isEmpty`](#isempty) | `{{ isEmpty_expression \| isEmpty }}` |
| [`join`](#join) | `{{ join_expression \| join:[separator] }}` |
| [`keys`](#keys) | `{{ keys_expression \| keys }}` |
| [`math`](#math) | `{{ math_expression \| math:function }}` |
| [`moment`](#moment) | `{{ moment_expression \| moment:format }}` |
| [`momentadd`](#momentadd) | `{{ momentadd_expression \| momentadd:precision:number }}` |
| [`momentdiff`](#momentdiff) | `{{ momentdiff_expression \| momentdiff:date2:measurement }}` |
| [`nofollow`](#nofollow) | `{{ nofollow_expression \| nofollow }}` |
| [`normalize`](#normalize) | `{{ normalize_expression \| normalize }}` |
| [`numKeys`](#numkeys) | `{{ numKeys_expression \| numKeys }}` |
| [`shortSummary`](#shortsummary) | `{{ shortSummary_expression \| shortSummary:length }}` |
| [`shortTextSummary`](#shorttextsummary) | `{{ shortTextSummary_expression \| shortTextSummary:length }}` |
| [`slugify`](#slugify) | `{{ slugify_expression \| slugify }}` |
| [`split`](#split) | `{{ split_expression \| split:[separator] }}` |
| [`stringify`](#stringify) | `{{ stringify_expression \| stringify }}` |
| [`themeColor`](#themecolor) | `{{ themeColor_expression \| themeColor }}` |
| [`themeSlug`](#themeslug) | `{{ themeSlug_expression \| themeSlug }}` |
| [`thumbnailUrl`](#thumbnailurl) | `{{ thumbnailUrl_expression \| thumbnailUrl:context }}` |
| [`timesince`](#timesince) | `{{ timesince_expression \| timesince }}` |
| [`toObject`](#toobject) | `{{ toObject_expression \| toObject:key }}` |
| [`truncate`](#truncate) | `{{ truncate_expression \| truncate:length }}` |
| [`uriComponentEncode`](#uricomponentencode) | `{{ uriComponentEncode_expression \| uriComponentEncode }}` |
| [`uriEncode`](#uriencode) | `{{ uriEncode_expression \| uriEncode }}` |
| [`values`](#values) | `{{ values_expression \| values }}` |
| [`videoify`](#videoify) | `{{ videoify_expression \| videoify }}` |

## capitalize

```html
{{ capitalize_expression | capitalize }}
```

`string` — The input string, capitalized (ie with its first character in capital letter)

| Parameter | Type | Details |
|---|---|---|
| `text` | string | A string to capitalize |

## fieldsFilter

```html
{{ fieldsFilter_expression | fieldsFilter:fields }}
```

`Object[]` — A sublist of the `fields` input, containing only fields which are referenced in the `fieldNames` attribute.

| Parameter | Type | Details |
|---|---|---|
| `fieldNames` | string[] | A list of field names. |
| `fields` | Object[] | A list of fields as returned by the API. |

## firstValue

```html
{{ firstValue_expression | firstValue }}
```

`String|Number|Boolean|Array|Object` — If the input value is an array, returns the first of its values, otherwise return the value itself.

| Parameter | Type | Details |
|---|---|---|
| `array` | Array | An array of anything |

## fromjson

```html
{{ fromjson_expression | fromjson }}
```

`json` — The resulting, parsed, Json object

| Parameter | Type | Details |
|---|---|---|
| `A` | string | string value containing a stringified JSON object |

## imageify

```html
{{ imageify_expression | imageify }}
```

`string` — An `img` tag pointing to the image.

| Parameter | Type | Details |
|---|---|---|
| `url` | string | A url pointing to an image file (with a jpg, jpeg, png or gif extension) |

## imageUrl

```html
{{ imageUrl_expression | imageUrl:context }}
```

`string` — A url pointing to the file itself.

| Parameter | Type | Details |
|---|---|---|
| `fieldValue` | Object | A record field of type file |
| `context` | DatasetContext CatalogContext | The context from which the record is extracted |

## isAfter

```html
{{ isAfter_expression | isAfter:date2 }}
```

`Boolean` — Whether date1 is strictly after date2 or not, down to the millisecond.

| Parameter | Type | Details |
|---|---|---|
| `date1` | string Date Number Array Moment | A date |
| `date2` | string Date Number Array Moment | Another date, which doesn't need to be in the same format as date1. |

## isBefore

```html
{{ isBefore_expression | isBefore:date2 }}
```

`Boolean` — Whether date1 is strictly before date2 or not, down to the millisecond.

| Parameter | Type | Details |
|---|---|---|
| `date1` | string Date Number Array Moment | A date |
| `date2` | string Date Number Array Moment | Another date, which doesn't need to be in the same format as date1. |

## isDefined

```html
{{ isDefined_expression | isDefined }}
```

`Boolean` — true if the value is defined.

| Parameter | Type | Details |
|---|---|---|
| `value` | string number Object Boolean | Any variable |

## isEmpty

```html
{{ isEmpty_expression | isEmpty }}
```

`Boolean` — Return true if the object is empty (has no key)

| Parameter | Type | Details |
|---|---|---|
| `object` | Object | An object. |

## join

```html
{{ join_expression | join:[separator] }}
```

`string` — All strings joined with the given separator.

| Parameter | Type | Details |
|---|---|---|
| `values` | string[] | A list of strings |
| `[separator]` | string | The separator (default: `', '`) |

## keys

```html
{{ keys_expression | keys }}
```

`string[]` — The keys of the input object.

| Parameter | Type | Details |
|---|---|---|
| `object` | Object | An object. |

## math

```html
{{ math_expression | math:function }}
```

`Number` — The result

| Parameter | Type | Details |
|---|---|---|
| `value` | string Date Number Array | A numerical value to process |
| `function` | string | A Math library function. Can be any of: abs (absolute value), cbrt (cube root), ceil (smallest integer >= value), cos (cosine), exp (E* value), floor (largest integer <= value), log`or`ln (natural logarithm), log2 (base 2 logarithm), log10 (base 10 logarithm), pow (power) ex: {{ val | math : 'pow' : 2 }} for val^2 random (pseudo-random number between 0 and 1 value), round (value rounded to the nearest integer), sign (sign of value, pos. = 1, neg = -1, zero = 0), sin (sine), sqrt (positive square root), tan (tangent), trunc (integer part of value) or static properties: PI or E . |

## moment

```html
{{ moment_expression | moment:format }}
```

Render a given date in a specified format.

| Parameter | Type | Details |
|---|---|---|
| `date` | string Date Number Array Moment | A date |
| `format` | string | See http://momentjs.com/docs/#/displaying/format/ for the full list of options |

**Returns** `string` — The input date, formatted.

## momentadd

```html
{{ momentadd_expression | momentadd:precision:number }}
```

`Moment` — A date

| Parameter | Type | Details |
|---|---|---|
| `date` | string Date Number Array Moment | A date |
| `precision` | string | A unit describing the type of the `number` parameter. Can be any of `years`, `quarters`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds` or `milliseconds`. |
| `number` | number | How many years, hours, minutes (depending on `precision`) should be added. Can be a negative number. |

## momentdiff

```html
{{ momentdiff_expression | momentdiff:date2:measurement }}
```

This filter returns the difference between two dates, in the given measurement. For example
you could use it to calculate how many days there are between two dates.

| Parameter | Type | Details |
|---|---|---|
| `date1` | string Date Number Array Moment | A date |
| `date2` | string Date Number Array Moment | A date |
| `measurement` | string Date Number Array Moment | The measurement to use ("years", "months", "weeks", "days", "hours", "minutes", and "seconds"). By default, milliseconds are used. (default: milliseconds) |

**Returns** `string` — The difference in measurement between the two dates.

## nofollow

```html
{{ nofollow_expression | nofollow }}
```

`string` — The input html code with all link tags now including the attributes `target="_blank"` and `rel="nofollow"`

| Parameter | Type | Details |
|---|---|---|
| `html` | string | A string of html code. |

## normalize

```html
{{ normalize_expression | normalize }}
```

`string` — The text cleaned of all of its diacritical signs.

| Parameter | Type | Details |
|---|---|---|
| `text` | string | Some text |

## numKeys

```html
{{ numKeys_expression | numKeys }}
```

`string[]` — The number of keys of the input object.

| Parameter | Type | Details |
|---|---|---|
| `object` | Object | An object. |

## shortSummary

```html
{{ shortSummary_expression | shortSummary:length }}
```

`string` — A short summary from the given text, usually the first paragraph. If longer than the required length, an ellipsis will be made. This function should not be used with unsafe HTML.

| Parameter | Type | Details |
|---|---|---|
| `text` | string | Some HTML |
| `length` | number | The maximum length of the summary |

## shortTextSummary

```html
{{ shortTextSummary_expression | shortTextSummary:length }}
```

`string` — A short summary from the given text, usually the first paragraph. If longer than the required length, an ellipsis will be made.

| Parameter | Type | Details |
|---|---|---|
| `text` | string | Some text |
| `length` | number | The maximum length of the summary |

## slugify

```html
{{ slugify_expression | slugify }}
```

`string` — The slugified (that is normalized, with dashes instead of spaces) version of the input text.

| Parameter | Type | Details |
|---|---|---|
| `text` | string | Some text |

## split

```html
{{ split_expression | split:[separator] }}
```

`Array` — An array containing all strings generated by the String.split method.

| Parameter | Type | Details |
|---|---|---|
| `arrayAsString` | string | A string representing an array of values |
| `[separator]` | string | The separator (default: `';'`) |

## stringify

```html
{{ stringify_expression | stringify }}
```

`string` — The stringified version of the input object (generated through JSON.stringify)

| Parameter | Type | Details |
|---|---|---|
| `jsonObject` | Object | A JSON object |

## themeColor

```html
{{ themeColor_expression | themeColor }}
```

`string` — The hexadecimal color code for this theme, as defined through ODSWidgetsConfig 's `theme` setting.

| Parameter | Type | Details |
|---|---|---|
| `theme` | string | A theme's slug (that is, its name normalized, see themeSlug ) |

## themeSlug

```html
{{ themeSlug_expression | themeSlug }}
```

`string` — The slugified (that is normalized, with dashes instead of spaces) version of themeName.

| Parameter | Type | Details |
|---|---|---|
| `themeName` | string | A theme's full name |

## thumbnailUrl

```html
{{ thumbnailUrl_expression | thumbnailUrl:context }}
```

`string` — A url pointing to a thumbnail of the file.

| Parameter | Type | Details |
|---|---|---|
| `fieldValue` | Object | A record field of type file |
| `context` | DatasetContext CatalogContext | The context from which the record is extracted |

## timesince

```html
{{ timesince_expression | timesince }}
```

`string` — A fully localized string describing the time between the input date and now. For example: "A few seconds ago"

| Parameter | Type | Details |
|---|---|---|
| `date` | string Date Number Array Moment | A date |

## toObject

```html
{{ toObject_expression | toObject:key }}
```

Transform an array of objects into an objet, using a key passed as a parameter.

| Parameter | Type | Details |
|---|---|---|
| `array` | Array | An array of objects. |
| `key` | String | The key for the transformation. |

**Returns** `Object` — The array of objects converted into an object.

## truncate

```html
{{ truncate_expression | truncate:length }}
```

`string` — The `length` first chars of the input `text`, or the full input `text` if it is shorter than `length`.

| Parameter | Type | Details |
|---|---|---|
| `text` | string | Original text to truncate. |
| `length` | number | Max length of the truncated text. |

## uriComponentEncode

```html
{{ uriComponentEncode_expression | uriComponentEncode }}
```

This filter can be used to prepare a string to be used as a parameter when building a link.
It's important to understand that 'uriComponentEncode' filters the entire string, whereas 'uriEncode' (see reference page) filter ignores
protocol prefix ('http://') and domain name.
This filter uses the 'encodeURIComponent' JavaScript function under the hood.

| Parameter | Type | Details |
|---|---|---|
| `A` | string | string. |

**Returns** `string` — A URL encoded value (be aware that this filter will also encode protocol prefix ('http://') and domain name).

## uriEncode

```html
{{ uriEncode_expression | uriEncode }}
```

This filter can be used to prepare a string to be used when building a link.
It's important to understand that this filter encodes a string but ignores protocol prefix ('http://') and domain name.
This filter uses the 'encodeURI' JavaScript function under the hood.

| Parameter | Type | Details |
|---|---|---|
| `A` | string | string. |

**Returns** `string` — A URL encoded value (but ignores protocol prefix ('http://') and domain name).

## values

```html
{{ values_expression | values }}
```

`Array` — An array containing all of the object's values

| Parameter | Type | Details |
|---|---|---|
| `object` | Object | An object. |

## videoify

```html
{{ videoify_expression | videoify }}
```

`string` — An iframe tag including the relevant video player configured with the input url

| Parameter | Type | Details |
|---|---|---|
| `url` | string | A youtube, dailymotion or vimeo URL. |

# Configuration

## ODSWidgetsConfig

A service containing all the configuration values available. Available configuration values are described
in the ODSWidgetsConfigProvider documentation.

## ODSWidgetsConfigProvider

Use `ODSWidgetsConfigProvider` to set configuration values used by various directives.
The available settings are:

- `defaultDomain` - string - Value used as `domain` parameter for Catalog Contexts and Dataset Contexts when none is specified. Defaults is '' (empty string), which means a local API (root is /).

- `basemaps` - Array A list of `basemap` objects. By default, a free map service from Jawg.io will be used, but it is not suitable to a real usage in production due to low rate limits.

- `chartColors` - Array A list of colors to use for charts. In each chart widget, the first chart will use the first color, the second chart will use the second color, and so on until the end of the list is reached, and we start from the beginning of the list again. If not set, default colors will be used, depending on the widgets themselves.

- `disqusShortname` - string - Shortname used by default for all ods-widgets.directive:odsDisqus widgets.

- `themes` - Object - Configuration of themes and their colors and/or picto

#### Configuring basemaps

By default, the widgets will use a free map service from Jawg.io as a basemap for every map.
However, this is only suited for demos or development because of a limited number of calls. If you're making
something for the "real world", you should use another map provider. Currently, the widgets support the following
providers:

- Mapbox : you can create a free Mapbox account, which will allow you to use any of the "classic maps" as a provider described on this documentation page . 

```json
"basemaps": [{
         "label": "Mapbox",
         "provider": "mapbox.streets",
         "mapbox_access_token": "<your Mapbox access token>"
    }, ...
```


- Jawg : if you are a Jawg.io customer, you can also use your Jawg API key for higher rate limits. Use `jawg.streets`, `jawg.light` or `jawg.dark` as a provider. 

```json
{
         "label": "Jawg",
         "provider": "jawg.streets",
         "jawg_apikey": "<your jawg access token>"
    }
```


- OpenStreetMap : The OpenStreetMap service provides two free maps for very specific uses (`osmtransport` for a transport map, `opencycle` for a cycle map). These maps are not suitable for very heavy traffic; in doubt, please contact OpenStreetMap to ask them about your usage. 

```json
{
         "label": "OpenStreetMap",
         "provider": "osmtransport"
    }
```

| Parameter | Type | Details |
|---|---|---|
| `customConfig (optional)` | Object | An object containing the configuration values to override. |
