# Maps and geo

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsMap

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsMap widget allows to build a map visualization and display data through various modes that can be composed of several dynamic layers, each being based on a Dataset Context.

odsMap is a base widget. Used on its own, it can only display a simple map with default configurations.

```html
<!-- Displays a map of Paris using the data from mycontext and an automatic visualization mode -->
<ods-map context="mycontext" location="12,48.85218,2.36996"></ods-map>
```

odsMap can be combined with two related map widgets to create more complex maps and fully configure their modes and behaviors.

  * odsMapLayer, allows to declare a layer of data to display on the map
  * odsMapLayerGroup, allows to declare a group of layers

In its fullest form, a map visualization would then be composed of several layers organized in groups. For more information on how to use and configure the odsMapLayer and odsMapLayerGroup widgets, see the odsMapLayer and odsMapLayerGroup documentation.

```html
<ods-map ...>
   <ods-map-layer-group ...>
      <ods-map-layer ...></ods-map-layer>
      <ods-map-layer ...></ods-map-layer>
   </ods-map-layer-group>
   <ods-map-layer-group ...>
      <ods-map-layer ...></ods-map-layer>
   </ods-map-layer-group>
</ods-map>
```

odsMap, when used for a complex map visualization, is mostly used to set the basic configurations of the map (e.g., basemap, location). odsMap also helps set all map-controlling options, such as zoom configurations, buttons, search bar display, and groups and layers behavior control.

#### Usage

as element:

```html
<ods-map
       context="{DatasetContext}"
       location="{string}"
       basemap="{string}"
       min-zoom="{integer}"
       max-zoom="{integer}"
       scroll-wheel-zoom="{boolean}"
       static-map="{boolean}"
       no-refit="{boolean}"
       toolbar-geolocation="{boolean}"
       auto-geolocation="{boolean}"
       toolbar-drawing="{boolean}"
       toolbar-fullscreen="{boolean}"
       display-control="{boolean}"
       display-control-single-layer="{boolean}"
       ods-auto-resize="{boolean}"
       search-box="{boolean}"
       display-legend="{boolean}"
       sync-to-url="{boolean}"
       sync-to-object="{Object}">
</ods-map>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | _(mandatory)_ Dataset Context to use. If the **context** parameter is managed with odsMapLayer, it should not be configured for odsMap. |
| `location` | string | Controls the default location of the map upon initialization. The value must be set under the following format: `zoom,latitude,longitude`. For example, if you want to have a map centered on Paris, France, you should use `12,48.85218,2.36996`. By default, if a location is not specified, the map will try to fit all the displayed data when initializing. |
| `basemap` | string | Identifier of the basemap to use by default, as defined in ODSWidgetsConfig.basemaps. By default, the first available basemap will be used. |
| `minZoom` | integer | Limits the map to a minimum zoom value. By default, this is defined by the minimum zoom of the basemap. _(default: none)_ |
| `maxZoom` | integer | Limits the map to a maximum zoom value. By default, this is defined by the maximum zoom of the basemap. _(default: none)_ |
| `scrollWheelZoom` | boolean | When set to `true`, scrolling the mouse wheel over the map can be used to zoom in or zoom out. _(default: true)_ |
| `staticMap` | boolean | When set to `true`, the map can't be zoomed in/out or moved. Markers are still clickable. _(default: false)_ |
| `noRefit` | boolean | By default, the map refits its view whenever the displayed data changes. When set to `true`, the map stays at the same location. _(default: false)_ |
| `toolbarGeolocation` | boolean | When set to `true`, the "geolocate" button is displayed in the map's toolbar. _(default: true)_ |
| `autoGeolocation` | boolean | When set to `true`, the geolocation, which centers and zooms the map on the user's location, is automatically done upon initialization. `autoGeolocation` is only available when there is no **location** parameter set for the widget. Caution: location sharing must be allowed priorly for Firefox users when multiple odsMap widget are set with `autoGeolocation=true` on the same page. _(default: false)_ |
| `toolbarDrawing` | boolean | When set to `false`, the drawing tools to draw filter areas are not displayed in the map's toolbar. _(default: true)_ |
| `toolbarFullscreen` | boolean | When set to `false`, the "fullscreen" button is not displayed in the map's toolbar. _(default: true)_ |
| `displayControl` | boolean | When set to `true`, displays a control to choose whether groups or single datasets outside groups should be displayed, using toggle buttons. Note: it shouldn't be combined with the usage of **showIf** on odsMapLayer, as it will lead to inconsistencies in the user interface. _(default: false)_ |
| `displayControlSingleLayer` | boolean | When set to `true`, only one layer is displayed at a time using the control of groups and single datasets display. _(default: false)_ |
| `odsAutoResize` | boolean | For more information, see Auto Resize. |
| `searchBox` | boolean | When set to `true`, a search box is displayed on the map so that users can jump to another location through a search or search specific data on the map. _(default: false)_ |
| `displayLegend` | boolean | When set to `true`, a caption is displayed in the bottom right corner of the map. _(default: true)_ |
| `syncToUrl` | boolean | When set to `true`, the settings of the **location** and **basemap** parameters are used in the page's URL. _(default: none)_ |
| `syncToObject` | Object | An object updated by the map's settings for the **location** and **basemap** parameters corresponding to new changes of location and basemap. _(default: none)_ |

## odsMapLayer

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsMapLayer widget allows to declare the data layers that can be displayed on a map visualization. odsMapLayer is one of the map-related widgets that can only be used based on odsMap, the primary map-related widgets. For more information on odsMap, see the documentation for this widget.

A map visualization can comprise several data layers, which are dynamic. In other words, if the context changes, the layer is refreshed and displays the new relevant data.

Each data layer is based on a context and can have its own display mode and configurations.

```html
<ods-map>
    <ods-map-layer context="mycontext" color="#FF0000" display="clusters"></ods-map-layer>
    <ods-map-layer context="mycontext2" display="heatmap"></ods-map-layer>
    <ods-map-layer context="mycontext3" display="raw" color="#0000FF"></ods-map-layer>
