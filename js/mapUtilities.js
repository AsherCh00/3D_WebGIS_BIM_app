"use strict"
/**
 * a global variable to store the current Popup layer once it has been added to the map
 * global as will need to be referened by the current Popup remove functionality
 */

let currentPopup;
let petrolStationLayer=null;

/**
 * a global variable to store the userid 
 * global as will need to be referened by the user_id  functionality
 */
let user_id;

/**
 * a global variable to store the serviceUrl_id 
 * global as will need to be referened by the serviceUrl_id  functionality
 */
let serviceUrl_id = document.location.origin + "/api/crud24/userID";
// console.log(serviceUrl_id);
// $.ajax({
// 	url: serviceUrl_id,
// 	crossDomain: true,
// 	type: "GET",
// 	success: function (result) {
// 		// console.log(user_id);
// 		user_id = result.user_id;
// 	},
// });

/**
 * function onMapClick - creates a pop up when the user clicks on the map
 * 
 * @params e  - the click event - this holds information about where the user has actually clicked - A bubble window will be displayed at the clicked position.
 */

function onMapClick(e) {
	// create a new Leaflet pop up
	let popup = L.popup();

	// add some values to the pop up to show the coordinates
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(mymap);
}

/**
 * function onMapClickDiv - takes the results of the location where the use clicks and adds it to a DIV
 * 
 * @params e  - the click event - this holds information about where the user has actually clicked
 */

function onMapClickDiv(e) {
	document.getElementById("clickCoordinates").innerHTML = "Clicked on Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng;

}

document.getElementById('searchInput').addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
		const query = event.target.value;
		selectFeatures(query);
		event.target.value = ''; // 重置搜索框的值
	}
});

/**
 * function keyPressZoomToPoint - zoom to the extent of all the data when the user clicks on the ctrl-e key if they are hovering over the map
 * 
 * @params e  - the click event - this holds information about where the user has actually clicked
 */

function keyPressZoomToPoint(e) {

	if (e.originalEvent.ctrlKey && e.originalEvent.key === "e") {
		mymap.flyTo([51.508, -0.11], 12)

		// we don't want this specific event to propagate
		// event propagation is when the event is sent to the browser once it has completed on the map 
		// we stop propagation by 
		e.originalEvent.preventDefault();
	}


}

/**
 * @function removeAllMapData
 * 
 * @description remove all layers includes the basemap layer
 */

function removeAllMapData() {
	mymap.eachLayer(function (layer) {
		mymap.removeLayer(layer);
	});

	// removing all layers includes the basemap layer, so add this back in
	let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(mymap);


}

// listener to detect the screen size change
// calls processWindwoResize
window.addEventListener('resize', processWindowResize);

/**
 * @function processWindowResize 
 * 
 * @description process Window Resize
 */

function processWindowResize() {
	// console.log("resize");
	// remove all the map data
	removeAllMapData();


	// then make sure the map div is visible - this automatically cloeses any other wrapper divs
	showDiv('cesiumWrapper');

	// finally call the postResize function - depending on the new screensize this can be used to add any required data layers to the map
	// postResize();
}

/**
 * @function postResize
 * 
 * @description post Window Resize, main fuction for assignment4.
 */
// function postResize() {
// 	// detect the new screen width
// 	let width = $(window).width();
// 	console.log(width);

// 	// placeholder for functionality depending on screen width
// 	// NB - MAKE SURE TO CHANGE THE CUT-OFF VALUES USING THE BOOTSTRAP values
// 	// this functionality needs to be adapted as needed
// 	// e.g. change what happens when the user clicks on the map
// 	// load any required data

// 	let breakPoint = 767.98;

// 	if (width < breakPoint) {
// 		// Price / Queue

// 		// Core Functionality 2 Get location
// 		switchLocationServicesOn_Pr('showPosition_Pr');
// 		// switchLocationServicesOn2();

// 		// let layerURL = document.location.origin + "/api/geojson24/getGeoJSON/cege0043/petrol_station/petrol_station_id/location";
// 		let layerURL = document.location.origin + "/api/geojson24/petrolStationsByUser/" + user_id;

// 		let petrolStationLayer;
// 		if (petrolStationLayer) {
// 			mymap.removeLayer(petrolStationLayer);
// 		}

