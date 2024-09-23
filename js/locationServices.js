"use strict"

/**
 * locationTrackerId 
 * 
 * stores the ID of the location tracker so that it can be switched off if necessary 
 * avoids having multipole location services running at the same time
 *
 */

let locationTrackerId;

/**
 * @function swtichLocationServicesOn
 * 
 * 
 * @param locationFunction string - the function that is called when the locaiton tracking is swtiched on
 * 
 * @description start location services - make sure that there is only one location service running at a time
 * <BR><br>having locationFunction as a parameter means that we can vary what happens with the tracking information
 * 
 *
 */
function switchLocationServicesOn(locationFunction) {

	// we need to check if the location service is already in use, and if it is remove it before creating a new one
	 // so that we don’t have multiple tracking going on
	if (navigator.geolocation) {
	    try {
	       (navigator.geolocation.clearWatch(locationTrackerId));
	    }
	    catch (e){
	      console.log(e);
	    }
		// need to tell the tracker what we will do with the coordinates – showPosition 
		// also what we will do if there is an error – errorPosition
		// also set some parameters – e.g how often to renew, what timeout to set
		// timeout - how long the system will keep trying for a location before rasing an error
		// maximumAge - how long to cache the position
		
		const options = {
		  enableHighAccuracy: true	,
		  maximumAge: 5000,
		  timeout: 27000
		};

		// start the new location tracking service
		// showPosition is the function that processes location information once it is obtained
		// errorPosition is the function that is called if there is an error
		// options are the settings above - height accuracy, how frequneelty position is measured
		// we use window[locationFunction] here as we receive the function name as a STRING from the menu but need to CAST (convert) it to a function call  (strings are just text)
		console.log(window[locationFunction])
		// console.log(locationFunction);
		locationTrackerId = navigator.geolocation.watchPosition(window[locationFunction], errorPosition, options);

	} 
	else {
		alert("Location tracking not supported on this device");
	}
}

/**
 * @function showPosition
 * 
 * @description update the user's location on the web page
 * 
 * @params position - the location information, derived from the watchPosition command
 *
 */

function showPosition(position) {
	console.log("you have moved"+position.coords.latitude);
	document.getElementById('clickCoordinates').innerHTML = " Lat: " + position.coords.latitude +     " Lng: " + position.coords.longitude +" Horizontal Accuracy: "+ position.coords.accuracy + " Altitude Accuracy: "+position.coords.altitudeAccuracy+" Heading: "+position.coords.heading+" Speed: "+position.coords.speed+" Altitude: "+position.coords.altitude;
}

/**
 * @function errorPosition
 * 
 * if there is an error in the location tracking service, run this code
 *
 */
function errorPosition(error){
    console.log(error);
}

/**
 * @function 
 * 
 * @description show swtichLocationServicesOff
 * 
 */

function swtichLocationServicesOff(){
    // alert("swtichLocationServicesOff");
    // make sure to ues the locationTrackerId variable so that the tracker is the one that was created
		// use a try/catch statement just in case locationTrackerId has not yet been used (i.e. it would be undefined and cause an error)
		try {
			navigator.geolocation.clearWatch(locationTrackerId);

		}
		catch (error){
			// no need to do anything if there is an error
		}


		// clear the DIV that contains the tracking information
		document.getElementById('clickCoordinates').innerHTML = "";
}



/**
 * @function calculateDistance
 * 
 * @description given coordinates and a unit, calculate the distance between the points
 * code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-in-your-web-apps.html [accessed 24 Dec 2023]
 *
 * @param {double} lat1  - the latitude of the first point
 * @param {double} lon1  - the longitude of the first point
 * @param {double} lat2  - the latitude of the second point
 * @param {double} lon2  - the longitude of the second point
 * @param {String} unit - the unit for disance - by deafult the distance is in miles, using K gives kilometers, and N gives nautical mines
 * 
 * @returns {number} dist - the distance between the provided coordinates
 */

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
        let radlat1 = Math.PI * lat1/180
        let radlat2 = Math.PI * lat2/180
        let radlon1 = Math.PI * lon1/180
        let radlon2 = Math.PI * lon2/180
        let theta = lon1-lon2
        let radtheta = Math.PI * theta/180
        let subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        subAngle = Math.acos(subAngle)
        subAngle = subAngle * 180/Math.PI  // convert the degree value returned by acos back to degrees from radians
        let dist = (subAngle/360) * 2 * Math.PI * 3956; //     ((subtended angle in degrees)/360) * 2 * pi * radius where radius is 3956 miles
        if (unit=="K") { dist = dist * 1.609344 } // convert miles to km
        if (unit=="N") { dist = dist * 0.8684 } // convert miles to nautical miles
        return dist
}


/**
 * @function distanceFromPoint
 * 
 * @description start the process to calculate the distance between the user's current location and a given fixed point
 *  
 * 
 */

function distanceFromPoint() {

	// switch location services on
	// and then for the return function that is activated once location services are on
	// call calcDistanceFromFixedPoint
	switchLocationServicesOn("calcDistanceFromFixedPoint");

}

/**
 * @function calcDistanceFromFixedPoint
 * 
 * @description complete the process to calculate the distance between the user's current location and a given fixed point
 * <br>and add a point to the map if it is below 500m
 *  
 * @param position - the latitude and longitude data supplied by the navigator
 * 
 */

function calcDistanceFromFixedPoint(position){
	// fixed point - the approximate location of UCL
	let lat = 51.522449;
	let lng = -0.132630;


	let userLat = position.coords.latitude;
	let userLng = position.coords.longitude;

	// swtich location tracking off as otherwise the function is called repeatedly
    swtichLocationServicesOff();
	let distance = calculateDistance(lat, lng, userLat, userLng, "K");



	// remember, distance units are in km
	console.log(distance);
	if (distance < 0.5) {

		// create a marker
		let testMarkerOrange = L.AwesomeMarkers.icon({
		    icon: 'play',
    		markerColor: 'orange'
		});


		// add the point to the map
		let myLocation =  L.marker([position.coords.latitude,position.coords.longitude], {icon:testMarkerOrange}).bindPopup(position.timestamp);
		myLocation.addTo(mymap);

		// zoom to the user's location
		// mymap.flyTo([position.coords.latitude, position.coords.longitude],12);
	}

}