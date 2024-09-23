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

let tilesetOfficeFurni;
let tilesetOfficeExterior;
let tilesetCity;

let geoJsonLayers = {};

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
    viewer.scene.globe.enableLighting = false;
    viewer.shadows = false;

    
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
        }
        const pickedFeature = viewer.scene.pick(event.position);
        console.log('pickedFeature', pickedFeature);
        if (Cesium.defined(pickedFeature)) {
            // clickHandler(event);
            picked_object = pickedFeature.id.properties.category._value;
            picked_object_id = pickedFeature.id.properties.objectid._value;
            picked_object_baCate = pickedFeature.id.properties.basecatego._value;
        }



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

function loadCesiumGeoJSON(url, layerName) {
    return new Promise((resolve, reject) => {
        let newLayer = new Cesium.GeoJsonDataSource();

        newLayer.load(url).then(() => {
            geoJsonLayers[layerName] = newLayer; // 将加载的数据存储到全局变量中
            resolve(newLayer);
        }).catch((error) => {
            console.error('Error loading GeoJSON:', error);
            reject(error);
        });
    });
}

async function loadCesiumIonGeoJSON(assetId, layerName) {
    try {
        const resource = await Cesium.IonResource.fromAssetId(assetId);
        const dataSource = await Cesium.GeoJsonDataSource.load(resource);
        geoJsonLayers[layerName] = dataSource;
        console.log(`GeoJSON data for ${layerName} loaded and stored globally.`);
    } catch (error) {
        console.error('Error loading GeoJSON from Cesium Ion:', error);
    }
}


async function showCesiumGeoJSON(layerName, fillAlpha_material = 0.5, fillAlpha_outline = 0.5, fillColor = Cesium.Color.GRAY, strokeColor = Cesium.Color.DARKGRAY, fitBounds = false) {

    console.time('show showCesiumGeoJSON ' + layerName);
    const newLayer = geoJsonLayers[layerName]; // 从全局变量中选择相应的数据

    if (newLayer) {
        await viewer.dataSources.add(newLayer).then(() => {

            // 设置样式
            const entities = newLayer.entities.values;
            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                if (entity.polygon) {
                    entity.polygon.material = fillColor.withAlpha(fillAlpha_material);  // 设置填充颜色
                    entity.polygon.outline = true;  // 设置是否显示轮廓
                    entity.polygon.outlineColor = strokeColor.withAlpha(fillAlpha_outline);  // 设置轮廓颜色
                    entity.polygon.outlineWidth = 1;  // 设置轮廓宽度
                }
            }

            if (fitBounds) {
                viewer.flyTo(newLayer);
            }
            myCesiumLayers.push({ name: layerName, dataSource: newLayer });
        }).catch((error) => {
            console.error('Error adding GeoJSON to map:', error);
        });
    } else {
        console.error('GeoJSON data not found for layer:', layerName);
    }
    console.timeEnd('show showCesiumGeoJSON ' + layerName);
}

async function loadCesiumIonAsset() {
    // 初始化 Cesium Viewer
    try {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWIyM2M2ZS1hNzg4LTRlZmMtYWFiOC00ZmU2MDcxOTU0NTAiLCJpZCI6MjI5NjQzLCJpYXQiOjE3MjE1MjI0MDF9.oCzgX5tlczqvk8Yt-b_ZhRBOsSXHzc-cs3eED2JHQ4c';


        await showTilesetCity(2689695);
        await showTileset(2700180);
        await showTilesetFur(2700181);

        getPostgreSqlFloorsData();
        getPostgreSqlCeilingsData();
        getPostgreSqlDoorsData();
        getPostgreSqlWallsData();
        getPostgreSqlWindowsData();
        getPostgreSqlRoomFurnitureData_forView();



        // getPostgreSqlRoomFurnitureData();


    } catch (error) {
        console.error('Error loading Cesium Ion asset:', error);
    }
}

async function showExterior() {
    // 先显示 Cesium 地图，以防它没有显示
    showDiv('cesiumWrapper');

    // console.log(geoJsonLayers);


    showCesiumGeoJSON('OfficeFloorsPostgre', 0.5, 0.1);
    showCesiumGeoJSON('OfficeCeilingsPostgre', 0.5, 0.1);
    showCesiumGeoJSON('OfficeDoorsPostgre', 0.5, 0.1);
    showCesiumGeoJSON('OfficeWallsPostgre', 0.5, 0.1);
    showCesiumGeoJSON('OfficeWindowsPostgre', 0.5, 0.1);


    // showCesiumGeoJSON('OfficeRoomTarget', Cesium.Color.YELLOW, Cesium.Color.YELLOW);




}

async function showFurni() {
    // 先显示 Cesium 地图，以防它没有显示
    showDiv('cesiumWrapper');
    showCesiumGeoJSON('OfficeRoomFurniture_forView', 1, 0.1, Cesium.Color.RED, Cesium.Color.RED);

}


async function removeAllLayers() {
    let length = myCesiumLayers.length;
    for (let i = length - 1; i >= 0; i--) {
        // console.log('removing layer: ', myCesiumLayers[i]);
        await viewer.dataSources.remove(myCesiumLayers[i].dataSource);
        myCesiumLayers.splice(i, 1);

    }

}




