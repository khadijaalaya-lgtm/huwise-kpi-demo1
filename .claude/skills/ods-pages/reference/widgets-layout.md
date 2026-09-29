# Layout and page furniture

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsSimpleTab

**Module:** `ods-widgets`
**Type:** Directive

#### Usage

as element:

```html
<ods-simple-tab
       label="{string}"
       fontawesome-class="{string}"
       keep-content="{boolean}">
</ods-simple-tab>
```

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `label` | string | The label to be displayed in the tab |
| `fontawesomeClass` | string | The Font Awesome icon name used for the tab, without the 'fa-' prefix |
| `keepContent` | boolean | By default, the widget destroys and rebuilds the pane content at deselection/selection. It acts like an ng-if when the panel is selected/deselected. When set to `true`, the widget does not destroy and rebuild the pane content at deselection/selection. _(default: false)_ |

#### Notes

A single pane inside `odsSimpleTabs`. It carries no context of its own: the
label is the tab's caption, and everything nested inside is the pane body.

By default the pane's contents are destroyed on deselection and rebuilt on
selection, which resets any widget inside it (a map recentres, a chart
refetches). Set `keep-content="true"` to keep the pane alive while hidden.

## odsSimpleTabs

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsSimpleTabs widget generates a tabbed interface that allows you to switch between separate views.

#### Usage

as element:

```html
<ods-simple-tabs
       sync-to-scope="{string}">
</ods-simple-tabs>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `syncToScope` | string | Name of parent scope variable to sync the current active tab _(default: 'simpleTabActive')_ |

## odsPopIn

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsPopIn widget displays a pop-in on the page with the provided content.

You can define the time before displaying the pop-in (the timer start when the widget is loaded). In the content, you can access a `hidePopIn()` function that you can use in an `ng-click`.

#### Usage

as element:

```html
<ods-pop-in
       name="{string}"
       title="{string}"
       display-after="{number}"
       display-only-once="{boolean}">
</ods-pop-in>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `name` | string | The name of the pop-in, used internally to uniquely reference it (required) |
| `title` | string | The title displayed inside the pop-up windows _(default: '')_ |
| `displayAfter` | number | The delay in second before displaying the pop-up window _(default: 10)_ |
| `displayOnlyOnce` | boolean | When set to `false`, the pop-up window will be displayed at each browsing session of the user. _(default: true)_ |

## odsSpinner

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsSpinner widget displays the custom Opendatasoft spinner. Its size and color match the current font. If the browser doesn't support SVG animation via CSS, an animated GIF will be displayed instead.

#### Usage

as element:

```html
<ods-spinner>
</ods-spinner>
```

#### Directive info

  * This directive creates new scope.

## odsWidgetTooltip

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsWidgetTooltip widget is a helper for displaying custom tooltips.

It allows to configure the usable fields in the tooltip and the template and does the HTML rendering giving back the compiled HTML to the calling widget.

By default, the template for the custom tooltip can access the record and a displayedFields array that lists the record fields that should appear in the tooltip.

#### Usage

as attribute

```html
<ANY ods-widget-tooltip>
   ...
</ANY>
```

## odsAutoResize

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsAutoResize widget enables the auto-resize functionality on a widget that supports it. By default, this widget forces the affected element to fill the height to the bottom of the window.

#### Usage

as attribute

```html
<ANY ods-auto-resize>
   ...
</ANY>
```

## odsGetElementLayout

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsGetElementLayout widget gets the height and width of an element. The variable is an object that contains 2 keys: 'height' and 'width'.

#### Usage

as attribute

```html
<ANY ods-get-element-layout>
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

## odsGetWindowLayout

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsGetElementLayout widget gets the height and width of the window. The variable is an object that contains 2 keys: 'height' and 'width'.

#### Usage

as attribute

```html
<ANY ods-get-window-layout>
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.
