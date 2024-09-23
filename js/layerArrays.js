'use strict'

// create an empty array 
/**
 * layerArrayList
 * 
 * a global variable to store the layers once it has been added to the map
 * global as will need to be referened by the layer remove functionality
 * 
 */
let layerArrayList = []

/**
 * @function 
 * 
 * @description add layers into array
 * 
 */
function addLayerUsingArray() {
    let loadLayerDialog = document.getElementById("layerToLoadArray");
    loadLayerDialog.showModal();
    console.log('loadLayerDialog')

}

// The addArrayButtonListener() function needs to be called after the web page is loaded to make sure that the listeners are set up.   
// You should work out how to do this by looking at how the map is loaded, and loading the listeners after the map load function.  

/**
 * @function 
 * 
 * @description  use button to add layer into array
 * 
 */
function addArrayButtonListener() {
    console.log("arraybuttonlistener");
    // ****************** TEST ************************
    let addLayerBtnArray = document.getElementById("addLayerBtnArray");
    // let addLayerBtnArrayVal = document.getElementById("loadArrayLayerURL");
    // console.log('addLayerBtnArray = ' + addLayerBtnArray);
    // console.log(addLayerBtnArrayVal);

    // if (!addLayerBtnArray) {
    //     console.error('Button not found in the document');
    //     return;
    // }
    // ****************** TEST FIN ************************

    // add a listener for when the user clicks on the addLayrerBtn button
    addLayerBtnArray.addEventListener('click', (event) => {
        event.preventDefault(); // We don't want to submit this fake form so this line cancels the default submit behaviour for an HTML form
        // get the information that the user has typed in
        let url = document.getElementById("loadArrayLayerURL").value;
        let layerName = document.getElementById("loadArrayLayerName").value;
        document.getElementById("layerToLoadArray").close();


        // check to make sure that a layer with this name isn't already loaded
        for (let i = 0; i < layerArrayList.length; i++) {
            if (layerArrayList[i].name == layerName) {
                alert("A layer with this name is already loaded - please remove that first");
                // no need to go any further
                return;
            }
        }

        // call the load layer code
        // this requires the URL from the form, 
        // the layerName from the form
        // then a parameter whether to zoom into the layer extents
        // and finally the type of layer control we wish to use
        loadArrayLayer(url, layerName, true, "array");


        // close the dialog
        let loadLayerDialog = document.getElementById("layerToLoadArray");
        loadLayerDialog.close();

    }); // end of the listener
}

/**
 * @function 
 * 
 * @description remove Layer Using Array, make it easier to remove layers
 * 
 */
function removeLayerUsingArray() {
    let layerDialog = document.getElementById("layerToRemoveArray");

    // load the list of layers

    let layerSelect = document.getElementById("listOfArrayLayers");
    removeOptions(layerSelect);
    console.log("addLayersToSelect in the removelayer " + layerArrayList.length);
    addLayersToSelectArray(layerSelect);
    layerDialog.showModal();

}

/**
 * @function 
 * 
 * @description add Layers To Select Array, make it easier to Select layer
 * 
 */

function addLayersToSelectArray(selectElement) {
    console.log("addLayersToSelect " + layerArrayList.length);
    for (let i = 0; i < layerArrayList.length; i++) {
        let option = document.createElement("option");
        option.text = layerArrayList[i].name;
        selectElement.add(option);
    }
}

/**
 * @function 
 * 
 * @description remove Options, try to avoid making duplicate 
 * 
 */
function removeOptions(selectElement) {
    let i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

/**
 * @function 
 * 
 * @description  use button to remove layer from array
 * 
 */
function removeArrayButtonListener() {
    removeLayerBtnArray.addEventListener('click', (event) => {
        event.preventDefault(); // We don't want to submit this fake form so this line cancels the default submit behaviour for an HTML form
        // get the layername that the user has selected
        let layerList = document.getElementById("listOfArrayLayers");
        let selectedOption = layerList.options[layerList.selectedIndex];
        let layerName = selectedOption.text;
        // call the remove layer code
        removeLayerArray(layerName);
        document.getElementById("layerToRemoveArray").close(); // Have to send the select box value here.
    }); // end of the listener
}// end of the function

/**
 * @function 
 * 
 * @description  remove Layer from Array
 * 
 */
function removeLayerArray(layername) {
    for (let i = 0; i < layerArrayList.length; i++) {
        console.log("array " + layerArrayList[i].name + " " + layername);
        if (layerArrayList[i].name == layername) {
            console.log("match");
            mymap.removeLayer(layerArrayList[i].layer);
            layerArrayList.splice(i, 1);  // splice removes an item at a specific location - the 1 says only remove 1 element
            break; // don't continue the loop as we now have 1 less element in the array which means that when we try to get the last element it won't be there any more
        }
    }
}

/**
 * @function 
 * 
 * @description  list Layers from Array
 * 
 */
function listLayersUsingArray() {
    let layerDialog = document.getElementById("listAllLayersArray");

    // load the list of layers

    let layerSelect = document.getElementById("listAllArrayLayersSelect");
    
    removeOptions(layerSelect);
    console.log("addLayersToSelect in the removelayer " + layerArrayList.length);
    addLayersToSelectArray(layerSelect);
    layerDialog.showModal();

}