async function removeLayer(layerName) {
    console.time('removeLayer');
    console.log('myCesiumLayers', myCesiumLayers);
    // console.log('exist layer num: ', myCesiumLayers.length);
    var length = myCesiumLayers.length;
    for (let i = length - 1; i >= 0; i--) {
        if (myCesiumLayers[i].name === layerName) {
            // console.log('removing layer: ', myCesiumLayers[i]);
            await viewer.dataSources.remove(myCesiumLayers[i].dataSource); 
            myCesiumLayers.splice(i, 1);
            break; // 找到并删除图层后退出循环
        }
    }
    // console.log('layers removed, exist layer num: ', myCesiumLayers.length);
    console.timeEnd('removeLayer');
}


function countLayer() {
    console.log('exist layer num: ', myCesiumLayers.length);
    for (let i = 0; i < myCesiumLayers.length; i++) {
        console.log('counting layer: ', myCesiumLayers[i]);
        console.log('counting dataSource: ', myCesiumLayers[i].dataSource);
    }
}

async function showTileset(id) {
    // console.log('Add Tile1: ', tilesetOfficeExterior);
    if (!viewer.scene.primitives.contains(tilesetOfficeExterior)) {
        tilesetOfficeExterior = await Cesium.Cesium3DTileset.fromIonAssetId(id);
        viewer.scene.primitives.add(tilesetOfficeExterior);
    }
    // 等待 tilesetOfficeExterior 准备好
    await tilesetOfficeExterior.readyPromise;

    // 设置模型的颜色样式
    tilesetOfficeExterior.style = new Cesium.Cesium3DTileStyle({
        color: 'color("gray", 0.3)', 
    });
    // console.log('Add Tile2: ', tilesetOfficeExterior);
    // tilesetOfficeExterior.outlineColor = Cesium.Color.YELLOW.withAlpha(0.8); 


    var heightOffset = 46; 
    var boundingSphere = tilesetOfficeExterior.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + heightOffset);
    var translation = Cesium.Cartesian3.subtract(surfacePosition, boundingSphere.center, new Cesium.Cartesian3());
    tilesetOfficeExterior.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

    // await viewer.zoomTo(tilesetOfficeExterior);
}

async function showTilesetFur(id) {
    // console.log('Add Tile1: ', tilesetOfficeFurni);
    if (!viewer.scene.primitives.contains(tilesetOfficeFurni)) {
        tilesetOfficeFurni = await Cesium.Cesium3DTileset.fromIonAssetId(id);
        viewer.scene.primitives.add(tilesetOfficeFurni);
    }

    viewer.scene.globe.enableLighting = false;
    // 等待 tilesetOfficeFurni 准备好
    await tilesetOfficeFurni.readyPromise;
    tilesetOfficeFurni.shadows = Cesium.ShadowMode.DISABLED;

    // 设置模型的颜色样式
    tilesetOfficeFurni.style = new Cesium.Cesium3DTileStyle({
        color: 'color("red", 1)', 
    });
    // console.log('Add Tile2: ', tilesetOfficeFurni);


    var heightOffset = 46; 
    var boundingSphere = tilesetOfficeFurni.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + heightOffset);
    var translation = Cesium.Cartesian3.subtract(surfacePosition, boundingSphere.center, new Cesium.Cartesian3());
    tilesetOfficeFurni.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

    // await viewer.zoomTo(tilesetOfficeFurni);
}


async function showTilesetCity(id) {
    // console.log('Add Tile3: ', tilesetCity);
    if (!viewer.scene.primitives.contains(tilesetCity)) {
        tilesetCity = await Cesium.Cesium3DTileset.fromIonAssetId(id);
        viewer.scene.primitives.add(tilesetCity);
        viewer.zoomTo(tilesetCity);
    }
    // 等待 tileset 准备好
    await tilesetCity.readyPromise;

    // 调整模型高度
    var heightOffset = 75.0; 
    var boundingSphere = tilesetCity.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + heightOffset);
    var translation = Cesium.Cartesian3.subtract(surfacePosition, boundingSphere.center, new Cesium.Cartesian3());
    tilesetCity.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    // }
}



async function removeTileset(tileset) {
    // console.log('Remove Tile1: ', tileset);
    if (viewer.scene.primitives.contains(tileset)) {
        viewer.scene.primitives.remove(tileset);
    }
    // console.log('Remove Tile2: ', tileset);
}

async function removeExceptFstTilesets() {
    const primitives = viewer.scene.primitives;
    const length = primitives.length;

    if (length == 0) { return; }
    for (let i = length - 1; i > 0; i--) {
        const primitive = primitives.get(i);
        if (primitive instanceof Cesium.Cesium3DTileset) {
            primitives.remove(primitive);
        }
    }
    // console.log('Remove Tile all: ', tilesetOfficeExterior);
    // console.log('All tilesets removed');
}

function setZoomFactor(factor) {
    viewer.scene.screenSpaceCameraController._zoomFactor = factor;
}

// async function RemoveTileset() {
    
    
// }

async function AddBimTileset() {
    removeAllLayers();
    geoJsonLayers = {};
    showTileset(2689749);
}

// async function removeAllGeojson() {
//     removeAllLayers();
//     geoJsonLayers = {};

// }

async function showAddGeo() {
    alert('Loading the model may take a few seconds.');
    removeTileset(tilesetOfficeExterior);
    removeTileset(tilesetOfficeFurni);
    showExterior();
    showFurni();
}



function findLayerByName(viewer, layers, layerName) {
    for (let i = 0; i < layers.length; i++) {
        const dataSource = viewer.dataSources.get(layers[i].dataSource);
        if (layers[i].name == layerName) {
            return i;
        }
    }
    return null; // 如果未找到匹配的层，则返回 null
}


