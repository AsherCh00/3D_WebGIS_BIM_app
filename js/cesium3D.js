"use strict"

/**
 * @global 
 * 
 * @description  Cesuim global variable
 */
let viewer;

let handler;

let picked_object;
let picked_object_id;
let picked_object_baCate;

/**
 * @global 
 * 
 * @description  Cesuim global variable layer
 */
let myCesiumLayers = [];

/**
 * @global 
 * 
 * @description  Cesuim global variable url
 */
let url_0 = 'https://cege0043-30.cs.ucl.ac.uk/api/geojson24/getgeojson/cege0043/formdata/id/location';

/**
 * @function 
 * 
 * @description load Cesuim data and global
 */

async function loadCesium() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWIyM2M2ZS1hNzg4LTRlZmMtYWFiOC00ZmU2MDcxOTU0NTAiLCJpZCI6MjI5NjQzLCJpYXQiOjE3MjE1MjI0MDF9.oCzgX5tlczqvk8Yt-b_ZhRBOsSXHzc-cs3eED2JHQ4c';
    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.

    let imageryProviders = Cesium.createDefaultImageryProviderViewModels();
    var selectedImageryProviderIndex = 6;  // MapBox Street is 5th in the list.
    // console.log("imagery");

    // Ellipsoid.
    let ellipsoid = Cesium.Ellipsoid.WGS84;

    // 
    viewer = new Cesium.Viewer('cesiumContainer', {

        imageryProviderViewModels: imageryProviders,
        selectedImageryProviderViewModel: imageryProviders[selectedImageryProviderIndex],
        ellipsoid: ellipsoid,

        // Org wrong maybe 
        // terrainProvider: await Cesium.createWorldTerrainAsync(),

        // Cesium World Terrain
        terrain: Cesium.Terrain.fromWorldTerrain(),

        // Error
        // terrainProvider: Cesium.Terrain.fromWorldTerrain(),

    });


    const selectedEntity = new Cesium.Entity();

    const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    setZoomFactor(1.0);
    loadCesiumIonAsset();
    loadHandler();


    // Add a button
    const toolbar = document.querySelector("div.cesium-viewer-toolbar");
    const modeButton = document.querySelector("span.cesium-sceneModePicker-wrapper");
    const myButton = document.createElement("button");
    myButton.classList.add("cesium-button", "cesium-toolbar-button");
    myButton.innerHTML = "X";
    toolbar.insertBefore(myButton, modeButton);

}

