/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
// Style credit: https://snazzymaps.com/style/1/pale-dawn
const mapStyle = [{
    'featureType': 'administrative',
    'elementType': 'all',
    'stylers': [{
        'visibility': 'on',
    }, {
        'lightness': 33,
    }, ],
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
    }, ],
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
    }, ],
}, ];
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
/**
 * Initialize the Google Map.
 */
function initMap() {
    // Create the map.
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 32.6203047, lng: -117.0014208 },
        styles: mapStyle,
    });
    // Load the fire and county GeoJSON onto the map.
    map.data.loadGeoJson('./assets/json/fires.json', { idPropertyName: 'UniqueId' });
    map.data.loadGeoJson('./assets/json/california-counties.json', { idCountyName: 'name' });
    // color the counties and place wildfire icons
    let defaultColor = "black";
    let color1 = "red";
    let color2 = "orange";
    let color3 = "yellow";
    let regex1 = RegExp("^[A-F].*$");
    let regex2 = RegExp("^[G-L].*$");
    let regex3 = RegExp("^[L-Z].*$");
    map.data.setStyle(feature => {
        let color;
        let countyName = feature.getProperty('name');
        console.log(feature.getProperty('name'));
        // color counties based on name as a test
        if (regex1.test(countyName)) {
            color = color1;
        } else if (regex2.test(countyName)) {
            color = color2;
        } else if (regex3.test(countyName)) {
            color = color3;
        } else {
            color = defaultColor;
        }
        return /** @type {!google.maps.Data.StyleOptions} */ {
            icon: {
                url: `./assets/img/icon_${feature.getProperty('Type')}.png`,
                scaledSize: new google.maps.Size(24, 44),
            },
            fillColor: color,
            strokeColor: color,
            strokeWeight: 2
        };
    });
    const apiKey = 'AIzaSyDghaJQj_qgYqvWND7-Huz2rcdtzEXWuc4';
    const infoWindow = new google.maps.InfoWindow();
    // Show the information for a fire when its marker is clicked.
    map.data.addListener('click', (event) => {
        const type = event.feature.getProperty('Type');
        const name = event.feature.getProperty('Name');
        const description = event.feature.getProperty('Location');
        const moreInfo = event.feature.getProperty('Url');
        const containment = event.feature.getProperty('PercentContained');
        const position = event.feature.getGeometry().get();
        const content = sanitizeHTML `
      <img style="float:left; width:215px; margin-top:30px" src="./assets/img/icon_${type}.png">
      <div style="margin-left:235px; margin-bottom:20px;">
        <h2>${name}</h2><p>${description}</p>
        <p><b>Open:</b> ${moreInfo}<br/><b>Phone:</b> ${containment}</p>
        <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
      </div>
      `;
        infoWindow.setContent(content);
        infoWindow.setPosition(position);
        infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
        infoWindow.open(map);
    });
}