// 		let testMarkerRed = L.AwesomeMarkers.icon({
// 			icon: 'play',
// 			markerColor: 'red'
// 		});
// 		let testMarkerGray = L.AwesomeMarkers.icon({
// 			icon: 'play',
// 			markerColor: 'gray'
// 		});

// 		let testMarkerPink = L.AwesomeMarkers.icon({
// 			icon: 'play',
// 			markerColor: 'pink'
// 		});

// 		let testMarkerBlue = L.AwesomeMarkers.icon({
// 			icon: 'play',
// 			markerColor: 'blue'
// 		});

// 		let testMarkerPurple = L.AwesomeMarkers.icon({
// 			icon: 'play',
// 			markerColor: 'purple'
// 		});
// 		let testMarkerGreen = L.AwesomeMarkers.icon({
// 			icon: 'play',
// 			markerColor: 'green'
// 		});

// 		let testMarkerBlack = L.AwesomeMarkers.icon({
// 			icon: 'play',
// 			markerColor: 'black'
// 		});

// 		$.ajax({
// 			url: layerURL,
// 			crossDomain: true,
// 			success: function (result) {
// 				// load the geoJSON layer
// 				// console.log(result);
// 				petrolStationLayer = L.geoJson(result,
// 					{
// 						// the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
// 						pointToLayer: function (f, l) {
// 							let marker = L.marker(l, { icon: testMarkerBlack }).bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
// 							// marker.on('click', showPriceDialog);
// 							let queue_length_description = f.properties.queue_length_description;

// 							if (queue_length_description == 'Queue is very long (over 15 minutes)') {
// 								marker = L.marker(l, { icon: testMarkerRed });
// 							}
// 							else if (queue_length_description == 'Queue is moderately long (between 10 and 15 minutes)') {
// 								marker = L.marker(l, { icon: testMarkerGreen });
// 							}
// 							else if (queue_length_description == 'Queue is OK (between 5 and 10 minutes)') {
// 								marker = L.marker(l, { icon: testMarkerPurple });

// 							}
// 							else if (queue_length_description == 'Queue is very short (less than 5 minutes)') {
// 								marker = L.marker(l, { icon: testMarkerPink });

// 							}
// 							else if (queue_length_description == 'No queue') {
// 								marker = L.marker(l, { icon: testMarkerBlue });

// 							}
// 							else if (queue_length_description == 'Unknown') {
// 								marker = L.marker(l, { icon: testMarkerGray });

// 							}
// 							else {
// 								marker = L.marker(l, { icon: testMarkerBlack });
// 							}
// 							marker.on('click', showPriceDialog);

// 							return marker;

// 						} // end of point to layer

// 					}).addTo(mymap);

// 				// change the map zoom so that all the data is shown
// 				mymap.fitBounds(petrolStationLayer.getBounds());

// 			}// end of the inner function
// 		}); // end of the ajax request

// 		//Advanced Functionality 1.1 
// 		if (navigator.geolocation) {
// 			navigator.geolocation.watchPosition(function (position) {
// 				var userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
// 				console.log(userLocation);
// 				mymap.eachLayer(function (layer) {
// 					if (layer instanceof L.Marker && mymap.getBounds().contains(layer.getLatLng())) {
// 						// var distance = userLocation.distanceTo(layer.getLatLng());
// 						let distance = calcDistanceToPopPoint(position, layer.getLatLng().lat, layer.getLatLng().lng);

// 						// console.log(distance);

// 						if (distance <= 0.2) {  // Check if user is within 200 meters of the petrol station
// 							// layer.openPopup();  // Automatically open the popup
// 							console.log(layer.feature.properties.petrol_station_name + ' in distance ' + distance);
// 							showPriceDialog.call(layer)
// 							// layer.on('add', function () {
// 							// 	showPriceDialog.call(this);
// 							// });

// 						}
// 					}
// 				});
// 			});
// 		} else {
// 			alert("Geolocation is not supported by this browser.");
// 		}

// 		// clear any click functionality that already exists
// 		mymap.off('click');

// 	}
// 	else {
// 		// Petrol Station
// 		swtichLocationServicesOff()
// 		let layerURL = document.location.origin + "/api/geojson24/petrolStationsByUser/" + user_id;

