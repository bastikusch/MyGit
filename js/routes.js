
// function that reads inputs in menu and calls simulation in dynamics.js
// update gets called via the run button in the simulation tab of the app.

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

    // create line template
    var lineTemplate = lineSeries.mapLines.template;
    lineTemplate.nonScalingStroke = true;
    lineTemplate.stroke = interfaceColors.getFor("alternativeBackground");
    lineTemplate.fill = interfaceColors.getFor("alternativeBackground");
    lineTemplate.line.strokeOpacity = 1;
    lineTemplate.line.strokeWidth = 0.7;
    lineTemplate.line.controlPointDistance = 0.2;

    // Whole block are inputs from the menu, that get passed to the functions that calculate dynamic
    // var n = parseFloat(document.getElementById("individuals").value);
    var start_lat = parseFloat(document.getElementById("lat").value);
    var start_long = parseFloat(document.getElementById("long").value);
    var ver = document.getElementById("strategy").value;
    var sysnr = parseFloat(document.getElementById("system").value);
    var magnet = parseFloat(document.getElementById("magnet").value);
    var wind = [parseFloat(document.getElementById("incl").value)];
    wind[1] = parseFloat(document.getElementById("u").value);
    wind[2] = parseFloat(document.getElementById("v").value);
    var maxdays = parseFloat(document.getElementById("maxdays").value);
    var h1 = document.getElementById("h1").value;
    var h2 = document.getElementById("h2").value;
    var h3 = document.getElementById("h3").value;
    var h4 = document.getElementById("h4").value;
    var initHeading_arr = [h1, h2, h3, h4];

    // perform exemplary routes, if personalized parameters are hidden.
    if (!document.getElementById("grey").hidden) {
        sysnr = 7;
    }

    // Randomwalk is called with concrete exemplary inputs, can be switched out at some time
    if (ver == 0) {
        route = randomwalk([start_lat, start_long], 4, 100, 0.5);
    } else {
        route = migration(sysnr, magnet, wind, maxdays, initHeading_arr, start_long, start_lat);
    }

    // Connecting output of dynamics to the data that gets drawn on map
    lineSeries.data = [{
        "multiGeoLine": route
    }];

    // creating lines
    var line = lineSeries.mapLines.create();
}

// function to clear routes (clears all drawn lines as of now)
function clear_all() {
    while (chart.series.length > 2) {
        chart.series.removeIndex(2).dispose();
    }
}

// Function to draw examplary bird data: As of now no Data available
function birdData(){

    var lineSeries = chart.series.push(new am4maps.MapLineSeries());
    lineSeries.dataFields.multiGeoLine = "multiGeoLine";
    lineSeries.mapLines.template.stroke = am4core.color("#e03e96");
    var datafile = document.getElementById("birddata").value;
    var route = [{"latitude": -90, "longitude": -180}];

    if (datafile == 0) {
        var pathToFile = "data/birddata/route1.csv";
    } else if (datafile == 1) {
        var pathToFile = "data/birddata/route1.csv";
    } else {
        var pathToFile = "data/birddata/route1.csv";
    }
    AmCharts.loadFile( pathToFile, {}, function( response ) {

        var d = AmCharts.parseCSV(response, {
            "separator": ",",
            "useColumnNames": true,
            "numberFields": ["value"]
        });
        for (var i = 0, len = d.length; i < len; i++) {
            route.push({
                latitude: +d[i].latitude,
                longitude: +d[i].longitude
            });
        }

        lineSeries.data = [{
            "multiGeoLine": [route]
        }];

        lineSeries.mapLines.create();
    });
}


// History of magnetic field iclusion trials, none have shown potential yet.........................................

// problem is the drawing of isoclines did not work:
// 1. closed circles are a problem
// 2. Isolation of isoclines is not easy
// 3. no good way of seperating lines of same isocline value
function magnet_draw(){

    var lineSeries = chart.series.push(new am4maps.MapLineSeries());
    lineSeries.dataFields.multiGeoLine = "multiGeoLine";
    var declination = [{"latitude": -90, "longitude": -180}];

    AmCharts.loadFile( "data/csvfiles/Declination.csv", {}, function( response ) {

        var d = AmCharts.parseCSV(response, {
            "separator": ",",
            "useColumnNames": true,
            "numberFields": ["value"]
        });

        for (var i = 0, len = d.length; i < len; i++) {
            if (+d[i].error == 0.4){
                declination.push({
                    latitude: +d[i].latitude,
                    longitude: +d[i].longitude
                });
            }

        }

        lineSeries.data = [{
            "multiGeoLine": [declination]
        }];

        lineSeries.mapLines.create();

    });
}

// Magnet point method: draws litle circles at long/lat coordinates at isoclines
// Problems:
// 1. Not feasible regarding runtime and aesthetics
// 2. calculation is ineffizient
function magnet(){
    var circleSeries = chart.series.push(new am4maps.MapPolygonSeries())
    var circleTemplate = circleSeries.mapPolygons.template;
    circleTemplate.fill = am4core.color("black");
    circleTemplate.strokeOpacity = 0;
    circleTemplate.fillOpacity = 1;
    circleTemplate.nonScalingStroke = true;


    AmCharts.loadFile( "data/csvfiles/Declination.csv", {}, function( response ) {

        var d = AmCharts.parseCSV(response, {
            "separator": ",",
            "useColumnNames": true,
            "numberFields": ["value"]
        });
        for (var i = 0, len = d.length; i < len; i = i + 3) {
            if (+d[i].val == 0.4) {
                var polygon = circleSeries.mapPolygons.create();
                polygon.multiPolygon = am4maps.getCircle(+d[i].latitude, +d[i].longitude, 1);
            }
        }
    });
}

// Tried to create contour plot that lays over map (no real magentic data in x,y,z calcs in function yet)
// Problems:
// 1. Not scalable and adjustable to projection and zoom
// 2. Looks not good
function magnet_contour(){
    var size = 100, x = new Array(size), y = new Array(size), z = new Array(size), i, j;

    for(var i = 0; i < size; i++) {
        x[i] = y[i] = -2 * Math.PI + 4 * Math.PI * i / size;
        z[i] = new Array(size);
    }

    for(var i = 0; i < size; i++) {
        for(j = 0; j < size; j++) {
            var r2 = x[i]*x[i] + y[j]*y[j];
            z[i][j] = Math.sin(x[i]) * Math.cos(y[j]) * Math.sin(r2) / Math.log(r2+1);
        }
    }

    var data = [ {
        z: z,
        x: x,
        y: y,
        type: 'contour'
    }
    ];

    var layout = {
        autosize: true,
    };
    Plotly.newPlot('magnetfield', data, layout, {displayModeBar: false});
}

// Fazit:
// None of the tried inclusion of the earth magnetic field worked. My recommendation, try to isolate the isoclines and
// seperate from closed curves within.