</ods-map>
```

**Layers display modes**

Map visualizations can either display:

  * the layer data itself (i.e., each point is a record from the dataset), or
  * an aggregation of data (i.e., each point is the result of an aggregation function).

Several display modes are available (see **display** parameter in the table below). However, only some of them support aggregation functions: `aggregation`, `heatmap`, and `clustersforced`.

Aggregation functions are specified in the odsMapLayer widget through 2 parameters: **function** and **expression** , which define the value used for the function (usually, the name of a field). For more information, see the "Parameters" table.

```html
<ods-map>
    <!-- Display a heatmap of the average value -->
    <ods-map-layer context="mycontext" display="heatmap" expression="value" function="AVG"></ods-map-layer>
</ods-map>
```

**Layers display color configurations**

Apart from `heatmap`, all display modes support color configuration. Three configuration types are available, depending on the display mode:

  * `color`: a color, as an hex code (#FF0F05) or a CSS color name (e.g., "red"). Available for any display mode.
  * `colorScale`: the name of a [ColorBrewer](http://colorbrewer2.org/) scheme (e.g., "YlGnBu"). Available only for `aggregation`.
  * `colorRanges`: a series of colors and ranges separated by a semicolon, to decide a color depending on a value. For example "red;20;orange;40;#00CE00" colors anything between 20 and 40 in orange, below 20 in red, and above 40 in a custom hex color.

It can be combined with a decimal or integer field name in `colorByField` to configure which field will be used to decide on the color (for `raw`) or with `function` and `expression` to determine the calculation used for the color (for `aggregation`).

Available for `raw` and `aggregation` display modes.

An additional `colorFunction` property can contain the `log` value to use logarithmic scales (instead of the default linear scale) for generating the color scale.

Available for `aggregation` and with `color` and `colorScale` display modes, or when none is specified.

On top of color configuration, the icon used as a marker on the map can be configured through the `picto` property. The property supports the keywords listed in the [Pictograms reference documentation](https://userguide.huwise.com/en/articles/2042498).

When displaying shapes, `borderColor` and `opacity` can be used to configure the color of the shape border and the opacity of the shape's fill.

**Layers zoom and hide & show configurations**

Layers can be hidden or shown depending on the configuration of the `showIf` parameter, which functions similarly to Angular's `ngIf`.

```html
<ods-map>
    <ods-map-layer context="mycontext" color="#FF0000" display="clusters"></ods-map-layer>
    <ods-map-layer context="mycontext2" display="heatmap" show-if="showHeatmap"></ods-map-layer>