// 		if (petrolStationLayer) {
// 			mymap.removeLayer(petrolStationLayer);
// 		}

// 		let testMarkerGreen = L.AwesomeMarkers.icon({
// 			icon: 'play',
// 			markerColor: 'green'
// 		});

// 		$.ajax({
// 			url: layerURL,
// 			crossDomain: true,
// 			success: function (result) {
// 				// load the geoJSON layer
// 				petrolStationLayer = L.geoJson(result,
// 					{
// 						// the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
// 						pointToLayer: function (f, l) {
// 							let marker = L.marker(l, { icon: testMarkerGreen }).bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
// 							marker.on('click', showStationPriceDialog);
// 							return marker;

// 						} // end of point to layer
// 					}).addTo(mymap);

// 				// change the map zoom so that all the data is shown
// 				mymap.fitBounds(petrolStationLayer.getBounds());

// 			}// end of the inner function
// 		}); // end of the ajax request


// 		// clear any previous click functionality
// 		mymap.off('click');
// 		// the on click functionality of the MAP 
// 		mymap.on('click', function (e) {
// 			let marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
// 			let popup = L.popup();
// 			let formURL = "../dialogs/petrolStationDialog.txt";

// 			$.ajax({
// 				url: formURL, crossDomain: true, success: function (result) {
// 					// console.log(result);
// 					let form = result.toString();
// 					// set the content of the popup to include the petrol station code identifier and then the form
// 					popup.setContent("<input type='hidden' id='lanValue' value='" + e.latlng.lat + "'>" +
// 						"<input type='hidden' id='lngValue' value='" + e.latlng.lng + "'>"
// 						+ form);

// 					// set an event to remove and destroy the form when the popup is closed
// 					// this means that we don't end up with duplicate petrolStationCode DIVs
// 					popup.on('remove', closePetrolStationForm);
// 					// add the popup to the marker
// 					marker.bindPopup(popup).openPopup();

// 					currentPopup = popup;
// 				}
// 			});

// 		});
// 	}

// }

/**
 * @function cancelFormSubmission
 * 
 * @description close Petrol Station Form, use petrolStationForm to remove form.
 * 
 */
function cancelFormSubmission(event) {
	// stop click event
	event.stopPropagation();
	closePetrolStationForm();

	// remove Popup
	if (currentPopup) {
		currentPopup.remove();
		currentPopup = null;
	}
}

/**
 * @function closePetrolStationForm
 * 
 * @description close Petrol Station Form, use petrolStationForm to remove form.
 * 
 */
function closePetrolStationForm() {
	try {
		document.getElementById('petrolStationForm').remove();
	} catch (e) {
	}


}

/**
 * @function 
 * 
 * @description process Petrol Station Data read the data in from the fake petrol station data form
 * <br>and create a string that can be used to post the data to a server via AJAX post
 */
function processPetrolStationData(event) {
	event.stopPropagation();
	// let userID = document.getElementById('userID').value;
	let stationName = document.getElementById('stationName').value;
	let lastInspected = document.getElementById('lastInspected').value;
	let latitude = document.getElementById('lanValue').value;
	let longitude = document.getElementById('lngValue').value;

	let postString = {
		// userID: userID,
		petrol_station_name: stationName,
		last_inspected: lastInspected,
		latitude: latitude,
		longitude: longitude
	};

	if (stationName == '' || lastInspected == '') {
		alert('You have to fill all info in form.');
		return;
	}
	if (!isValidDate(lastInspected)) {
		alert('You fill invalid date in form.');
		return;
	}

	console.log(postString);

	document.getElementById('petrolStationForm').remove();

	let serviceUrl = document.location.origin + "/api/crud24/testCRUD";
	console.log(serviceUrl);
	$.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			console.log(result);
		},
		data: postString
	});


	let serviceUrl2 = document.location.origin + "/api/crud24/insertPetrolStation";
	console.log(serviceUrl2);
	$.ajax({
		url: serviceUrl2,
		crossDomain: true,
		type: "POST",
		success: insertResult,
		data: postString
	});

	if (currentPopup) {
		currentPopup.remove();
		currentPopup = null;
	}
	let formattedPostString = JSON.stringify(postString, null, 2);
	alert(formattedPostString);
}

