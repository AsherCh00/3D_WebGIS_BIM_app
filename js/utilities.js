"use strict"
/**
* function to load Cesium and Leaflet maps when the page load has completed
* 
*/
// makes sure that the map is only loaded once the page has completely loaded
// i.e. the div for the map must exist before the code tries to load the map
document.addEventListener('DOMContentLoaded', function () {
  // console.log("listener domcontentloaded");
  loadMap();
  loadCesium();
  // addArrayButtonListener();
  // removeArrayButtonListener();

}, false);

/**
 * @function 
 * 
 * @description to hide All Divs
 * 
 */
function hideAllDivs() {
  let isMapVisible = $('#mapWrapper').is(":visible");
  if (isMapVisible) {
    let mapCollapse = document.getElementById('mapWrapper');
    let bsMapCollapse = new bootstrap.Collapse(mapCollapse, {
      toggle: true
    });
  }

  let isCesiumVisible = $('#cesiumWrapper').is(":visible");
  if (isCesiumVisible) {
    let mapCollapse = document.getElementById('cesiumWrapper');
    let bsMapCollapse = new bootstrap.Collapse(mapCollapse, {
      toggle: true
    });
  }

  let isAssetVisible = $('#assetDataWrapperWrapper').is(":visible");
  if (isAssetVisible) {
    let mapCollapse = document.getElementById('assetDataWrapperWrapper');
    let bsMapCollapse = new bootstrap.Collapse(mapCollapse, {
      toggle: true
    });
  }

  let isAbilityVisible = $('#mapAbilityWrapper').is(":visible");
  if (isAbilityVisible) {
    let mapCollapse = document.getElementById('mapAbilityWrapper');
    let bsMapCollapse = new bootstrap.Collapse(mapCollapse, {
      toggle: true
    });
  }
}

/**
 * @function 
 * 
 * @description to show Div
 * 
 */

function showDiv(divName) {
  hideAllDivs();
  let visibleDiv = document.getElementById(divName);
  let divCollapse = new bootstrap.Collapse(visibleDiv, {
    toggle: true
  });

}