</ods-map>
```

Layers can also be configured to only be visible between certain zoom levels, using the `showZoomMin` and/or `showZoomMax` parameters.

```html
<ods-map>
    <!-- This layer is only visible up to zoom 8 -->
    <ods-map-layer context="mycontext1" show-zoom-max="8"></ods-map-layer>
    <!-- This layer appears between zoom 9 and 14 -->
    <ods-map-layer context="mycontext2" show-zoom-min="9" show-zoom-max="14"></ods-map-layer>
    <!-- This layer is visible starting at zoom 15 -->
    <ods-map-layer context="mycontext3" show-zoom-min="15"></ods-map-layer>
</ods-map>
```

**Tooltips**

By default, tooltips show the values associated with a point or shape in a simple template. Custom HTML tooltip templates can be added inside the `<ods-map-layer></ods-map-layer>` tag. The custom template is AngularJS-enabled and will be provided with a `record` object; this object contains a `fields` object with all the values associated with the clicked point or shape.

```html
<ods-map location="12,48.86167,2.34146">
    <ods-map-layer context="mycontext">
        <div>my value is: {{record.fields.myvalue}}</div>
    </ods-map-layer>
</ods-map>
```

In case the tooltip is not relevant for the map visualization, it can be disabled them using the **tooltipDisabled** parameter set on `true`.

```html
<ods-map>
    <ods-map-layer context="mycontext" tooltip-disabled="true"></ods-map-layer>
</ods-map>
```

If the map visualization displays multiple points or shapes that are stacked, it is possible to configure the order in which the items will be displayed in the tooltip, using `tooltipSort` and the name of a field, prefixed by `-` to have a reversed sort. Note: by default, numeric fields are sorted in decreasing order, date and datetime are sorted chronologically, and text fields are sorted alphanumerically.

```html
<ods-map>
    <!-- Reverse sort on 'field' -->
    <ods-map-layer context="mycontext" tooltip-sort="-field"></ods-map-layer>
</ods-map>
```

**Refine-on-click map configuration**

If a layer is displayed as `raw` or `aggregation`, it can be configured so that a click on an item triggers a refine on another context, using **refineOnClickContext**.

One or more contexts can be defined:

```html
<ods-map>
    <ods-map-layer context="mycontext" refine-on-click-context="mycontext2"></ods-map-layer>
    <ods-map-layer context="mycontext3" refine-on-click-context="[mycontext4, mycontext5]"></ods-map-layer>
</ods-map>
```

By default, the filter occurs on geometry. For example, clicking on a shape filters the other context on the area.

It is also possible to trigger a refine on specific fields, using **refineOnClickMapField** to configure the name of the field to get the value from, and **refineOnClickContextField** to configure the name of the field of the other context to refine on. If there are 2 or more contexts, it is possible to configure the fields by indicating the context in the name of the property, as `refineOnClick[context]MapField` and `refineOnClick[context]ContextField`.

```html
<ods-map>
    <ods-map-layer context="mycontext"
                   refine-on-click-context="[mycontext, mycontext2]"
                   refine-on-click-mycontext-map-field="field1"
                   refine-on-click-mycontext-context-field="field2"
                   refine-on-click-mycontext2-map-field="field3"
                   refine-on-click-mycontext2-context-field="field4"></ods-map-layer>
