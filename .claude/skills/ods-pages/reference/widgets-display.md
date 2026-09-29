# Value and media display

Parameter names below are camelCase, as AngularJS normalises them internally.
In your HTML write them kebab-case: `chartType` is `chart-type=""`,
`expressionY` is `expression-y=""`, `refineOnClickContext` is
`refine-on-click-context=""`.

Check each widget's Usage block for whether it is an element (`<ods-chart>`)
or an attribute (`<div ods-aggregation="n">`). Using an attribute directive as
an element renders nothing and reports no error.

## odsGauge

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsGauge widget displays a gauge in one of the two following modes: circle or horizontal bar. The widget relies on CSS3 and SVG. As a result, it is entirely customizable in CSS.

The widget will decide its size based on its width, so you can make it larger or smaller using the CSS `width` property; however, the widget will always take the necessary height, so forcing the height using CSS won't work. Values exceeding the given max will be represented as a full gauge, whereas values lower than 0 will be represented as an empty gauge.

#### Usage

as element:

```html
<ods-gauge
       display-mode="{string}"
       max="{float}"
       value="{float}">
</ods-gauge>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `displayMode` | string | Type of chart: 'circle' or 'bar' _(default: circle)_ |
| `max` | float | The maximum value for the gauge _(default: 100)_ |
| `value` | float | A number between 0 and the defined `max` value |

## odsPicto

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsPicto widget displays a pictogram specified by a URL or the ID of a SVG to duplicate from the same page, and forces a fill color on it. This element can be styled (height, width, etc.), especially if the pictogram is vectorial (SVG).

Either the `url` or `localId` attributes have to be used.

In the case of `localId`, the recommended use is to include the code of the SVG inside your HTML document, with a `display: none` style attribute at the root, on the `svg` node. This inlined SVG will be duplicated, the `display: none` removed, and this new duplicated and colored SVG will be inserted in place of the odsPicto element.

All parameters expect javascript variables or literals. If you want to provide hardcoded strings, you'll have to wrap them in quotes, as shown in the following example.

#### Usage

as element:

```html
<ods-picto
       url="{string}"
       local-id="{string}"
       color="{string}"
       color-by-attribute="{Object}"
       classes="{string}">
</ods-picto>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `url` | string | The URL of the SVG or image to display |
| `localId` | string | The ID of the SVG to use in the current page |
| `color` | string | The color to use to fill the SVG |
| `colorByAttribute` | Object | An object containing a mapping between elements within the SVG, and colors. The elements within the SVG with a matching `data-fill-id` attribute take the corresponding color. |
| `classes` | string | The classes to directly apply to the SVG element |

## odsThemePicto

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsThemePicto widget displays the pictogram of a theme based on the `themes` setting in ODSWidgetsConfig. This element can be styled (height, width, etc.), especially if the pictogram is vectorial (SVG).

#### Usage

as element:

```html
<ods-theme-picto
       theme="{string}">
</ods-theme-picto>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `theme` | string | The label of the theme to display the pictogram of |

## odsMediaGallery

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsMediaGallery widget displays an image gallery of a dataset containing media with thumbnails (images, PDF files, etc.) with infinite scroll. You can use the Widget Tooltip directive to customize the detail view appearing when selecting a thumbnail.

#### Usage

as element:

```html
<ods-media-gallery
       context="{DatasetContext}"
       displayed-fields="{string}"
       image-fields="{string}"
       [ods-widget-tooltip]="{string}"
       [ods-auto-resize]="{boolean}"
       [refine-on-click]="{boolean}">
</ods-media-gallery>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | Dataset Context to use |
| `displayedFields` | string | A comma-separated list of fields to display in the details for each thumbnail. If no value is specified, the options configured for the dataset are used or all fields if nothing configured. _(default: all)_ |
| `imageFields` | string | A comma-separated list of fields to display in the gallery as thumbnails. If no value is specified, the options configured for the dataset are used or all media fields if nothing is configured. _(default: all)_ |
| `odsWidgetTooltip` | string, optional | For more information, see Widget Tooltip. |
| `odsAutoResize` | boolean, optional | For more information, see Auto Resize. |
| `refineOnClick` | boolean, optional | For more information, see Refine on click. This option takes precedence over the widget tooltip. |

## odsSlideshow

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsSlideshow widget displays an image slideshow of a dataset containing media with thumbnails (images, PDF files, etc.).

You will need to set a height for the `.ods-slideshow` class to work correctly or set the height through the style attribute. You can also include a tooltip to access the image's record through the `record` variable.

#### Usage

as element:

```html
<ods-slideshow
       context="{DatasetContext}"
       image-field="{string}"
       [title-fields]="{string}"
       [domain-url]="{string}">
</ods-slideshow>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | Dataset Context to use |
| `imageField` | string | The name of the field containing the image |
| `titleFields` | string, optional | A comma-separated list of field names to display as comma-separated values in the title |
| `domainUrl` | string, optional | The URL of the domain |

## odsRecordImage

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsRecordImage widget displays an image from a record.

#### Usage

as element:

```html
<ods-record-image
       context="{DatasetContext}"
       record="{Object}"
       field="{string}"
       domain-url="{string}">
</ods-record-image>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `context` | DatasetContext | Dataset Context to use |
| `record` | Object | Record to take the image from |
| `field` | string | _(mandatory)_ Field to use. |
| `domainUrl` | string | The base URL of the domain where the dataset can be found. By default, the current domain is used. _(default: none)_ |

## odsGist

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsGist widget integrates a GitHub Gist widget with a "copy to clipboard" button into a page.

#### Usage

as element:

```html
<ods-gist
       username="{string}"
       gist-id="{string}">
</ods-gist>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `username` | string | The GitHub username |
| `gist-id` | string | The Gist identifier. See the Gist URL to find it. |

## odsSocialButtons

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsSocialButtons widget displays a series of buttons for easy sharing on social media.

#### Usage

as attribute

```html
<ANY ods-social-buttons
     buttons="{string}"
     title="{string}"
     url="{string}">
   ...
</ANY>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `buttons` | string | A comma-separated list of buttons you want to display _(default: 'twitter,facebook,linkedin,email')_ |
| `title` | string | Title of the post on social media _(default: current page's title)_ |
| `url` | string | URL attached to the post on social media _(default: current page's url)_ |

## odsDisqus

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsDisqus widget shows a Disqus panel where users can comment on the page.

#### Usage

as element:

```html
<ods-disqus
       shortname="{string}"
       identifier="{string}">
</ods-disqus>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `shortname` | string | Disqus short name for your account. If not specified, ODSWidgetsConfig.disqusShortname will be used. |
| `identifier` | string | By default, the discussion is tied to the URL of the page. If you want to be independent from the URL or share the discussion between two or more pages, you can define an identifier in this parameter. Disqus recommends always doing this from the start. _(default: none)_ |

## odsHubspotForm

**Module:** `ods-widgets`
**Type:** Directive

#### Description

The odsHubspotForm widget integrates a HubSpot form given a portal ID and the form ID.

#### Usage

as element:

```html
<ods-hubspot-form
       portal-id="{string}"
       form-id="{string}">
</ods-hubspot-form>
```

#### Directive info

  * This directive creates new scope.

#### Parameters

| Parameter | Type | Details |
|---|---|---|
| `portalId` | string | The portal ID |
| `formId` | string | The form ID |
