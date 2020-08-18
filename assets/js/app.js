//Optional map style to use uncomment line 115
// Style credit: https://snazzymaps.com/style/1/pale-dawn
const mapStyle = [{
    'featureType': 'administrative',
    'elementType': 'all',
    'stylers': [{
        'visibility': 'on',
    }, {
        'lightness': 33,
    },],
}, {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [{
        'color': '#f2e5d4',
    }],
}, {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [{
        'color': '#c5dac6',
    }],
}, {
    'featureType': 'poi.park',
    'elementType': 'labels',
    'stylers': [{
        'visibility': 'on',
    }, {
        'lightness': 20,
    },],
}, {
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [{
        'lightness': 20,
    }],
}, {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [{
        'color': '#c5c6c6',
    }],
}, {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [{
        'color': '#e4d7c6',
    }],
}, {
    'featureType': 'road.local',
    'elementType': 'geometry',
    'stylers': [{
        'color': '#fbfaf7',
    }],
}, {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [{
        'visibility': 'on',
    }, {
        'color': '#acbcc9',
    },],
},];
// set up some global variables
let mapCounty, countyColor, timeFrame, map;
// get output 
var theseCounties = JSON.parse(localStorage.getItem("historicRate"));
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
// sets the county polygon fill color based on infection rate
function colorTheCounty(number) {
    if (number <= 15) {
        rateIndex = "r15";
        countyColor = "#36FFAA";
    } else if (number <= 50) {
        rateIndex = "r50";
        countyColor = "#F6FF37";
    } else if (number <= 100) {
        rateIndex = "r100";
        countyColor = "#FFC537";
    } else if (number <= 200) {
        rateIndex = "r200";
        countyColor = "#FF822B";
    } else if (number <= 500) {
        rateIndex = "r500";
        countyColor = "#FF342B";
    } else {
        rateIndex = "rMore";
        countyColor = "#83161C";
    }
    return countyColor
}

/**
 * Initialize the Google Map.
 */
function drawMap(weekIndex) {
    if (weekIndex) {
        timeFrame = weekIndex;
    } else {
        timeFrame = 0;
    }
    // console.log("Time frame:");
    // console.log(timeFrame);
    // Create the map.
    map = new google.maps.Map(document.getElementById('googMap'), {
        zoom: 6,
        center: { lat: 37.669696, lng: -120.0997248 },
        disableDefaultUI: true
        // styles: mapStyle
    });
    loadUpJSON()
}
function loadUpJSON() {
    // Load the fire and county GeoJSON onto the map.
    // this results in header fields too large error
    /*
    let fireURL = "https://www.fire.ca.gov/umbraco/api/IncidentApi/GeoJsonList?year=2020";
    $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(fireURL) + '&callback=?', function(data){
      console.log(data.contents);
      map.data.loadGeoJson(data.contents, {idPropertyName: 'UniqueId'});
    });
    */
    map.data.loadGeoJson('./assets/json/fires.json', {idPropertyName: 'UniqueId'});

    // var kmlLayer = new google.maps.KmlLayer(src, {
    //     suppressInfoWindows: true,
    //     preserveViewport: false,
    //     map: map
    //   });



    // Load county map polygons
    map.data.loadGeoJson('./assets/json/california-counties.json', {idCountyName: 'name'});
    // color the counties and place wildfire icons
    let defaultColor = "black";
    // ************************************************************
    // 
    // This part of the code displays Clyde's charts
    // 
    // ************************************************************
   
    
    map.data.addListener('click', (event) => {
        //send county var to displayCounty function
        const thisCounty = event.feature.getProperty('name');
        displayCounty(thisCounty);
        
        // enhancment code to load fire hazard in side panel
        // const type = event.feature.getProperty('Type');
        // const thisFire = event.feature.getProperty('Name');
        // const description = event.feature.getProperty('Location');
        // const containment = event.feature.getProperty('PercentContained');
        // // var featureType = event.feature.getGeometry().get();
        // const content = sanitizeHTML`
        //   <img style="float:left; width:60px; margin-top:30px" src="./assets/images/icon_${type}.png">
        //   <div style="margin-left:60px; margin-bottom:20px;">
        //     <h4>${thisFire}</h4><p>${description}</p>
        //     <p><b>Containment:</b> ${containment}</p>
        //   </div>
        //   `;
        // infoWindow.setContent(content);
        // infoWindow.setPosition(position);
        // infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
        // infoWindow.open(map);
    });
    /*
    // 
    // STYLE THE MAP DATA LAYER
    // 
    */
    map.data.setStyle(function (feature) {
        mapCounty = feature.getProperty('name');
        for (i = 0; i < 57; i++) {
            // console.log(theseCounties[i][timeFrame].name);
            if ((theseCounties[24].length) <= timeFrame) { // Modoc County (number 24 in the array) didn't start reporting until later so change the timeFrame to fit
                let range = timeFrame - 1;
                if (theseCounties[24][range].name === mapCounty) {
                    // console.log ("we have a match");
                    colorTheCounty(theseCounties[i][range].infectionRate)
                    // console.log(countyColor);
                    // console.log(i + "and" + range);
                }
            } else {
                if (theseCounties[i][timeFrame].name === mapCounty) {
                    // console.log ("we have a match");
                    colorTheCounty(theseCounties[i][timeFrame].infectionRate)
                    // console.log(countyColor);
                    // console.log(i + "and" + timeFrame);
                }
            }
        }
        // pull these vars out for future feature show/hide
        outlineWeight = zIndex = 2;
        color = countyColor;
        return /** @type {!google.maps.Data.StyleOptions} */ {
            icon: {
                url: `./assets/images/icon_Wildfire.png`,
                scaledSize: new google.maps.Size(24, 44),

            },
            fillColor: color,
            strokeColor: color,
            strokeWeight: outlineWeight,
        };
    });
}