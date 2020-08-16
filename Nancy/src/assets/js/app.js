
// Style credit: https://snazzymaps.com/style/1/pale-dawn
const mapStyle = [{
  'featureType': 'administrative',
  'elementType': 'all',
  'stylers': [{
    'visibility': 'on',
  },
  {
    'lightness': 33,
  },
  ],
},
{
  'featureType': 'landscape',
  'elementType': 'all',
  'stylers': [{
    'color': '#f2e5d4',
  }],
},
{
  'featureType': 'poi.park',
  'elementType': 'geometry',
  'stylers': [{
    'color': '#c5dac6',
  }],
},
{
  'featureType': 'poi.park',
  'elementType': 'labels',
  'stylers': [{
    'visibility': 'on',
  },
  {
    'lightness': 20,
  },
  ],
},
{
  'featureType': 'road',
  'elementType': 'all',
  'stylers': [{
    'lightness': 20,
  }],
},
{
  'featureType': 'road.highway',
  'elementType': 'geometry',
  'stylers': [{
    'color': '#c5c6c6',
  }],
},
{
  'featureType': 'road.arterial',
  'elementType': 'geometry',
  'stylers': [{
    'color': '#e4d7c6',
  }],
},
{
  'featureType': 'road.local',
  'elementType': 'geometry',
  'stylers': [{
    'color': '#fbfaf7',
  }],
},
{
  'featureType': 'water',
  'elementType': 'all',
  'stylers': [{
    'visibility': 'on',
  },
  {
    'color': '#acbcc9',
  },
  ],
},
];


// Escapes HTML characters in a template literal string, to prevent XSS.
// See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
function sanitizeHTML(strings) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' };
    let result = strings[0];
    for (let i = 1; i < arguments.length; i++) {
        result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
            return entities[char];
        });
        result += strings[i];
    }
    return result;
}

function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('body').item(0).appendChild(script); 
  
} 

/**
 * Initialize the Google Map.
 */
function initMap() {
  
  // Create the map.
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 35.669696 , lng:  -119.0997248},
    styles: mapStyle
  });


  // Load the fire and county GeoJSON onto the map.
  
  // this results in header fields too large error
  /*
  let fireURL = "https://www.fire.ca.gov/umbraco/api/IncidentApi/GeoJsonList?year=2020";
  $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(fireURL) + '&callback=?', function(data){
    console.log(data.contents);
    map.data.loadGeoJson(data.contents, {idPropertyName: 'UniqueId'});
  });
*/  

// Load the fire and county GeoJSON onto the map.
  map.data.loadGeoJson('./assets/json/fires.json', {idPropertyName: 'UniqueId'});
  // Load county map polygons
  map.data.loadGeoJson('./assets/json/california-counties.json', {idCountyName: 'name'});



  
  // color the counties and place wildfire icons
let defaultColor = "black";
let mapCounty, iconURL, countyColor, rateIndex ;

// ************************************************************
// 
// This part of the code will eventually display Clyde's charts
// 
// ************************************************************
  const apiKey = 'AIzaSyDghaJQj_qgYqvWND7-Huz2rcdtzEXWuc4';
  const infoWindow = new google.maps.InfoWindow();

  // Show the information for a fire when its marker is clicked.
  map.data.addListener('click', (event) => {
    const type = event.feature.getProperty('Type');
    const name = event.feature.getProperty('Name');
    const description = event.feature.getProperty('Location');
    const moreInfo = event.feature.getProperty('Url');
    const containment = event.feature.getProperty('PercentContained');
    // const position = event.feature.getGeometry().get();
    const content = sanitizeHTML`
      <img style="float:left; width:215px; margin-top:30px" src="./assets/img/icon_${type}.png">
      <div style="margin-left:235px; margin-bottom:20px;">
        <h2>${name}</h2><p>${description}</p>
        <p><b>Open:</b> ${moreInfo}<br/><b>Phone:</b> ${containment}</p>
        <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
      </div>
      `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
  });


// get output 
var theseCounties = JSON.parse(localStorage.getItem("countyRate"));

function colorTheRainbow(obj, k){
  
      console.log("Color the Rainbow Output");
      console.log(obj[k].name);
      localCountyName = obj[k].name;
      console.log(obj[k].infectionRate);

      let number = obj[k].infectionRate;
      if (number <= 15) {
          rateIndex = "r15";
          countyColor = "#FFEC81";
      } else if (number <= 50) {
          rateIndex = "r50";
          countyColor = "#FF8F41";
      } else if (number <= 100) {
          rateIndex = "r100";
          countyColor = "#FF4E20";
      } else if (number <= 200) {
          rateIndex = "r200";
          countyColor = "#DC0000";
      } else if (number <= 500) {
          rateIndex = "r500";
          countyColor = "#950000";
      } else {
          rateIndex = "rMore";
          countyColor = "#4F0000";
      }
  return console.log(countyColor)
}

/*
// 
// STYLE THE MAP DATA LAYER
// 
*/
map.data.setStyle(function(feature){
  mapCounty = feature.getProperty('name');
  // iconURL = `./assets/img/icon_Wildfire.png`;
  for (i=0; i<theseCounties.length; i++){
    if (theseCounties[i].name === mapCounty){
      console.log ("we have a match");
      colorTheRainbow(theseCounties, i)
    }
  }
  if (feature.getProperty('IsActive')=== "Y"){
    // figure out how to only show active fire icons using show/hide map.setOptions
  };

      outlineWeight = zIndex = 2;
      color = countyColor;
    // }
  
  return /** @type {!google.maps.Data.StyleOptions} */ {
    icon:{
      url: `./assets/img/icon_Wildfire.png`,
      scaledSize: new google.maps.Size(24, 44),

    },
    fillColor: color,
    strokeColor: color,
    strokeWeight: outlineWeight,
    
  };
});
}
