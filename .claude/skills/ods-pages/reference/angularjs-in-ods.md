# AngularJS, only the parts ODS pages use

ODS pages are AngularJS 1.x templates. You never write a controller, a module
or a JavaScript file: the widgets supply the data and you bind to it in HTML.
This file covers that subset and nothing else.

## Bindings

`{{ expression }}` prints a value. The expression is evaluated against the
current **scope**, which is the set of variables the surrounding widgets have
published.

```html
{{ n }}
{{ n | number }}
{{ record.fields.current_energy_rating }}
```

A binding that cannot be resolved renders as an empty string. It does not
throw, and it logs nothing. An empty page is the normal symptom of a wrong
variable name, so treat blankness as a naming bug first.

`{{ value | json }}` prints the whole object and is the quickest way to see
what a widget actually published.

## Where variables come from

A widget either takes a context or creates a variable, and the attribute value
is the *name you are choosing*, not a reference to something existing:

```html
<div ods-aggregation="n"
     ods-aggregation-context="epc"
     ods-aggregation-function="COUNT">
    {{ n }}
</div>
```

`ods-aggregation="n"` means "call the result `n`". `n` exists only inside that
element. Moving the `{{ n }}` outside the `div` silently blanks it, because
the variable lives on the scope that element created.

Context declarations follow the same shape, but the context's own parameters
are prefixed with the context name:

```html
<div ods-dataset-context
     context="epc"
     epc-dataset="epc_domestic_lep_ods"
     epc-parameters="{'rows': 10}">
```

`context="epc"` names it; every other setting for it starts `epc-`. Declaring
two contexts means `context="epc,pop"` and then both `epc-` and `pop-`
prefixed attributes.

## Attribute names are kebab-case

The documentation lists parameters in camelCase because that is how AngularJS
normalises them internally. In HTML you always write kebab-case:

| Documentation | HTML |
|---|---|
| `chartType` | `chart-type="column"` |
| `expressionY` | `expression-y="price"` |
| `displayStackValues` | `display-stack-values="true"` |
| `refineOnClickContext` | `refine-on-click-context="epc"` |

## Elements versus attributes

Every widget is one or the other, and the reference says which. This is the
single most common way to get a blank page:

```html
<!-- odsAggregation is an attribute directive -->
<div ods-aggregation="n" ods-aggregation-context="epc"
     ods-aggregation-function="COUNT">{{ n }}</div>

<!-- odsChart is an element directive -->
<ods-chart>...</ods-chart>
```

Writing `<ods-aggregation>` as an element produces no output and no error: the
browser treats it as an unknown element and AngularJS never matches it.

## Repeating over results

Widgets publish collections of their own shape, and the shape is the thing to
get right. `ods-facet-results` items have `name`, `count` and `path`:

```html
<li ng-repeat="r in ratings | orderBy:'-count' | limitTo:5">
    {{ r.name }}: {{ r.count | number }}
</li>
```

Records from a results widget nest their data one level down, under `fields`.
Binding `record.address` instead of `record.fields.address` is a common and
silent mistake:

```html
<div ods-results="records" ods-results-context="epc" ods-results-max="10">
    <p ng-repeat="record in records">
        {{ record.fields.address }} — {{ record.fields.current_energy_rating }}
    </p>
</div>
```

## Showing and hiding

The choice matters more here than in an ordinary AngularJS app: a widget
inside `ng-show` is still in the DOM, so it still loads and still queries the
portal API while invisible. Use `ng-if` around anything containing a widget,
and `ng-show` only for cheap content that toggles often.

A widget's data arrives asynchronously, so on first paint `ratings` is
undefined and `ratings.length === 0` is false. Guard on the data instead:

```html
<p ng-if="ratings && ratings.length === 0">No results.</p>
```

## Conditional classes and styles

```html
<span ng-class="{ 'is-high': r.count > 1000 }">{{ r.name }}</span>
<span ng-style="{ width: (r.count / n * 100) + '%' }"></span>
```

`ng-class` takes an object of class names to boolean expressions. `ng-style`
takes CSS properties in camelCase (`backgroundColor`, not `background-color`)
and values as strings, so units must be concatenated as above.

## Expressions are not JavaScript

AngularJS expressions are deliberately limited. They have no `if`, no loops,
no function declarations, and no access to `window` or `document`. They are
forgiving about null: `a.b.c` returns undefined rather than throwing when `a`
is undefined, which is why a typo blanks rather than errors.

The ternary operator works, and is the usual way to branch inline:

```html
{{ r.count > 1000 ? 'high' : 'low' }}
```

## Mutating values

`ng-click` with a bare assignment is the whole toolkit for page-level state,
since you cannot write a controller:

```html
<button ng-click="expanded = !expanded">Toggle</button>
<div ng-if="expanded">...</div>
```

`expanded` springs into existence on the nearest scope, which is why a button
inside an `ng-repeat` toggles only its own row — usually what you want, and
surprising when it is not.