/**
 * @function 
 * 
 * @description show Price Dialog, create a new Leaflet popup and load the dialog using an AJAX request.
 * 
 */
function showPriceDialog(e) {

	// create a new Leaflet popup
	let popup = L.popup();


	// we need to get the unique identifier of the - the code - so that we know that the damage data is linked to the correct
	let stationName = this.feature.properties.petrol_station_name;
	let price_in_pounds = this.feature.properties.price_in_pounds;

	// we also need the marker to attach the popup to
	let marker = this;
	console.log(marker)

	let serviceUrl = document.location.origin + "/api/geojson24/getQueueLengths";
	let formData = null;
	let queueForm = '';

	console.log("Popup Price" + price_in_pounds);

	console.log(serviceUrl);
	let ajax1 = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			// console.log(result.array_to_json[0].num_reports);
			formData = result;
			// console.log(formData);


			for (let i = 0; i < formData.length; i++) {
				queueForm += '<input type="radio" id="' + formData[i].queue_length_id + '" name="queueLength" value="' +
					formData[i].queue_length_description + '">' +
					'<label for="' + formData[i].queue_length_id + '">' + formData[i].queue_length_description +
					'</label><br>\n';
				// console.log(queueForm);

				// we will load the dialog using an AJAX request
				let formURL = "../dialogs/priceQueueDialog.txt";
				let ajax2 = $.ajax({
					url: formURL, crossDomain: true, success: function (result) {
						// console.log(result);
						let form = result.toString();
						// set the content of the popup to include the identifier and then the form
						popup.setContent(
							"<div id='stationName'>Station Name: " + stationName + "</div>" +
							"<input type='hidden' id='stationNameValue' value='" + stationName + "'>" +
							'<input id="lastPetrolPrice" name="lastPetrolPrice" type="hidden" value=' +
							price_in_pounds +
							'></input>' +
							form + queueForm +
							' <p><label for="petrolPrice">Price of Unleaded Petrol in £ per litre:</label>' +
							'<input id="petrolPrice" name="petrolPrice" type="text"></p>' +
							'<button id="saveBtn" onclick="processPriceQueueData()">Save Price/Queue</button>'
						);
						popup.on('remove', closePriceQueueForm);

						// add the popup to the marker
						marker.bindPopup(popup).openPopup();
					}
				});

			}
			// console.log(result);
		}
	});




}


/**
 * @function 
 * 
 * @description close Price Queue Form, use priceQueueForm to remove form.
 * 
 */
function closePriceQueueForm() {
	try {
		document.getElementById('priceQueueForm').remove();
	} catch (e) {

	}

}

/**
 * @function 
 * 
 * @description show Station Price Dialog, use stationPriceDialog to show Station Price Dialog form.
 * 
 */
function showStationPriceDialog(e) {

	// create a new Leaflet popup
	let popup = L.popup();


	// we need to get the unique identifier of the - the code - so that we know that the damage data is linked to the correct
	let stationName = this.feature.properties.petrol_station_name;
	let queue_length_description = this.feature.properties.queue_length_description;
	let price_in_pounds = this.feature.properties.price_in_pounds;

	// we also need the marker to attach the popup to
	let marker = this;
	console.log(marker)

	// we will load the dialog using an AJAX request
	let formURL = "../dialogs/stationPriceDialog.txt";
	$.ajax({
		url: formURL, crossDomain: true, success: function (result) {
			// console.log(result);
			let form = result.toString();
			// set the content of the popup to include the identifier and then the form
			popup.setContent(
				"<p><b>Petrol Station Price/Queue</b></p>" +
				"<div id='stationName'><b>Station Name: </b>" + stationName + "</div>" +
				"<input type='hidden' id='stationNameValue' value='" + stationName + "'>" +
				"<div id='queueLength'><b>Queue Length: </b>" + queue_length_description + "</div>" +
				"<input type='hidden' id='queueLengthValue' value='" + queue_length_description + "'>" +
				"<div id='price'><b>Price of Unleaded Petrol in £ per litre: </b>" + price_in_pounds + "</div>" +
				"<input type='hidden' id='priceValue' value='" + price_in_pounds + "'>" +
				form
			);
			popup.on('remove', closeStationPriceForm);

			// add the popup to the marker
			marker.bindPopup(popup).openPopup();
		}
	});
}



