// Add projection bar..................................................................................

// container for projections
let linkContainer = chart.createChild(am4core.Container);
linkContainer.isMeasured = false;
linkContainer.layout = "horizontal";
linkContainer.x = am4core.percent(50);
linkContainer.y = am4core.percent(95);
linkContainer.horizontalCenter = "middle";

// equiretangular, mercator and orthographic projections
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

// home button and exporting menu..................................................................................

// Create small map to help navigate + function to hide
// chart.smallMap = new am4maps.SmallMap();
// chart.smallMap.series.push(polygonSeries);

// Set home button and export menu
var button = chart.chartContainer.createChild(am4core.Button);
button.label.text = "Reset";
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

// get start coordinates onclick..................................................................................

chart.seriesContainer.events.on("hit", function (ev) {
    document.getElementById("lat").value = chart.svgPointToGeo(ev.svgPoint).latitude.toFixed(0);
    document.getElementById("long").value = chart.svgPointToGeo(ev.svgPoint).longitude.toFixed(0);
    marker.latitude = parseFloat(document.getElementById("lat").value);
    marker.longitude = parseFloat(document.getElementById("long").value);
});