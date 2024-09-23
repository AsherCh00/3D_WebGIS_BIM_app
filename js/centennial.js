"use strict"

/**
 * buildingsLayer
 * 
 * a global variable to store the buildings layer once it has been added to the map
 * global as will need to be referened by the buildings remove functionality
 * 
 */

let buildingsLayer;

/**
 * universityLayer
 * 
 * a global variable to store the university Layer once it has been added to the map
 * global as will need to be referened by the buildings remove functionality
 * 
 */
let universityLayer;

/**
 * roomsLayer
 * 
 * a global variable to store the rooms Layer once it has been added to the map
 * global as will need to be referened by the buildings remove functionality
 * 
 */
let roomsLayer;

/**
 * sensorsLayer
 * 
 * a global variable to store the sensors Layer once it has been added to the map
 * global as will need to be referened by the buildings remove functionality
 * 
 */
let sensorsLayer;

/**
 * @function showBuildings
 * 
 * @description show the buildings layer, assume that the data is stored in a data directory on the local server
 * 
 */

function showBuildings() {
    // as we are hosting the data on our server, we don't need to provide the full https:// ... detail
    let layerURL = document.location.origin + "/api/geojson24/getGeoJSON/ucfscde/buildings/building_id/location";

    // If the layer was existed, remove it.
    if (buildingsLayer) {
        mymap.removeLayer(buildingsLayer);
    }

    $.ajax({
        url: layerURL,
        crossDomain: true,
        success: function (result) {
            // load the geoJSON layer
            buildingsLayer = L.geoJson(result,
                {
                    // the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
                    onEachFeature: function (f, l) {
                        l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                    } // end of point to layer
                }).addTo(mymap);

            // change the map zoom so that all the data is shown
            mymap.fitBounds(buildingsLayer.getBounds());

        }// end of the inner function
    }); // end of the ajax request
}

/**
 * @function removeBuildings
 * 
 * @description remove the buildings layer.
 * 
 */
function removeBuildings() {
    try {
        mymap.removeLayer(buildingsLayer);
    } catch (err) {

    }
}

/**
 * @function showUniversity
 * 
 * @description show the university layer, assume that the data is stored in a data directory on the local server
 * 
 */

function showUniversity() {
    // as we are hosting the data on our server, we don't need to provide the full https:// ... detail
    let layerURL = document.location.origin + "/api/geojson24/getGeoJSON/ucfscde/university/university_id/location";

    // If the layer was existed, remove it.
    if (universityLayer) {
        mymap.removeLayer(universityLayer);
    }

    $.ajax({
        url: layerURL,
        crossDomain: true,
        success: function (result) {
            // load the geoJSON layer
            universityLayer = L.geoJson(result,
                {
                    // the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
                    onEachFeature: function (f, l) {
                        l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                    } // end of point to layer
                }).addTo(mymap);

            // change the map zoom so that all the data is shown
            mymap.fitBounds(universityLayer.getBounds());

        }// end of the inner function
    }); // end of the ajax request
}

/**
 * @function removeUniversity
 * 
 * @description remove the university layer.
 * 
 */
function removeUniversity() {
    try {
        mymap.removeLayer(universityLayer);
    } catch (err) {

    }
}

/**
 * @function showRooms
 * 
 * @description show the rooms layer, assume that the data is stored in a data directory on the local server
 * 
 */

function showRooms() {
    // as we are hosting the data on our server, we don't need to provide the full https:// ... detail
    let layerURL = document.location.origin + "/api/geojson24/getGeoJSON/ucfscde/rooms/room_id/location";

    // If the layer was existed, remove it.
    if (roomsLayer) {
        mymap.removeLayer(roomsLayer);
    }

    $.ajax({
        url: layerURL,
        crossDomain: true,
        success: function (result) {
            // load the geoJSON layer
            roomsLayer = L.geoJson(result,
                {
                    // the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
                    onEachFeature: function (f, l) {
                        l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                    } // end of point to layer
                }).addTo(mymap);

            // change the map zoom so that all the data is shown
            mymap.fitBounds(roomsLayer.getBounds());

        }// end of the inner function
    }); // end of the ajax request
}

/**
 * @function removeRooms
 * 
 * @description remove the rooms layer.
 * 
 */
function removeRooms() {
    try {
        mymap.removeLayer(roomsLayer);
    } catch (err) {

    }
}

/**
 * @function showSensors
 * 
 * @description show the sensors layer, assume that the data is stored in a data directory on the local server
 * 
 */

function showSensors() {
    // as we are hosting the data on our server, we don't need to provide the full https:// ... detail
    let layerURL = document.location.origin + "/api/geojson24/getGeoJSON/ucfscde/temperature_sensors/sensor_id/location";

    // If the layer was existed, remove it.
    if (sensorsLayer) {
        mymap.removeLayer(sensorsLayer);
    }

    $.ajax({
        url: layerURL,
        crossDomain: true,
        success: function (result) {
            // load the geoJSON layer
            sensorsLayer = L.geoJson(result,
                {
                    // the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
                    onEachFeature: function (f, l) {
                        l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                    } // end of point to layer
                }).addTo(mymap);

            // change the map zoom so that all the data is shown
            mymap.fitBounds(sensorsLayer.getBounds());

        }// end of the inner function
    }); // end of the ajax request
}

/**
 * @function removeSensors
 * 
 * @description remove the sensors layer.
 * 
 */
function removeSensors() {
    try {
        mymap.removeLayer(sensorsLayer);
    } catch (err) {

    }
}