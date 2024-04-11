let queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryurl).then(function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // creating a popup for the different characterisitcs of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p><p>${new Date(feature.properties.time)}</p>`);
    };
    function createMarkerSize(mag){
      return mag*3;
    };

    function doColor(depth) {
      if (depth <= 10) {
          return '#00FF00'; // Green
      } else if (depth <= 30) {
          return '#ADFF2F'; // Yellow Green
      } else if (depth <= 50) {
          return '#FFA500'; // Orange
      } else if (depth <= 70) {
          return '#FF4500'; // Orange Red
      } else if (depth <= 90) {
          return '#FF0000'; // Red
      } else {
          return '#8B0000'; // Dark Red
      }
  };

    // 
    let earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature,latlng){
        return L.circleMarker(latlng,{
          radius: createMarkerSize(feature.properties.mag),
                fillColor: doColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
        });
      },
      onEachFeature: onEachFeature
    });
  
    // putting earthquake layer in the map function
    createMap(earthquakes);
  }
  //function to create the map with the earthquake layer
  function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
// Create a baseMaps object.
let baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //creating the legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ['#00FF00', '#ADFF2F','#FFA500', '#FF4500', '#FF0000', '#8B0000'];
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');

  }

  return div; 
};

legend.addTo(myMap);
}

