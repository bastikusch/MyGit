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
chart.exporting.menu.container = document.getElementById("Data");
chart.exporting.menu.align = "right";
chart.exporting.menu.verticalAlign = "bottom";

// open simulation tab by default
document.getElementById("defaultOpen").click();
// hide personalized parameter inputs for simulation
document.getElementById("grey").hidden = true;

// get start coordinates onclick..................................................................................

chart.seriesContainer.events.on("hit", function (ev) {
    document.getElementById("lat").value = chart.svgPointToGeo(ev.svgPoint).latitude.toFixed(0);
    document.getElementById("long").value = chart.svgPointToGeo(ev.svgPoint).longitude.toFixed(0);
    marker.latitude = parseFloat(document.getElementById("lat").value);
    marker.longitude = parseFloat(document.getElementById("long").value);
});

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function greyOut() {
    document.getElementById("grey").hidden = !document.getElementById("grey").hidden;
}





















