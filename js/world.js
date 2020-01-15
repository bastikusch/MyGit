// Create world map.....................................................................................

// Initalize Theme
am4core.useTheme(am4themes_animated);

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);
var interfaceColors = new am4core.InterfaceColorSet();

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Mercator();

// Add zoom control
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

// Create map polygon series (countries)
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.exclude = ["AQ"];
polygonSeries.useGeodata = true;

// create template for polygons
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("sandybrown");

// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("darkred");

// create image at start point
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

var marker = imageSeries.mapImages.create();
marker.latitude = parseFloat(document.getElementById("lat").value);
marker.longitude = parseFloat(document.getElementById("long").value);


// create magnetfield
// var magnetfield = document.getElementById("magnetfield");
// var ctx = magnetfield.getContext("2d");
// var grd = ctx.createLinearGradient(0, 0, 300, 0);
// grd.addColorStop(0, "red");
// grd.addColorStop(1, "blue");
// ctx.fillStyle = grd;
// ctx.globalAlpha = 0;
// ctx.fillRect(0, 0, 1000, 1000);

// function showMagnet(){
//     if (ctx.globalAlpha == 0) {
//         ctx.globalAlpha = 0.5;
//     }
//     else {
//         ctx.globalAlpha = 0;
//     }
// }


