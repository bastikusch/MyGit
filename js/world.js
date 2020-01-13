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
chart.zoomControl.slider.height = 80;

// Set initial zoom
chart.homeZoomLevel = 1.0;
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
hs.properties.fill = am4core.color("grey");

let linkContainer = chart.createChild(am4core.Container);
linkContainer.isMeasured = false;
linkContainer.layout = "horizontal";
linkContainer.x = am4core.percent(50);
linkContainer.y = am4core.percent(95);
linkContainer.horizontalCenter = "middle";

let equirectangular= linkContainer.createChild(am4core.TextLink);
equirectangular.margin(10,10,10,10);
equirectangular.text = "Equirectangular";
equirectangular.fill = "black";
equirectangular.events.on("hit", function(){
    chart.projection = new am4maps.projections.Projection();
    chart.panBehavior = "move";
})

let mercator = linkContainer.createChild(am4core.TextLink);
mercator.text = "Mercator";
mercator.fill = "black";
mercator.margin(10,10,10,10);
mercator.events.on("hit", function(){
    chart.projection = new am4maps.projections.Mercator();
    chart.panBehavior = "move";
})

let orthographic = linkContainer.createChild(am4core.TextLink);
orthographic.margin(10,10,10,10);
orthographic.text = "Orthographic";
orthographic.fill = "black";
orthographic.events.on("hit", function(){
    chart.projection = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
})

// Create small map to help navigate
chart.smallMap = new am4maps.SmallMap();
chart.smallMap.series.push(polygonSeries);

// Set home button and export menu
var button = chart.chartContainer.createChild(am4core.Button);
button.label.text = "Home";
button.padding(5, 5, 5, 5);
button.width = 60;
button.align = "right";
button.marginRight = 15;
button.events.on("hit", function () {
    chart.goHome();
});

chart.exporting.menu = new am4core.ExportMenu();
chart.exporting.menu.container = document.getElementById("menu");
chart.exporting.menu.align = "right";
chart.exporting.menu.verticalAlign = "bottom";

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

// get start coordinates onclick
chart.seriesContainer.events.on("hit", function (ev) {
    document.getElementById("lat").value = chart.svgPointToGeo(ev.svgPoint).latitude.toFixed(2);
    document.getElementById("long").value = chart.svgPointToGeo(ev.svgPoint).longitude.toFixed(2);
    marker.latitude = parseFloat(document.getElementById("lat").value);
    marker.longitude = parseFloat(document.getElementById("long").value);
});

// var container = am4core.create("container", am4core.Container);
// container.width = am4core.percent(1000);
// container.height = am4core.percent(1000);
//
// // Create a container child
// var rect = container.createChild(am4core.Rectangle);
// rect.width = 100;
// rect.height = 100;
// rect.fill = am4core.color("red");