</ods-map>
```

#### Usage

as element:

```html
<ods-map-layer
       context="{DatasetContext}"
       show-if="{expression}"
       show-zoom-min="{number}"
       show-zoom-max="{number}"
       display="{string}"
       function="{string}"
       expression="{expression}"
       color="{string}"
       border-color="{string}"
       border-size="{number}"
       border-pattern="{string}"
       border-opacity="{number}"
       shape-opacity="{number}"
       point-opacity="{number}"
       line-width="{number}"
       color-categories="{objet}"
       color-categories-other="{string}"
       color-undefined="{string}"
       color-out-of-bounds="{string}"
       color-numeric-ranges="{string}"
       color-numeric-range-min="{number}"
       color-gradient="{string}"
       color-by-field="{string}"
       radius="{number}"
       size="{number}"
       size-min="{number}"
       size-max="{number}"
       size-function="{string}"
       picto="{string}"
       show-marker="{boolean}"
       tooltip-sort="{string}"
       tooltip-disabled="{boolean}"
       caption="{boolean}"
       caption-title="{string}"
       caption-picto-color="{string}"
       caption-picto-icon="{string}"
       title="{string}"
       description="{string}"
       exclude-from-refit="{boolean}"
       refine-on-click-context="{string}"
       refine-on-click-map-field="{string}"
       refine-on-click-context-field="{string}"
       refine-on-click-replace-refine="{boolean}">
