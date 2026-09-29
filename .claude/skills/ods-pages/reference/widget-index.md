# ODS widget index

Every widget, with the form it takes and the family file holding its
full parameters. Using an attribute directive as an element renders
nothing and logs nothing, so check the Form column before writing.

| Widget | Form | Purpose | Family file |
|---|---|---|---|
| `odsAdvAnalysis` | attribute | The odsAdvAnalysis widget exposes the results of an aggregation function over a context. | `widgets-aggregation.md` |
| `odsAdvTable` | element | The odsAdvTable widget is used to analyze data from a table perspective. | `widgets-table.md` |
| `odsAggregation` | attribute | The odsAggregation widget creates a variable that contains the result of an aggregation function based on a context. | `widgets-aggregation.md` |
| `odsAnalysis` | attribute | The odsAnalysis widget creates a variable that contains the result of an analysis (i.e., an object containing a results array and optionally an aggregations object). | `widgets-aggregation.md` |
| `odsAutoResize` | attribute | The odsAutoResize widget enables the auto-resize functionality on a widget that supports it. | `widgets-layout.md` |
| `odsCalendar` | element | The odsCalendar widget can take any dataset containing at least two datetime fields and a text field and use it to display a calendar. | `widgets-table.md` |
| `odsCatalogContext` | element or attribute | The odsCatalogContext widget represents the entire catalog of datasets of a chosen domain and a set of parameters used to query this catalog. | `widgets-context.md` |
| `odsChart` | element | The odsChart widget is the base widget allowing to display charts from Huwise datasets. | `widgets-chart.md` |
| `odsChartQuery` | element | The odsChartQuery widget is the sub widget that defines the queries for the series defined inside. | `widgets-chart.md` |
| `odsChartSerie` | element | The odsChartSerie widget is the sub widget that defines a series in the chart with all its parameters. | `widgets-chart.md` |
| `odsClearAllFilters` | element | The odsClearAllFilters widget displays a button that will clear all active filters in the given context. | `widgets-filter.md` |
| `odsColorGradient` | attribute | The odsColorGradient widget exposes the results of an analysis transposed to a set of colors for each X value. | `widgets-chart.md` |
| `odsCrossTable` | element | The odsCrossTable widget creates a cross table from a context. | `widgets-table.md` |
| `odsDatasetContext` | element or attribute | The odsDatasetContext widget represents a dataset from a chosen domain and a set of parameters used to query its data. | `widgets-context.md` |
| `odsDatasetSchema` | element | The odsDatasetSchema widget displays a table describing the schema of a dataset. | `widgets-context.md` |
| `odsDateRangeSlider` | element | The odsDateRangeSlider widget displays a range slider to select the two bounds of a date range. | `widgets-filter.md` |
| `odsDatetime` | attribute | The odsDatetime widget gets the ISO local datetime and stores it into a variable (into the scope). | `widgets-context.md` |
| `odsDisqus` | element | The odsDisqus widget shows a Disqus panel where users can comment on the page. | `widgets-display.md` |
| `odsDomainStatistics` | element or attribute | The odsDomainStatistics widget enumerates statistic values for a given catalog and injects them as variables in the context. | `widgets-aggregation.md` |
| `odsFacetResults` | attribute | The odsFacetResults widget fetches the results of enumerating the values ("categories") of a facet and exposes it in a variable available in the scope. | `widgets-aggregation.md` |
| `odsFacets` | element | The odsFacets widget displays filters based on a dataset or a domain's catalog of datasets. | `widgets-filter.md` |
| `odsFilterSummary` | element | The odsFilterSummary widget displays a summary of all the active filters in a context: text search, refinements, etc. | `widgets-filter.md` |
| `odsGauge` | element | The odsGauge widget displays a gauge in one of the two following modes: circle or horizontal bar. | `widgets-display.md` |
| `odsGeoNavigation` | element | The odsGeoNavigation widget allows to visually navigate a catalog using geographic metadata (currently, only the "Geographic coverage" metadata). | `widgets-map.md` |
| `odsGeotooltip` | element | When used to surround a text, the odsGeotooltip widget displays a tooltip showing a point and/or a shape in a map. | `widgets-map.md` |
| `odsGetElementLayout` | attribute | The odsGetElementLayout widget gets the height and width of an element. | `widgets-layout.md` |
| `odsGetWindowLayout` | attribute | The odsGetElementLayout widget gets the height and width of the window. | `widgets-layout.md` |
| `odsGist` | element | The odsGist widget integrates a GitHub Gist widget with a "copy to clipboard" button into a page. | `widgets-display.md` |
| `odsHubspotForm` | element | The odsHubspotForm widget integrates a HubSpot form given a portal ID and the form ID. | `widgets-display.md` |
| `odsInfiniteScrollResults` | attribute | The odsInfiniteScrollResults widget displays the results of a query inside an infinite scroll list. | `widgets-table.md` |
| `odsLastDatasetsFeed` | element | The odsLastDatasetsFeed widget displays the last datasets of a catalog based on the _modified_ metadata. | `widgets-catalog.md` |
| `odsLastReusesFeed` | element | This widget displays the last five reuses published on a domain. | `widgets-catalog.md` |
| `odsLegend` | element | The odsLegend widget displays a map legend computed with the color gradient structure from the odsColorGradient widget. | `widgets-chart.md` |
| `odsMap` | element | The odsMap widget allows to build a map visualization and display data through various modes that can be composed of several dynamic layers, each being based on a Dataset Context. | `widgets-map.md` |
| `odsMapLayer` | element | The odsMapLayer widget allows to declare the data layers that can be displayed on a map visualization. | `widgets-map.md` |
| `odsMapLayerGroup` | element | The odsMapLayerGroup widget allows to declare a group of layers, which are declared through the odsMapLayer widget. | `widgets-map.md` |
| `odsMediaGallery` | element | The odsMediaGallery widget displays an image gallery of a dataset containing media with thumbnails (images, PDF files, etc.) with infinite scroll. | `widgets-display.md` |
| `odsMostPopularDatasets` | element | The odsMostPopularDatasets widget displays the top datasets of a catalog based on the number of downloads. | `widgets-catalog.md` |
| `odsMostUsedThemes` | element | The odsMostUsedThemes widget displays the five most used themes. | `widgets-catalog.md` |
| `odsPageRefresh` | element or attribute | The odsPageRefresh widget can be used to periodically refresh the page. | `widgets-context.md` |
| `odsPaginationBlock` | element | The odsPaginationBlock widget displays a pagination control that you can use to make the context "scroll" through a list of results. | `widgets-table.md` |
| `odsPicto` | element | The odsPicto widget displays a pictogram specified by a URL or the ID of a SVG to duplicate from the same page, and forces a fill color on it. | `widgets-display.md` |
| `odsPopIn` | element | The odsPopIn widget displays a pop-in on the page with the provided content. | `widgets-layout.md` |
| `odsRecordImage` | element | The odsRecordImage widget displays an image from a record. | `widgets-display.md` |
| `odsResultEnumerator` | element | The odsResultEnumerator widget enumerates the search results (records for a Dataset Context, datasets for a Catalog Context). | `widgets-table.md` |
| `odsResults` | attribute | The odsResults widget exposes the results of a search as an array in a variable available in the scope. | `widgets-table.md` |
| `odsReuses` | element | The odsReuses widget displays all reuses published on a domain in an infinite list of large boxes, presenting reuses in a clear display. | `widgets-catalog.md` |
| `odsSearchbox` | element | The odsSearchbox widget displays a wide search box that redirects the search on the Explore homepage of the domain. | `widgets-filter.md` |
| `odsSelect` | element | The odsSelect widget shows a list of options from which users can select one or more options. | `widgets-filter.md` |
| `odsSimpleTab` | element |  | `widgets-layout.md` |
| `odsSimpleTabs` | element | The odsSimpleTabs widget generates a tabbed interface that allows you to switch between separate views. | `widgets-layout.md` |
| `odsSlideshow` | element | The odsSlideshow widget displays an image slideshow of a dataset containing media with thumbnails (images, PDF files, etc.). | `widgets-display.md` |
| `odsSocialButtons` | attribute | The odsSocialButtons widget displays a series of buttons for easy sharing on social media. | `widgets-display.md` |
| `odsSpinner` | element | The odsSpinner widget displays the custom Opendatasoft spinner. | `widgets-layout.md` |
| `odsSubaggregation` | attribute | The odsSubaggregation widget computes aggregations on an analysis result. | `widgets-aggregation.md` |
| `odsTable` | element | The odsTable widget displays a table view of a dataset, with infinite scroll and an ability to sort columns depending on the column types. | `widgets-table.md` |
| `odsTagCloud` | element | The odsTagCloud widget displays a "tag cloud" of the values available in a facet. | `widgets-filter.md` |
| `odsTextSearch` | element | The odsTextSearch widget displays a search box to perform a full-text search in a context. | `widgets-filter.md` |
| `odsThemeBoxes` | element | The odsThemeBoxes widget enumerates the themes available on the domain by showing their pictograms and the number of datasets they contain. | `widgets-catalog.md` |
| `odsThemePicto` | element | The odsThemePicto widget displays the pictogram of a theme based on the `themes` setting in ODSWidgetsConfig. | `widgets-display.md` |
| `odsTimer` | element | The odsTimer widget is a simple timer. | `widgets-context.md` |
| `odsTimerange` | element | The odsTimerange widget displays two fields to select the two bounds of a date and time range. | `widgets-filter.md` |
| `odsTimescale` | element | The odsTimescale widget displays a control to select: | `widgets-chart.md` |
| `odsToggleModel` | attribute | The odsToggleModel widget, when used on a checkbox, allows the checkbox to be used to "toggle" a value in an object. | `widgets-context.md` |
| `odsTopPublishers` | element | The odsTopPublishers widget displays the five top publishers. | `widgets-catalog.md` |
| `odsWidgetTooltip` | attribute | The odsWidgetTooltip widget is a helper for displaying custom tooltips. | `widgets-layout.md` |
| `refineOnClick` | attribute | The refineOnClick directive will refine the given context(s) for a click on an element representing a record. | `widgets-filter.md` |
