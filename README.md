# Tasklist


- [x] Implement Tab Bar menu 
- [x] Add report window, that gives feedback/statistics to the simulation runs: _not yet filled with data though._
- [x] Add existing bird data to visuaisation: _Function is written, waiting for data_
- [x] Write github documentation for the birdmigration app
- [x] Comment code

__Failed:__ Add extended/adjusted magnetic field, maybe with overlay in app: _did not work within framework/dataset yet._



## Documentation of birdmigration app

### Introduction:
This is a first sketch of a web app, whose purpose is to visualize birdmigration based on magnetic orientation. The used models and functionalities are kept very simple and are subject to change.
The following lines are meant to give a short explanation of functions as of right now (February 2020).

### Structure:
The basic structure is divided into 4 different functionality tabs, "Simulation", "Stats", "Data" and "Environment":
Not all are filled with the same amount and detail of information as desired at a future point in time, but it's a first try to think about the general possibilities of functionality.

#### Simulation:
The Simulation part handels the main calculations and visualizations, the app offers right now.
Selecting one of the six examplary routes vai the "Route" dropdown offers a quick way to show a simulation of the referred general route.
The input box "Maximal Flight Duration" lets one control the length of simulated bird migrations.
"Compass Type" defines the compass type that is used for the simulation. This is extendable if desired in the future, but as of now the decision is between a megnetoclinic and an inclination gradient shifted compass, the birds use.
"Interpolation type" should be selfexplanatory. Be careful, if (future more complex) simulation outputs are hard to perform spline interpolation on, the app gets an error.
The Buttons "Run" and "Clear" run and plot a simulation and clear the plot respectively.
The checkbox "Personalized Simulation Parameters" opens new options to personalize the simulation input.
"Strategy" lets you decide between the general migration simulation and an examplary random walk like simulation. This is one interaface, where future models, that differ from the used one could get included. Important for future models is to check and assimilate the model output typewise to the already working models.

```javascript
var lineSeries = chart.series.push(new am4maps.MapLineSeries());
lineSeries.data = [{
  "multiGeoLine": [
    [
      { "latitude": 48.856614, "longitude": 2.352222 },
      { "latitude": 40.712775, "longitude": -74.005973 },
      { "latitude": 49.282729, "longitude": -123.120738 }
    ]
  ]
  }];
```

Further controllable parameters via the extended parameter mode are "Start Latitude" and "Start Longitude", who are not only adjustable via input, but also by clicking on the map (marked by little black marker).
"Headings" define the inital headings of the birds at the starting point in degree. Right now it's defined by an array of length: 4, that results in an output of 4 trajectories (can be changed at some future point).
The "Wind" input boxes include wind of some inclination and velocity in longitudinal/latidudinal direction (u,v) into the simulation. 


#### Stats:
This tab has no real functionality right now. 
The "Report" button opens a new window, to show details and statistics about the performed simulation at some point in the future maybe. But right now it just writes a line to see what it could do some day.


#### Data:
This tab plots the examplary trajectories of real bird data. The functions are implemented, the data is not available yet, though.


#### Environment:
This tab plans to include some environmetal, external visual Informations, like magnetic field, temperature, sun time ...
Unfortunately the inclusion of earth magnetic data in /data/csvfiles did not work out. Attempts and corresponding problems are described in routes.js.
In short, very hard to extract isoclines from data and plot visuals without shutting down performance of app.


## Despription of code and project structure

* CSS
  * style.css (contains css code for appearance)
* data
  * csvfiles (contains csv files for magnetic field)
  * matfiles (contains .mat files, bad for handling just to have original files)
* js (contains javascript files)
  * dynamic.js (simulation functions)
  * functionality.js (extended app functionality like tabs, projections)
  * helpfunctions.js (helpfunctions for dynamic.js)
  * routes.js (functions for all lineseries mangement: simulation data, bird data, magnet)
  * world.js (general creation of the world map)
* app.html (html file that includes javascript files and has basic app structure. __Open in browser to access app__)