/**
 * @function 
 * 
 * @description close Price Queue Form, use stationPriceQueueForm to remove form.
 * 
 */
function closeStationPriceForm() {
	try {
		document.getElementById('stationPriceQueueForm').remove();
	} catch (e) {

	}

}

/**
 * @function 
 * 
 * @description process Price Queue Data read the data in from the fake Price Queue data form
 * <br>and create a string that can be used to post the data to a server via AJAX post
 */
function processPriceQueueData() {
	let stationName = document.getElementById('stationNameValue').value;
	let petrolPrice = parseFloat(document.getElementById('petrolPrice').value);
	let lastPetrolPrice = parseFloat(document.getElementById('lastPetrolPrice').value);
	let queueLength = document.querySelector('input[name="queueLength"]:checked').value;

	
	if (petrolPrice > lastPetrolPrice) {
		alert("The New price is higher than the previous price.");
	} else if (petrolPrice < lastPetrolPrice) {
		alert("The New price is lower than the previous price.");
	} else if (petrolPrice == lastPetrolPrice) {
		alert("The New price is the same as before.");
	} else {
		alert("Data Error!");
	}

	let postString = {
		petrol_station_name: stationName,
		price_in_pounds: petrolPrice,
		queue_length_id: queueLength

	};

	console.log(postString);

	document.getElementById('priceQueueForm').remove();

	let serviceUrl = document.location.origin + "/api/crud24/testCRUD";
	console.log(serviceUrl);
	let ajax1 = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			console.log(result);
		},
		data: postString
	});

	let serviceUrl2 = document.location.origin + "/api/crud24/insertPriceQueueReport";
	console.log(serviceUrl2);
	let ajax2 = $.ajax({
		url: serviceUrl2,
		crossDomain: true,
		type: "POST",
		success: insertResult,
		data: postString
	});

	let serviceUrl3 = document.location.origin + "/api/geojson24/numPriceQueueReports/" + user_id;
	console.log(serviceUrl3);
	let ajax3 = $.ajax({
		url: serviceUrl3,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			// console.log(result.array_to_json[0].num_reports);
			alert('The total reports you have sent is ' + result.array_to_json[0].num_reports);
		},
		data: postString
	});


	$.when(ajax1, ajax2, ajax3).done(function () {
		postResize();
	});


	let formattedPostString = JSON.stringify(postString, null, 2);
	alert(formattedPostString);
}

/**
 * @function 
 * 
 * @description load Array Layer using geojson options
 * 
 */
function loadArrayLayer(url, layerName, fitBounds, layerControlType) {
	console.log(layerControlType);
	$.ajax({
		url: url, crossDomain: true, success: function (result) {
			console.log(result); // check that the data is correct
			// add the JSON layer onto the map - it will appear using the default icons
			// for each feature in the layer, add a pop-up with its properties
			var geojsonMarkerOptions = {
				radius: 8,
				fillColor: "blue",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};
			let style = {
				fillColor: "blue",
				weight: 2,
				opacity: 0.5,
				color: "blue",
				dashArray: '3',
				fillOpacity: 1
			};
			let newLayer = L.geoJSON(result, {
				style: style,
				onEachFeature: function (f, l) {
					l.bindPopup('<b>' + layerName + '</b><pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');

				},
				pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng, geojsonMarkerOptions);
				}
			}).addTo(mymap);

			// depending on the layer control type selected, 
			if (layerControlType == "array") {
				addLayerToArray(newLayer, layerName);
			}
			if (layerControlType == "leaflet") {
				addLayerToLayerControl(newLayer, layerName);
			}

			// change the map zoom so that all the data is shown

			// if this is a manual add then zoom to the new layer
			if (fitBounds) {
				mymap.fitBounds(newLayer.getBounds());
			}
		} // end of the inner function
	}); // end of the ajax request

}

/**
 * @function 
 * 
 * @description add Layer to Array using push
 * 
 */
function addLayerToArray(newLayer, layerName) {
	layerArrayList.push({ layer: newLayer, name: layerName });

}

/**
 * @function 
 * 
 * @description add Layer to layer control
 * 
 */