function loadHandler() {
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((event) => {
        zoomLayeringCesium();
    }, Cesium.ScreenSpaceEventType.WHEEL);

    handler.setInputAction(function onLeftClick(event) {
        const pickedPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(pickedPosition)) {
            const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const height = cartographic.height;

            console.log(pickedPosition);
            document.getElementById("clickCoordinates").innerHTML =
                "Clicked on Lon, Lat, Height: " +
                longitude.toFixed(6) + ", " +
                latitude.toFixed(6) + ", " +
                height.toFixed(6);

            if (isMeasuring) {
                positions.push(cartographic);

                viewer.entities.add({
                    position: pickedPosition,
                    point: {
                        pixelSize: 8,
                        color: Cesium.Color.LIME
                    }
                });

                if (positions.length === 2) {
                    const distance = Cesium.Cartesian3.distance(
                        Cesium.Cartographic.toCartesian(positions[0]),
                        Cesium.Cartographic.toCartesian(positions[1])
                    );
                    document.getElementById("clickCoordinates").innerHTML =
                        "Distance: " + distance.toFixed(6) + " meters";
                    console.log(`Distance: ${distance} meters`);

                    viewer.entities.add({
                        polyline: {
                            positions: [
                                Cesium.Cartographic.toCartesian(positions[0]),
                                Cesium.Cartographic.toCartesian(positions[1])
                            ],
                            width: 5,
                            material: Cesium.Color.YELLOW
                        }
                    });

                    // Clear positions for next measurement
                    positions = [];
                    isMeasuring = false;
                    measureLink.textContent = 'Measure';
                }
            }
        }
        const pickedFeature = viewer.scene.pick(event.position);
        console.log('pickedFeature', pickedFeature);
        if (Cesium.defined(pickedFeature)) {
            // clickHandler(event);
            picked_object = pickedFeature.id.properties.category._value;
            picked_object_id = pickedFeature.id.properties.objectid._value;
            picked_object_baCate = pickedFeature.id.properties.basecatego._value;
        }
        // console.log(pickedFeature.getProperty('Category'));
        // console.log("Feature All info",pickedFeature)
        

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}





/**
 * @function 
 * 
 * @description process Petrol Station Data read the data in from the fake petrol station data form
 * <br>and create a string that can be used to post the data to a server via AJAX post
 */
function showCesium() {
    // removeAllMapData();

    showDiv('cesiumWrapper');
}

/**
 * @function 
 * 
 * @description hide Cesium Div
 */
function hideCesium() {
    // removeAllMapData();

    showDiv('mapWrapper');
}

/**
 * @function 
 * 
 * @description load GeoJSON Cesium by URL
 * 
 */
function loadGeoJSONCesiumURL(url, layerName, fitBounds) {

    // Origin Code
    // let style = {
    //     stroke: Cesium.Color.BLUE,
    //     fill: Cesium.Color.BLUE,
    //     strokeWidth: 3,
    //     markerSymbol: 'X'
    // };

    // let newLayer = new Cesium.GeoJsonDataSource();
    // newLayer.load(url);
    // console.log(viewer);
    // console.log(newLayer);
    // viewer.dataSources.add(newLayer);



    // // fly to the extent if required
    // if (fitBounds) {
    //     viewer.flyTo(newLayer);
    // }

    // // now add the datasource into an array
    // // so that we can remove it later if necessary
    // myCesiumLayers.push({ name: layerName, dataSource: newLayer})


    // Origin Code 2
    let newLayer = new Cesium.GeoJsonDataSource();
    newLayer.load(url)
    // console.log(newLayer);
    viewer.dataSources.add(newLayer);
    if (fitBounds) {
        viewer.flyTo(newLayer);
    }
    myCesiumLayers.push({ name: layerName, dataSource: newLayer })
    console.log('myCesiumLayers: ', myCesiumLayers);

}

/**
 * @function 
 * 
 * @description Add Form Data To Cesium global
 * 
 */
function addFormDataToCesium() {
    // first show the Cesium map just in case it is not visible
    showDiv('cesiumWrapper');

    // NB do not hard code the URL 
    // use document.location
    let geoJSONRoute = 'geojson24';
    let url = document.location.origin + "/api/" + geoJSONRoute + "/petrolStationsByUser/" + user_id;
    // let layerURL = "./data/HospiGeoJSON.geojson";
    // let layerURL2 = "./data/ChadBIM_Furni_modi.geojson";
    // let layerURL = "./data/Edificio15_ExteriorShell_piec.geojson";
    // let layerURL3 = "./data/CityMapGeoJSON_piec.geojson";

    // console.log(url);
    // loadGeoJSONCesiumURL(layerURL2, "formdata", true)
    let layerURL = "./data/ChadBIM_Exter_modi.geojson";
    let layerURL2 = "./data/ChadBIM_Furni_modi.geojson";
    LayerNum = 1;
    console.log("layernumExtViz: ", LayerNum);
    // console.log(url);
    loadGeoJSONCesiumURL(layerURL, "Exterior", false);
    loadGeoJSONCesiumURL(layerURL2, "Furni", false);

}

/**
 * @function 
 * 
 * @description remove All 3D cesium data
 * 
 */
function removeAll3Ddata() {
    for (let i = 0; i < myCesiumLayers.length; i++) {
        viewer.dataSources.remove(myCesiumLayers[i].dataSource);
    }
}