</ods-map-layer>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | _(mandatory)_ Dataset Context to use |
| `showIf` | expression | AngularJS expression to evaluate: if it evaluates to true, the layer is visible. _(default: none)_ |
| `showZoomMin` | number | Makes the layer visible only if the zoom level is superior or equal to the value. _(default: none)_ |
| `showZoomMax` | number | Makes the layer visible only if the zoom level is inferior or equal to the value. _(default: none)_ |
| `display` | string | Map mode:<br>* `auto`: automatically chooses the best map mode to easily display the data, based on the number of points and type of geometry<br>* `heatmap`: displays the data as a heatmap, i.e. a density of points represented by a color intensity variation. It can also be based on the result of an aggregation function.<br>* `categories`: based on a text field value, categorizes and colors the data<br>* `choropleth`: based on a number field or aggregation, colors the data using a color scale<br>* `clusters`: spatially groups the data in clusters ; each cluster displays the number of points it contains. When at maximum zoom, all points are shown.<br>* `clustersforced`: spatially aggregates the data in clusters ; the number displayed on the cluster is the result of an aggregation function.<br>* `raw`: displays the data directly without clustering or organizing them. This mode should not be used for large datasets (i.e., datasets with more than 5,000 points to display), as it may freeze the user's browser.<br>* `aggregation`: data is aggregated based on a geo shape (e.g., 2 records with the exact same shape associated). By default, the color represents the number of aggregated records, but it can be the result of an aggregation function. This mode supports aggregating the context using a join with another context that contains geometrical shapes: use a `joinContext` property, and `localKey` and `remoteKey` to configure the field names of the local and joined datasets. It is also possible to configure one of the fields from the "remote" dataset, for them to be displayed when the mouse hovers the shapes: use `hoverField` and the name of a field to do so.<br>_(default: auto)_ |
| `function` | string | For the `heatmap`, `choropleth`, and `clusters` modes only–function used to aggregate the data:<br>* AVG: average<br>* COUNT<br>* MIN: minimum<br>* MAX: maximum<br>* STDDEV: standard deviation<br>* SUM<br>_(default: none)_ |
| `expression` | expression | Expression used to aggregate the data. This parameter is not required when the function is COUNT. _(default: none)_ |
| `color` | string | Color of the displayed shapes and markers _(default: none)_ |
| `borderColor` | string | Color of the shapes' borders _(default: white)_ |
| `borderSize` | number | The width of the shapes' borders, in pixels _(default: 1)_ |
| `borderPattern` | string | Pattern of the shapes' borders:<br>* `solid`<br>* `long-dashes`<br>* `medium-dashes`<br>* `short-dashes`<br>* `dots`<br>* `short-dot`<br>* `short-dot-dot`<br>* `medium-short`<br>_(default: solid)_ |
| `borderOpacity` | number | Opacity of the shapes' borders. The value must be between `0` (transparent) and `1` (opaque). _(default: 1)_ |
| `shapeOpacity` | number | Opacity of the shapes. The value must be between `0` (transparent) and `1` (opaque). _(default: 0.5)_ |
| `pointOpacity` | number | Opacity of the markers. The value must be between `0` (transparent) and `1` (opaque). _(default: 1)_ |
| `lineWidth` | number | The width of the lines, in pixels. Only applicable for "line" type shapes. _(default: 5)_ |
| `colorCategories` | objet | For the `categories` mode only–object that links textual values and colors (e.g., `{'Paris': '#FF0000', 'Nantes: '#00FF00'}`). _(default: none)_ |
| `colorCategoriesOther` | string | For the `categories` mode only–default color for values that were not originally taken into account by the `color-categories` object. _(default: none)_ |
| `colorUndefined` | string | For the `choropleth` mode only–default color for the `undefined` values. _(default: none)_ |
| `colorOutOfBounds` | string | For the `choropleth` mode only–default color for values out of the expected `color-numeric-ranges` scale. _(default: none)_ |
| `colorNumericRanges` | string | For the `choropleth` mode only–color scale used (e.g., `{'0': '#FF0000', '1': '#FFFF00'}`). The key is the upper bound used for this color (e.g., still using the previous example, it would be #FF0000 until 0, then #FFFF00 until 1, etc.) _(default: none)_ |
| `colorNumericRangeMin` | number | For the `choropleth` mode only–minimum bound used. Any value below that bound will be considered out of the scale, and will use the color of the `color-out-of-bounds` parameter. _(default: none)_ |
| `colorGradient` | string | For the `heatmap` mode only–object that links upper numeric bounds and colors (e.g., `{0.2: '#FF0000', 1: '#00FF00'}`) _(default: none)_ |
| `colorByField` | string | For categories and choropleth modes only - Field used to choose the color _(default: none)_ |
| `radius` | number | For the `heatmap` mode only–width of the perimeter _(default: 4)_ |
| `size` | number | For markers, 7 for pictograms–size of the markers _(default: 4)_ |
| `sizeMin` | number | For the `clusters` mode only–minimum size of the clusters _(default: 3)_ |
| `sizeMax` | number | For the `clusters` mode only–maximum size of the clusters _(default: 5)_ |
| `sizeFunction` | string | For the `clusters` mode only–calculation function of the clusters size:<br>* `linear`<br>* `log` (logarithmic)<br>_(default: none)_ |
| `picto` | string | Pictogram used for the markers _(default: none)_ |
| `showMarker` | boolean | When set to `true`, displays a marker around the pictogram. _(default: none)_ |
| `tooltipSort` | string | Identifier of the field used to sort tooltips that represent several records for the same point or shape. Note that `-` before the name of the sorting method indicates that the sorting will be descending instead of ascending. By default, numeric fields are sorted in decreasing order, date and datetime are sorted chronologically, and text fields are sorted alphanumerically. |
| `tooltipDisabled` | boolean | When set to `true`, clicking on a point or shape does not display the associated tooltip. _(default: none)_ |
| `caption` | boolean | When set to `true`, displays a caption for the map layer in the bottom right corner of the map. _(default: none)_ |
| `captionTitle` | string | Title of the map layer caption. _(default: none)_ |
| `captionPictoColor` | string | Color used for the caption's pictogram _(default: none)_ |
| `captionPictoIcon` | string | Pictogram used in the caption _(default: none)_ |
| `title` | string | Title used in the map layer's control selection _(default: none)_ |
| `description` | string | Description used in the map layer's control selection _(default: none)_ |
| `excludeFromRefit` | boolean | When set to `true`, the calculation that rezooms the map when filters or data change does not take the map layer into account. _(default: none)_ |
| `refineOnClickContext` | string | Name, or list of names separated by commas (`[ctx1, ctx2]`) of contexts that should be refined when clicking on a point or shape of the map layer. _(default: none)_ |
| `refineOnClickMapField` | string | (or `refine-on-click-CONTEXTNAME-map-field` if more than one context) - Field of the map layer that is used to retrieve the value used for the refine _(default: none)_ |
| `refineOnClickContextField` | string | (or `refine-on-click-CONTEXTNAME-context-field` if more than one context) - Field used in the context of the refine (`refine.FIELDNAME=VALUE`) _(default: none)_ |
| `refineOnClickReplaceRefine` | boolean | (or `refine-on-click-CONTEXTNAME-replace-refine` if more than one context) - When set to `true`, each click replaces the previous refine instead of adding to it. _(default: none)_ |

## odsMapLayerGroup

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsMapLayerGroup widget allows to declare a group of layers, which are declared through the odsMapLayer widget. odsMapLayerGroup is one of the map-related widgets that can only be used based on odsMap, the primary map-related widgets. For more information on odsMap, see the documentation for this widget.

#### Usage

as element:

```html
<ods-map-layer-group
       title="{string}"
       description="{string}"
       picto-color="{string}"
       picto-icon="{string}"
       displayed="{boolean}">
</ods-map-layer-group>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `title` | string | _(mandatory)_ Title of the group of layers |
| `description` | string | Description of the group of layers _(default: none)_ |
| `pictoColor` | string | Color of the pictogram for the group of layers', in the following format: `#000000` _(default: #000000)_ |
| `pictoIcon` | string | Name of pictogram for the group of layers _(default: none)_ |
| `displayed` | boolean | When set to `true`, the group of layers is displayed by default. _(default: true)_ |

## odsGeoNavigation

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsGeoNavigation widget allows to visually navigate a catalog using geographic metadata (currently, only the "Geographic coverage" metadata). The navigation is similar to `odsFacets`, but with a visual indication (map) of the current location used as a filter.

#### Usage

as element:

```html
<ods-geo-navigation
       context="{CatalogContext}"
       min-level="{number}"
       max-level="{number}"
       default-filter="{string}"
       ascending-filter="{boolean}">
</ods-geo-navigation>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | CatalogContext | Catalog context to use. |
| `minLevel` | number | Highest level available for navigation (countries are 10, other levels depend on the country) |
| `maxLevel` | number | Lowest level available for navigation (countries are 10, other levels depend on the country). If not set, the user will be able to navigate to the lowest available level. _(default: none)_ |
| `defaultFilter` | string | Path of Geographic References leading to the filter's starting point (e.g. `world/world_fr/fr_40_52`). |
| `ascendingFilter` | boolean | When set to `true`, the "Display all datasets that include current selection" (ascending filter) option will be active by default. _(default: false)_ |

## odsGeotooltip

**Module:** `ods-widgets`
**Type:** Directive

#### Description

When used to surround a text, the odsGeotooltip widget displays a tooltip showing a point and/or a shape in a map.

#### Usage

as element:

```html
<ods-geotooltip
       coords="{Array|string}"
       geojson="{Object}"
       record="{Object}"
       width="{number}"
       height="{number}"
       delay="{number}">
</ods-geotooltip>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `coords` | Array or string | Coordinates of a point to display in the tooltip; either an array of two numbers as [latitude, longitude], or a string under the form of "latitude,longitude". If you use a string, surround it with simple quotes to ensure Angular treats it as a string. If you are working with a record (e.g., using odsResultEnumerator), you can directly use the content of a `geo_point_2d` field. _(default: none)_ |
| `geojson` | Object | GeoJSON object of a shape to display in the tooltip. If you are working with a record (e.g., using odsResultEnumerator), you can directly use the content of a `geo_shape` field. _(default: none)_ |
| `record` | Object | A record object (e.g., from odsResultEnumerator) from which the geometry will be taken (this is the `geometry` property of the record) _(default: none)_ |
| `width` | number | Width of the tooltip, in pixels _(default: 200)_ |
| `height` | number | Height of the tooltip, in pixels _(default: 200)_ |
| `delay` | number | Delay before the tooltip appears on hover, in milliseconds _(default: 500)_ |
