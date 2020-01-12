function update() {

    //choose interpolation method
    var ip = document.getElementById("interpolation").value;
    if (ip == 0) {
        var lineSeries = chart.series.push(new am4maps.MapLineSeries());
    } else if (ip == 1) {
        var lineSeries = chart.series.push(new am4maps.MapSplineSeries());
    } else {
        var lineSeries = chart.series.push(new am4maps.MapArcSeries());
    }
    lineSeries.dataFields.multiGeoLine = "multiGeoLine";

    var lineTemplate = lineSeries.mapLines.template;
    lineTemplate.nonScalingStroke = true;
    lineTemplate.stroke = interfaceColors.getFor("alternativeBackground");//"#" + ((1 << 24) * Math.random() | 0).toString(16);
    lineTemplate.fill = interfaceColors.getFor("alternativeBackground");
    lineTemplate.line.strokeOpacity = 1;
    lineTemplate.line.strokeWidth = 0.5;
    //lineTemplate.line.controlPointDistance = 0.2;

    var n = parseFloat(document.getElementById("individuals").value);
    var gen = parseFloat(document.getElementById("route_length").value);
    var path_length = parseFloat(document.getElementById("incr_length").value);
    var start_lat = parseFloat(document.getElementById("lat").value);
    var start_long = parseFloat(document.getElementById("long").value);
    var start = [start_lat, start_long];
    var ver = document.getElementById("strategy").value;
    var sysnr = parseFloat(document.getElementById("system").value);
    var magnet = parseFloat(document.getElementById("magnet").value);
    var wind = [parseFloat(document.getElementById("incl").value)];
    wind[1] = parseFloat(document.getElementById("u").value);
    wind[2] = parseFloat(document.getElementById("v").value);
    var maxdays = parseFloat(document.getElementById("maxdays").value);

    if (ver == 0) {
        route = randomwalk(start, n, gen, path_length);
    } else {
        route = migration(sysnr, magnet, wind, maxdays);
    }
    // route = sun(start,n,gen,path_length);
    console.log(route.filter((el) => el === null || el === undefined).length)
    // console.log(route.filter((el) => el.filter((el2) => el2=== null || el2 === undefined).length).reduce((agg, v) => agg + v))
    console.log(route)
    lineSeries.data = [{
        "multiGeoLine": route
    }];

    var line = lineSeries.mapLines.create();
}

// function to clear routes
function clear_all() {
    while (chart.series.length > 2) {
        chart.series.removeIndex(2).dispose();
    }
}







