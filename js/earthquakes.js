"use strict"

/**
 * @function showEarthquakeForms
 * 
 * @description show the EarthquakeForms layer, assume that the data is stored in a data directory on the local server
 * 
 */
function showEarthquakeForms(){
    // alert("showEarthquakeForms");
    let testMarkerGreen = L.AwesomeMarkers.icon({
        icon: 'play',
        markerColor: 'green'
    });


	 let layerURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
	 $.ajax({url: layerURL, crossDomain: true,success: function(result){
			// load the geoJSON layer
    		let earthquakeLayer = L.geoJson(result,
        		{
            	/** use point to layer to create the points
            	 */
            	pointToLayer: function (feature, latlng){
		              // look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude and use a different marker depending on this value
		              // also include a pop-up that shows the place value of the earthquakes
            		  // we also just use the place in the pop up icon
            		 let newMarker = L.marker(latlng, {icon:testMarkerGreen});
                     newMarker.on('click',showDialog);
	                 return newMarker;
           		},  // end of point to layer

        }).addTo(mymap);

    	// zoom to the layer
    	mymap.fitBounds(earthquakeLayer.getBounds());

		} // end of the inner function
	}); // end of the ajax request

}

/**
 * @function showDialog
 * 
 * @param {e} event - the map event
 * @description show Dialog define some variables to store data that we need to use once we have the dialog HTML
 * 
 */
function showDialog(e){

	// create a new Leaflet popup
	let popup = L.popup();

	// define some variables to store data that we need to use once we have the dialog HTML
	// in this case the word  this refers to the marker that the user cliked on 
	// (in geneeral this in JavaScript events this is the element that received the event - which could be a button, a map, a div, a marker etc)

	// we need to get the unique identifier of the earthquake - the code - so that we know that the damage data is linked to the correct earthquake
	let earthquakeCode =this.feature.properties.code;
	
	// we also need the marker to attach the popup to
	let marker = this;
	

	// we will load the dialog using an AJAX request
	let formURL = "../dialogs/earthquakeDialog.txt";
	 $.ajax({url: formURL, crossDomain: true,success: function(result){
	 	console.log(result);
		let form = result.toString();
		// set the content of the popup to include the earthquake code identifier and then the form
    	popup.setContent("<div id='earthquakeCode'>"+earthquakeCode+"</div>"+form);

    	// set an event to remove and destroy the form when the popup is closed
    	// this means that we don't end up with duplicate earthquakeCode DIVs
		popup.on('remove', closeEarthquakeForm);

		// add the popup to the marker
		marker.bindPopup(popup).openPopup();
	}
	});
}

/**
 * @function closeEarthquakeForm
 * 
 * @description this function is called by the close button but also by the on remove function which is triggered when the pop-up is closed two situations happen
 * 
 */
function closeEarthquakeForm(){
	// we need to destroy the form when the popup is closed
	// so that we never end up with more than one DIV or INPUT box etc with the same ID (if the form is loaaded onto another earthquake point)
	// use the remove() option to completely destroy the surrounding div and its contents

	// this function is called by the close button but also by the on remove function which is triggered when the pop-up is closed
	// two situations happen
	// 1. the top cross is used to close the popup - i.e. the inbuilt functionality
	//        in that case, the form is removed

	// 2. clicking the close button destroys the form, 
	//		but then the on remove button will try to destroy it again and won't find it so will 
	// throw an error
	try {
		document.getElementById('earthquakeForm').remove();
	} catch (e) {
		// no need to do anything
		// the error will happen as the 'on remove' event is triggered by the close or save events
		// but they 
	}

}

/**
 * @function 
 * 
 * @description read the data in from the fake earthquake data form
 * <br>and create a string that can be used to post the data to a server via AJAX post
 */
function processEarthquakeData() {
	// first we need to get the ID (code) that uniquely identifies the earthquake
	// that way we know which earthquake to associate with the damaage report when we save it in the database
	let earthquakeCode = document.getElementById('earthquakeCode').innerHTML;
	let reporterName = document.getElementById('reporterName').value;
	let damageObserved = document.getElementById('damagedObserved').value;

	// we create a string that we then use in the AJAX post call to send all the values to the server 
	// for processing and insertion into a database
	let postString = "earthquakeCode="+earthquakeCode+"&reporterName="+reporterName + "&damageObserved="+damageObserved;
	console.log(postString);
	// now that we have the data from the DIVs we can destroy the pop-up and the DIVs
	// that way if we click on another pop-up we won't create multiple DIVs with the same ID - 
	// which would confuse the document.getElementById code as it wouldn't know which one to check
	document.getElementById('earthquakeForm').remove();


	// AJAX call to upload the data goes here
    // note that we use GET here as we are not actually
    // inserting data - but if you are inserting data
    // your end point will be POST and the AJAX call should also 
    // use post
    let serviceUrl= document.location.origin+"/api/crud24/testCRUD";
    console.log(serviceUrl);
    $.ajax({
	    url: serviceUrl,
	    crossDomain: true,
	    type: "GET",
	    success: function(result){
	    	console.log(result); 
    	},
    	data: postString
    });
}


