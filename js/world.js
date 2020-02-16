
// Javascript file to generate the world shown in the map of the app. Framework is amcharts.

// Initalize Theme
am4core.useTheme(am4themes_animated);

// Create instanciated map of map class in container "chartdiv" (see in html file)
var chart = am4core.create("chartdiv", am4maps.MapChart);
var interfaceColors = new am4core.InterfaceColorSet();

// Set map definition (resolution low right now)
chart.geodata = am4geodata_worldLow;

// Set primary projection (chose mercator, but could be changed)
chart.projection = new am4maps.projections.Mercator();

// Add zoom control bar on the right side
chart.zoomControl = new am4maps.ZoomControl();
chart.zoomControl.slider.height = 60;

// Set initial zoom and center of map
chart.homeZoomLevel = 1.3;
chart.homeGeoPoint = {
    latitude: 30,
    longitude: 8
};

// Set map background (ocean)
chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#aadaff");
chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.5;

// Create map polygon series (countries) (Excluded arctic regions)
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.exclude = ["AQ"];
polygonSeries.useGeodata = true;

// create template for country polygons
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("sandybrown");

// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("darkred");

// create image at starting latitude/longitude point
var imageSeries = chart.series.push(new am4maps.MapImageSeries());
var mapImage = imageSeries.mapImages.template;
var mapMarker = mapImage.createChild(am4core.Sprite);
mapMarker.path = "M4 12 A12 12 0 0 1 28 12 C28 20, 16 32, 16 32 C16 32, 4 20 4 12 M11 12 A5 5 0 0 0 21 12 A5 5 0 0 0 11 12 Z";
mapMarker.width = 20;
mapMarker.height = 20;
mapMarker.scale = 0.3;
mapMarker.fill = am4core.color("black");
mapMarker.fillOpacity = 1;
mapMarker.horizontalCenter = "middle";
mapMarker.verticalCenter = "bottom";

// set marker at the long/lat point, defined by click at map
var marker = imageSeries.mapImages.create();
marker.latitude = parseFloat(document.getElementById("lat").value);
marker.longitude = parseFloat(document.getElementById("long").value);

// get start coordinates onclick
chart.seriesContainer.events.on("hit", function (ev) {
    document.getElementById("lat").value = chart.svgPointToGeo(ev.svgPoint).latitude.toFixed(0);
    document.getElementById("long").value = chart.svgPointToGeo(ev.svgPoint).longitude.toFixed(0);
    marker.latitude = parseFloat(document.getElementById("lat").value);
    marker.longitude = parseFloat(document.getElementById("long").value);
});