function addLayerToLayerControl(newLayer, layerName) {
	layerControl.addOverlay(newLayer, layerName);
}


// Adv 1.1
/**
 * @function swtichLocationServicesOn2
 * 
 * 
 * @param locationFunction string - the function that is called when the locaiton tracking is swtiched on
 * 
 * @description start location services - make sure that there is only one location service running at a time
 * <BR><br>having locationFunction as a parameter means that we can vary what happens with the tracking information
 * 
 *
 */
function switchLocationServicesOn2(callback) {
	if (navigator.geolocation) {
		try {
			(navigator.geolocation.clearWatch(locationTrackerId));
		}
		catch (e) {
			console.log(e);
		}
		// need to tell the tracker what we will do with the coordinates – showPosition 
		// also what we will do if there is an error – errorPosition
		// also set some parameters – e.g how often to renew, what timeout to set
		// timeout - how long the system will keep trying for a location before rasing an error
		// maximumAge - how long to cache the position

		const options = {
			enableHighAccuracy: true,
			maximumAge: 5000,
			timeout: 27000
		};
		locationTrackerId = navigator.geolocation.watchPosition(
			function (position) {
				if (callback && typeof callback === 'function') {
					console.log(position)
					callback(position);  // 调用回调函数并传递位置数据
				}
			},
			errorPosition,
			options
		);
	} else {
		alert("Location tracking not supported on this device");
	}
}

/**
 * @function 
 * 
 * 
 * @param locationFunction string - the function that is called when the locaiton tracking is swtiched on
 * 
 * @description start location services - make sure that there is only one location service running at a time
 * <BR><br>having locationFunction as a parameter means that we can vary what happens with the tracking information
 * 
 *
 */
function switchLocationServicesOn_Pr(locationFunction) {

	// we need to check if the location service is already in use, and if it is remove it before creating a new one
	// so that we don’t have multiple tracking going on
	if (navigator.geolocation) {
		try {
			(navigator.geolocation.clearWatch(locationTrackerId));
		}
		catch (e) {
			console.log(e);
		}
		// need to tell the tracker what we will do with the coordinates – showPosition 
		// also what we will do if there is an error – errorPosition
		// also set some parameters – e.g how often to renew, what timeout to set
		// timeout - how long the system will keep trying for a location before rasing an error
		// maximumAge - how long to cache the position

		const options = {
			enableHighAccuracy: true,
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
 * @function 
 * 
 * @description update the user's location on the web page
 * 
 * @params position - the location information, derived from the watchPosition command
 *
 */

function showPosition_Pr(position) {
	console.log("you have moved to " + position.coords.latitude);
	document.getElementById('clickCoordinates').innerHTML = " Lat: " + position.coords.latitude + " Lng: " + position.coords.longitude + " Horizontal Accuracy: " + position.coords.accuracy + " Altitude Accuracy: " + position.coords.altitudeAccuracy + " Heading: " + position.coords.heading + " Speed: " + position.coords.speed + " Altitude: " + position.coords.altitude;
}


/**
 * @function 
 * 
 * @description complete the process to calculate the distance between the user's current location and a given fixed point
 * <br>and add a point to the map if it is below 500m
 *  
 * @param position - the latitude and longitude data supplied by the navigator
 * 
 */

function calcDistanceToPopPoint(position, customLat, customLng) {
	// fixed point - the approximate location of UCL
	let lat = customLat;
	let lng = customLng;


	let userLat = position.coords.latitude;
	let userLng = position.coords.longitude;

	// swtich location tracking off as otherwise the function is called repeatedly
	// swtichLocationServicesOff();
	let distance = calculateDistance(lat, lng, userLat, userLng, "K");
	// create a marker
	// let testMarkerOrange = L.AwesomeMarkers.icon({
	// 	icon: 'play',
	// 	markerColor: 'orange'
	// });


	// // add the point to the map
	// let myLocation = L.marker([position.coords.latitude, position.coords.longitude], { icon: testMarkerOrange }).bindPopup(position.timestamp);
	// myLocation.addTo(mymap);
	// remember, distance units are in km
	return distance;

}

/**
 * @function 
 * 
 * @description figure out if is Valid Date data
 * 
 */
function isValidDate(dateString) {
	const date = new Date(dateString);
	return !isNaN(date.getTime());
}