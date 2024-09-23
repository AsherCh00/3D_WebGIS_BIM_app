"use strict"


/**
 * 
 * a global variable to store the closePetrolStationLayer  once it has been added to the map
 * global as will need to be referened by the closePetrolStationLayer remove functionality
 * 
 */

let closePetrolStationLayer;

/**
 * 
 * a global variable to store the markerGroup  once it has been added to the map
 * global as will need to be referened by the markerGroup remove functionality
 * 
 */
let markerGroup;

/**
 * 
 * a global variable to store the removeFlag once it has been added to the map
 * global as will need to be referened by the removeFlag remove functionality
 * 
 */
let removeFlag = false;

/**
 * @function 
 * 
 * @description show User Ranking
 * 
 */

function showUserRanking() {
    // alert("Functionality to do show User Ranking");
    let serviceUrl = document.location.origin + "/api/geojson24/userPriceQueueRanking/" + user_id;
    console.log(serviceUrl);
    let ajax = $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function (result) {
            // console.log(result.array_to_json[0].num_reports);
            alert('The Rank you are ' + result.array_to_json[0].rank);
        }
    });
}

/**
 * @function 
 * 
 * @description to Add Layer - 5 closest petrol stations
 */

function showClosestStations() {
    // alert("Functionality to do Add Layer - 5 closest petrol stations");
    if (petrolStationLayer) {
        mymap.removeLayer(petrolStationLayer);
        petrolStationLayer = null;
    }
    console.log("Trying to get userLocation");
    removeFlag = false;
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
            console.log(userLocation);

            let serviceUrl = document.location.origin + "/api/geojson24/fiveClosestPetrolStations/" + latitude + "/" + longitude;
            console.log(serviceUrl);

            let testMarkerOrange = L.AwesomeMarkers.icon({
                icon: 'play',
                markerColor: 'orange'
            });

            let ajax = $.ajax({
                url: serviceUrl,
                crossDomain: true,
                type: "GET",
                success: function (result) {
                    if (removeFlag) { return; }

                    console.log(result);
                    if (closePetrolStationLayer) {
                        mymap.removeLayer(closePetrolStationLayer);
                    }
                    closePetrolStationLayer = L.geoJson(result,
                        {
                            // the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
                            pointToLayer: function (f, l) {
                                let marker = L.marker(l, { icon: testMarkerOrange }).bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                                marker.on('click', showStationPriceDialog);
                                return marker;

                            } // end of point to layer
                        }).addTo(mymap);

                    // change the map zoom so that all the data is shown
                    mymap.fitBounds(closePetrolStationLayer.getBounds());

                }
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }


}


/**
 * @function 
 * 
 * @description to Remove Layer - 5 closest petrol stations
 * 
 */

function removeClosestStations() {
    // alert("Functionality to do Remove Layer - 5 closest petrol stations");
    if (closePetrolStationLayer) {
        mymap.removeLayer(closePetrolStationLayer);
        closePetrolStationLayer = null;
    }
    removeFlag = true;
}

/**
 * @function 
 * 
 * @description show to Add Layer - queue length unknown
 * 
 */

function showQueueLengthUnknown() {
    // alert("Functionality to do Add Layer - queue length unknown");

    let serviceUrl = document.location.origin + "/api/geojson24/petrolStationsQueueLengthUnknown?user_id=" + user_id;
    console.log(serviceUrl);
    let ajax = $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function (result) {
            // console.log(result.array_to_json[0].num_reports);
            let testMarkerBlue = L.AwesomeMarkers.icon({
                icon: 'play',
                markerColor: 'blue'
            });

            console.log(result);

            if (petrolStationLayer) {
                mymap.removeLayer(petrolStationLayer);
            }

            markerGroup = L.layerGroup().addTo(mymap);

            result.forEach(item => {
                let marker = L.marker(item.coordinates, { icon: testMarkerBlue }) 
                    .bindPopup('<pre>' + JSON.stringify({
                        petrol_station_name: item.petrol_station_name,
                        price_in_pounds: item.price_in_pounds,
                        user_name: item.user_name
                    }, null, ' ').replace(/[\{\}"]/g, '') + '</pre>')
                    .addTo(markerGroup); 

                marker.on('click', function () {
                    showPriceDialog(item);
                });
            });

            // change the map zoom so that all the data is shown
            // mymap.fitBounds(closePetrolStationLayer.getBounds());
            mymap.fitBounds(L.featureGroup(result.map(item => L.marker(item.coordinates))).getBounds());

        }
    });

}



/**
 * @function 
 * 
 * @description to Remove layer - queue length unknown
 * 
 */

function removeQueueLengthUnknown() {
    // alert("Functionality to do Remove layer - queue length unknown");
    markerGroup.remove();
}

/**
 * @function 
 * 
 * @description to Add Layer - no price information in the last 3 days
 * 
 */

function showNoPriceInfo() {
    // alert("Functionality to do Add Layer - no price information in the last 3 days");

    // +++++++++++ Test +++++++++++
    // user_id=583;
    // +++++++++++ Test +++++++++++
    let serviceUrl = document.location.origin + "/api/geojson24/getStationsWithRecentPriceQueueReportMissing/" + user_id;
    
    console.log(serviceUrl);
    let ajax = $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function (result) {

            console.log(result);
            if (petrolStationLayer) {
                mymap.removeLayer(petrolStationLayer);
            }
            let testMarkerPurple = L.AwesomeMarkers.icon({
                icon: 'play',
                markerColor: 'purple'
            });

            console.log(result.features);
            if(result.features==null){
                alert("There is no station with no price information in the last 3 days");
                return;
            }

            petrolStationLayer = L.geoJson(result,
                {
                    // the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
                    pointToLayer: function (f, l) {
                        let marker = L.marker(l, { icon: testMarkerPurple }).bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                        // marker.on('click', showStationPriceDialog);
                        return marker;

                    } // end of point to layer
                }).addTo(mymap);

            // change the map zoom so that all the data is shown
            mymap.fitBounds(petrolStationLayer.getBounds());
        }
    });
}

/**
 * @function 
 * 
 * @description to Remove Layer - no price information in the last 3 days
 * 
 */

function removeNoPriceInfo() {
    // alert("Functionality to do Remove Layer - no price information in the last 3 days");
    if (petrolStationLayer) {
        mymap.removeLayer(petrolStationLayer);
    }
}

