// Create a map object
var myMap = L.map("map-id", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Define a markerSize function that will give each earthquake a different radius based on its magnitude
function markerSize(magnitude) {
  return magnitude * 10000;
}

var colors = ["#95f442", "#eef442", "#f4ce42", "#e09533", "#e06d33", "red"];

function selectFillColor(magnitude) {
  if (parseFloat(magnitude) <= parseFloat(1)) {
    return colors[0];
  } else if (parseFloat(magnitude) > parseFloat(1) && parseFloat(magnitude) <= parseFloat(2)) {
    return colors[1];
  } else if (parseFloat(magnitude) > parseFloat(2) && parseFloat(magnitude) <= parseFloat(3)) {
    return colors[2];
  } else if (parseFloat(magnitude) > parseFloat(3) && parseFloat(magnitude) <= parseFloat(4)) {
    return colors[3];
  } else if (parseFloat(magnitude) > parseFloat(4) && parseFloat(magnitude) <= parseFloat(5)) {
    return colors[4];
  } else {
    return colors[5];
  }
}

function displayMarkers(response) {
  var features = response.features;
    for (var i = 0; i < features.length; i++) {
      var location = features[i].geometry.coordinates;
      //console.log("Location co-ords ", location, features[i].properties.mag, features[i].properties.place);
      L.circle([location[1], location[0]], {
        fillOpacity: 0.75,
        color: "black",
        weight: 0.5,
        fillColor: selectFillColor(features[i].properties.mag),
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(features[i].properties.mag)
      }).bindPopup("<h5>" + features[i].properties.place + "</h5> <hr> <h5>Magnitude: " + features[i].properties.mag + "</h5>").addTo(myMap);
    }
    addLegand();
}

function addLegand() {
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      var labels = [];
  
      limits.forEach(function(limit, index) {
      div.innerHTML +=
            '<i style="background:' +  colors[index]  + '"></i> ' +
            limits[index] + '<br>';
      });

      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);  
}

function addInfoLabel() {
  var info = L.control();
  info.onAdd = function() {
    var div = L.DomUtil.create("div");
    div.innerHTML += '<h4>Eqrthquakes this week</h4>';
  };

  info.addTo(myMap);
}
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url, displayMarkers);