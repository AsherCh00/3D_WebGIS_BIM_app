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
let tilesetBim;

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

    let selectedEntity = new Cesium.Entity();

    let clickHandler = viewer.screenSpaceEventHandler.getInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    loadCesiumIonAsset();
    loadHandler();
    viewer.scene.globe.enableLighting = false;
    viewer.shadows = false;

    
    // Add a button
    let toolbar = document.querySelector("div.cesium-viewer-toolbar");
    let modeButton = document.querySelector("span.cesium-sceneModePicker-wrapper");
    let myButton = document.createElement("button");
    myButton.classList.add("cesium-button", "cesium-toolbar-button");
    myButton.innerHTML = "X";
    toolbar.insertBefore(myButton, modeButton);

}

function loadHandler() {
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(function onLeftClick(event) {
        let pickedPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(pickedPosition)) {
            let cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let height = cartographic.height;

            // console.log(pickedPosition);
            document.getElementById("clickCoordinates").innerHTML =
                "Clicked on Lon, Lat, Height: " +
                longitude.toFixed(6) + ", " +
                latitude.toFixed(6) + ", " +
                height.toFixed(6);
        }
        let pickedFeature = viewer.scene.pick(event.position);
        // console.log('pickedFeature', pickedFeature);
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

async function loadCesiumGeoJSON_org1(url, layerName) {
    try {
        let newLayer = new Cesium.GeoJsonDataSource();
        await newLayer.load(url);
        geoJsonLayers[layerName] = newLayer; // 将加载的数据存储到全局变量中
        return newLayer;
    } catch (error) {
        console.error('Error loading GeoJSON:', error);
        throw error; // 抛出错误，以便在调用该函数时可以捕获
    }
}


async function loadCesiumIonGeoJSON(assetId, layerName) {
    try {
        console.time('loadCesiumGeoJSON - total'); 
        console.time('loadCesiumGeoJSON - fromAssetId'); 
        let resource = await Cesium.IonResource.fromAssetId(assetId);
        console.timeEnd('loadCesiumGeoJSON - fromAssetId'); 
        console.time('loadCesiumGeoJSON - load'); 
        let dataSource = await Cesium.GeoJsonDataSource.load(resource);
        console.timeEnd('loadCesiumGeoJSON - load'); 
        geoJsonLayers[layerName] = dataSource;
        // console.log(`GeoJSON data for ${layerName} loaded`);
        console.time('loadCesiumGeoJSON - addDataSource');
        await viewer.dataSources.add(dataSource);
        console.timeEnd('loadCesiumGeoJSON - addDataSource'); 

        myCesiumLayers.push({ name: layerName, dataSource: dataSource });

        console.time('loadCesiumGeoJSON - display');

        // 使用回调函数在 requestAnimationFrame 之后执行代码
        requestAnimationFrame(() => {
            console.timeEnd('loadCesiumGeoJSON - display');
            console.timeEnd('loadCesiumGeoJSON - total'); 
        });
        
    } catch (error) {
        console.error('Error loading GeoJSON from Cesium Ion:', error);
    }
}

async function loadCesiumIonAsset() {
    // 初始化 Cesium Viewer
    try {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWIyM2M2ZS1hNzg4LTRlZmMtYWFiOC00ZmU2MDcxOTU0NTAiLCJpZCI6MjI5NjQzLCJpYXQiOjE3MjE1MjI0MDF9.oCzgX5tlczqvk8Yt-b_ZhRBOsSXHzc-cs3eED2JHQ4c';
       
        await showTilesetCity(2689695);

    } catch (error) {
        console.error('Error loading Cesium Ion asset:', error);
    }
}

async function loadCesiumGeoJSON(url, layerName) {
    console.time('loadCesiumGeoJSON - total'); // 开始总时间计时
    try {
        let newLayer = new Cesium.GeoJsonDataSource();

        console.time('loadCesiumGeoJSON - load'); // 开始加载时间计时
        await newLayer.load(url);
        console.timeEnd('loadCesiumGeoJSON - load'); // 加载完成计时

        console.time('loadCesiumGeoJSON - addDataSource');
        await viewer.dataSources.add(newLayer);
        console.timeEnd('loadCesiumGeoJSON - addDataSource'); // 数据源添加计时

        myCesiumLayers.push({ name: layerName, dataSource: newLayer });

        console.time('loadCesiumGeoJSON - display');

        // 使用回调函数在 requestAnimationFrame 之后执行代码
        requestAnimationFrame(() => {
            console.timeEnd('loadCesiumGeoJSON - display');
            console.timeEnd('loadCesiumGeoJSON - total'); // 总时间计时结束
        });
        

    } catch (error) {
        console.error('Error when loading GeoJSON:', error);
        console.timeEnd('loadCesiumGeoJSON - total'); // 出错时结束总时间计时
        throw error;
    }
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
    var heightOffset = 75.0; // 将100.0替换为你的模型需要的高度
    var boundingSphere = tilesetCity.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + heightOffset);
    var translation = Cesium.Cartesian3.subtract(surfacePosition, boundingSphere.center, new Cesium.Cartesian3());
    tilesetCity.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    // }
}

async function showCesiumGeoJSON(layerName) {

    console.time('show showCesiumGeoJSON ' + layerName);
    let newLayer = geoJsonLayers[layerName]; // 从全局变量中选择相应的数据

    if (newLayer) {
        await viewer.dataSources.add(newLayer).then(() => {
            myCesiumLayers.push({ name: layerName, dataSource: newLayer });
        }).catch((error) => {
            console.error('Error adding GeoJSON to map:', error);
        });
    } else {
        console.error('GeoJSON data not found for layer:', layerName);
    }
    console.timeEnd('show showCesiumGeoJSON ' + layerName);
}

async function showLocalBenchmark(){
    loadCesiumGeoJSON('data\\OfficeFurnitureQgis_benmk238.geojson',"OfficeLocalBenchmark");
}

async function showCesiumIonBenchmark(){
    // loadCesiumIonGeoJSON(2703562, "OfficeCesiumIonBenchmark50");
    // loadCesiumIonGeoJSON(2703563, "OfficeCesiumIonBenchmark100");
    // loadCesiumIonGeoJSON(2703564, "OfficeCesiumIonBenchmark150");
    // loadCesiumIonGeoJSON(2703566, "OfficeCesiumIonBenchmark200");
    loadCesiumIonGeoJSON(2706305, "OfficeCesiumIonBenchmark236");
    // loadCesiumIonGeoJSON(2703567, "OfficeCesiumIonBenchmark250");
    
    

}

async function showPostgreSqlBenchmark() {
    console.time('showCesiumGeoJSON Benchmark - total');
    console.time("loadPostgreSqlBenchmarkData")
    await getPostgreSqlBenchmarkData();
    console.timeEnd("loadPostgreSqlBenchmarkData")
    await showCesiumGeojsonBenchmark('OfficePostgreSqlBenchmark');
}

async function showMongoBenchmark() {
    console.time('showCesiumGeoJSON Benchmark - total');
    console.time("loadMongoBenchmarkData")
    await getMongoBenchmarkData('OfficeMongoBenchmark');
    console.timeEnd("loadMongoBenchmarkData")
    await showCesiumGeojsonBenchmark('OfficeMongoBenchmark');
}


async function showCesiumGeojsonBenchmark(layerName) {

    let newLayer = geoJsonLayers[layerName]; // 从全局变量中选择相应的数据

    if (newLayer) {
        try {
            console.time('showCesiumGeoJSON Benchmark - addDataSource');
            await viewer.dataSources.add(newLayer);
            console.timeEnd('showCesiumGeoJSON Benchmark - addDataSource');
            myCesiumLayers.push({ name: layerName, dataSource: newLayer });
            console.time('showCesiumGeoJSON Benchmark - display');

            // 使用回调函数在 requestAnimationFrame 之后执行代码
            requestAnimationFrame(() => {
                console.timeEnd('showCesiumGeoJSON Benchmark - display');
                console.timeEnd('showCesiumGeoJSON Benchmark - total');
            });

        } catch (error) {
            console.error('Error in adding GeoJSON:', error);
            throw error; // 重新抛出错误以便在上层捕获
        }
    } else {
        console.error('GeoJSON data not found for layer:', layerName);
        console.timeEnd('showCesiumGeoJSON Benchmark');
    }
}

async function showTileset(id) {
    // console.log('Add Tile1: ', tilesetBim);
    if (!viewer.scene.primitives.contains(tilesetBim)) {
        tilesetBim = await Cesium.Cesium3DTileset.fromIonAssetId(id);
        viewer.scene.primitives.add(tilesetBim);
    }
    // 等待 tilesetBim 准备好
    await tilesetBim.readyPromise;

    // 设置模型的颜色样式
    tilesetBim.style = new Cesium.Cesium3DTileStyle({
        color: 'color("red", 0.3)' // 将颜色设置为红色
    });
    // console.log('Add Tile2: ', tilesetBim);

    var heightOffset = 46; // 将100.0替换为你的模型需要的高度
    var boundingSphere = tilesetBim.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + heightOffset);
    var translation = Cesium.Cartesian3.subtract(surfacePosition, boundingSphere.center, new Cesium.Cartesian3());
    tilesetBim.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

    // await viewer.zoomTo(tilesetBim);
}

async function show3dTiles(){
    console.time("show3dTiles Benchmark")
    await showTileset(2689749);
    console.timeEnd('show3dTiles Benchmark');
}