"use strict"

let tilesetBim;
let tilesetCity;

let geoJsonLayers = {};

function loadCesiumGeoJSON(url, layerName) {
    return new Promise((resolve, reject) => {
        let newLayer = new Cesium.GeoJsonDataSource();

        newLayer.load(url).then(() => {
            geoJsonLayers[layerName] = newLayer; 
            resolve(newLayer);
        }).catch((error) => {
            console.error('Error loading GeoJSON:', error);
            reject(error);
        });
    });
}

async function loadCesiumGeoJSON(url, layerName) {
    let newLayer = new Cesium.GeoJsonDataSource();
    await newLayer.load(url);
    geoJsonLayers[layerName] = newLayer; 
    return newLayer;
}

async function loadCesiumGeoJSON(url, layerName) {
    // Start total time tracking
    try {
        let newLayer = new Cesium.GeoJsonDataSource();
        await newLayer.load(url); // Time tracking for loading
        await viewer.dataSources.add(newLayer); // Time tracking for adding data source
        myCesiumLayers.push({ name: layerName, dataSource: newLayer });
        
        // Use a callback function to execute code after requestAnimationFrame,
        requestAnimationFrame(() => {
            // Time tracking for display
            // End total time tracking
        });
        

    } catch (error) {
        console.error('Error when loading GeoJSON:', error);
        console.timeEnd('loadCesiumGeoJSON - total'); // End total time tracking if an error occurs
        throw error;
    }
}


async function loadCesiumIonGeoJSON(assetId, layerName) {
    try {
        let resource = await Cesium.IonResource.fromAssetId(assetId);
        let dataSource = await Cesium.GeoJsonDataSource.load(resource);
        geoJsonLayers[layerName] = dataSource;
        console.log(`GeoJSON data for ${layerName} loaded and stored globally.`);
    } catch (error) {
        console.error('Error loading GeoJSON from Cesium Ion:', error);
    }
}


async function showCesiumGeoJSON(layerName, fillAlpha_material = 0.5, fillAlpha_outline = 0.5, fillColor = Cesium.Color.GRAY, strokeColor = Cesium.Color.DARKGRAY, fitBounds = false) {

    console.time('show showCesiumGeoJSON ' + layerName);
    let newLayer = geoJsonLayers[layerName]; 

    if (newLayer) {
        await viewer.dataSources.add(newLayer).then(() => {

            let entities = newLayer.entities.values;
            for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                if (entity.polygon) {
                    entity.polygon.material = fillColor.withAlpha(fillAlpha_material);  
                    entity.polygon.outline = true;  
                    entity.polygon.outlineColor = strokeColor.withAlpha(fillAlpha_outline);  
                    entity.polygon.outlineWidth = 1;  
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


async function showCesiumGeojsonBenchmark(layerName) {
    console.time('showCesiumGeoJSON Benchmark');

    let newLayer = geoJsonLayers[layerName]; 

    if (newLayer) {
        try {
            console.time('showCesiumGeoJSON Benchmark - addDataSource');
            await viewer.dataSources.add(newLayer);
            console.timeEnd('showCesiumGeoJSON Benchmark - addDataSource');
            myCesiumLayers.push({ name: layerName, dataSource: newLayer });
            console.time('showCesiumGeoJSON Benchmark - display');

            
            requestAnimationFrame(() => {
                console.timeEnd('showCesiumGeoJSON Benchmark - display');
                console.timeEnd('showCesiumGeoJSON Benchmark');
            });

        } catch (error) {
            console.error('Error in adding GeoJSON:', error);
            throw error; 
        }
    } else {
        console.error('GeoJSON data not found for layer:', layerName);
        console.timeEnd('showCesiumGeoJSON Benchmark');
    }
}





async function loadCesiumIonAsset() {
    // 初始化 Cesium Viewer
    try {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWIyM2M2ZS1hNzg4LTRlZmMtYWFiOC00ZmU2MDcxOTU0NTAiLCJpZCI6MjI5NjQzLCJpYXQiOjE3MjE1MjI0MDF9.oCzgX5tlczqvk8Yt-b_ZhRBOsSXHzc-cs3eED2JHQ4c';

        // let assetId = 2689695;
        // let tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);
        // viewer.scene.primitives.add(tileset);

        await showTilesetCity(2689695);
        await showTileset(2689749);
        

        // if (fitBimBounds){
        //     viewer.zoomTo(geoJsonLayers['OfficeWallsPostgre']);
        // }

        getPostgreSqlFloorsData();
        getPostgreSqlCeilingsData();
        getPostgreSqlDoorsData();
        getPostgreSqlWallsData();
        getPostgreSqlWindowsData();
        getPostgreSqlRoomData();

        getPostgreSqlRoomFurnitureData();


    } catch (error) {
        console.error('Error loading Cesium Ion asset:', error);
    }
}

async function loadCesiumIonAsset_forUpdateFeature() {

    try {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWIyM2M2ZS1hNzg4LTRlZmMtYWFiOC00ZmU2MDcxOTU0NTAiLCJpZCI6MjI5NjQzLCJpYXQiOjE3MjE1MjI0MDF9.oCzgX5tlczqvk8Yt-b_ZhRBOsSXHzc-cs3eED2JHQ4c';
        // let assetId = 2689695;
        // let tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);
        // viewer.scene.primitives.add(tileset);

        // await showTilesetCity(2689695);
        // await showTileset(2689749);

        // if (fitCityBounds){
        //     viewer.zoomTo(tilesetCity);
        // }
        // if (fitBimBounds){
        //     viewer.zoomTo(geoJsonLayers['OfficeWallsPostgre']);
        // }

        await getPostgreSqlFloorsData();
        await getPostgreSqlCeilingsData();
        await getPostgreSqlDoorsData();
        await getPostgreSqlWallsData();
        await getPostgreSqlWindowsData();
        await getPostgreSqlRoomData();

        await getPostgreSqlRoomFurnitureData();


    } catch (error) {
        console.error('Error loading Cesium Ion asset:', error);
    }
}




// ##########################
async function zoomLayeringCesium() {
    // console.time('addLayerTime'); 
    var cameraPosition = viewer.scene.camera.positionWC;
    // 设定特定的经纬度和高度
    var longitude = -0.121337; 
    var latitude = 51.5396; 
    var height = 76.768; 

    // 将经纬度和高度转换为世界坐标系中的坐标
    var targetPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    var distance = Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(cameraPosition, targetPosition, new Cesium.Cartesian3()));
    // console.log('Cesium cameraPosition loaded:', cameraPosition);
    // console.log('Cesium ellipsoidPosition loaded:', ellipsoidPosition);
    // console.log('Cesium distance loaded:', distance);

    // var dataSources = viewer.dataSources; 
    // var existingLayerNames = dataSources._dataSources.map(dataSource => dataSource.name); 

    // console.log("Layers dataSources: ", viewer.dataSources)
    // console.log('Layer already exists:', layerName);

    if (distance > 50) {
        // Remove GeoJSON data and vis tile model
        await removeAllLayers();
        await showTileset(2689749);

        // For test, display exterior
        // await removeExceptFstTilesets();
        if (!myCesiumLayers.some(layer => layer.name === "OfficeFloorsPostgre")) { 
            // console.log(anyLayersExist)
            // removeLayer(); 
            // await showExterior();
            // await showFurni();
        }
    }
    else if (distance < 40 && distance > 20) {

        removeLayer('OfficeRoomFurniture');

        if (!myCesiumLayers.some(layer => layer.name === "OfficeFloorsPostgre")) { 

            // Remove tiles model
            await removeExceptFstTilesets();
            await showExterior();

        }
    }
    else if (distance < 15) {
        // console.log("existingLayerNamesFurni: ",existingLayerNames)
        if (!myCesiumLayers.some(layer => layer.name === "OfficeFloorsPostgre")) { 

            // Remove tiles model
            await showExterior();

        }
        if (!myCesiumLayers.some(layer => layer.name === "OfficeRoomFurniture")) { // 检查是否已经存在 "Furni" 图层

            // Remove GeoJSON data and Display detailed model
            await removeTileset(tilesetBim);
            await showFurni();
        }
    }

    // console.timeEnd('addLayerTime'); 

}

async function showExterior() {
    // 
    showDiv('cesiumWrapper');

    // console.log(geoJsonLayers);
    // console.log(myCesiumLayers);

    // Remove tiles model
    // await removeExceptFstTilesets();

    showCesiumGeoJSON('OfficeFloorsPostgre', 0.5, 0.1);
    showCesiumGeoJSON('OfficeCeilingsPostgre', 0.5, 0.1);
    showCesiumGeoJSON('OfficeDoorsPostgre', 0.5, 0.1);
    showCesiumGeoJSON('OfficeWallsPostgre', 0.5, 0.1);
    showCesiumGeoJSON('OfficeWindowsPostgre');

    // await loadCesiumGeoJSON(layerURL_Ext, "Exterior", false);
    // await loadCesiumGeoJSON2(layerURL_Flr, "OfficeFloors");
    // await loadCesiumGeoJSON(layerURL_Wal, 'Wall');
    // await loadCesiumGeoJSON(layerURL_Clg, "Ceilings");
    // await loadCesiumGeoJSON(layerURL_Win, "Windows");
    // await loadCesiumGeoJSON3(layerURL_Cpt, "Computer");
    // await loadCesiumGeoJSON3(layerURL_Bmk, "Benchmark");


    // showCesiumGeoJSON('OfficeExterior');

    // showCesiumGeoJSON('OfficeFloors');
    // showCesiumGeoJSON('OfficeCeilings',Cesium.Color.GRAY, Cesium.Color.DARKGRAY, 0.1);
    // showCesiumGeoJSON('OfficeWall');
    // showCesiumGeoJSON('OfficeWindows');
    // showCesiumGeoJSON('OfficeDoors');

    showCesiumGeoJSON('OfficeRoomTarget', 0.5, 0.1, Cesium.Color.YELLOW, Cesium.Color.YELLOW);




}

async function showFurni() {
    // 先显示 Cesium 地图，以防它没有显示
    showDiv('cesiumWrapper');
    // showCesiumGeoJSON('OfficeFloors');
    // showCesiumGeoJSON("TestComputer1");
    // showCesiumGeoJSON("TestFurniture1");
    // await loadCesiumGeoJSON(layerURL_Clg, "Ceilings");

    // showCesiumGeoJSON('OfficeCeilings');
    // showCesiumGeoJSON('OfficeWall');
    // showCesiumGeoJSON('OfficeFloors');
    // showCesiumGeoJSON('OfficeRoomTarget',Cesium.Color.YELLOW);
    showCesiumGeoJSON('OfficeRoomFurniture', 1, 0.1, Cesium.Color.RED, Cesium.Color.RED);

}


async function removeAllLayers() {
    // console.time('removeAllLayers');
    // console.log('exist layer num: ', myCesiumLayers.length);
    let length = myCesiumLayers.length;
    for (let i = length - 1; i >= 0; i--) {
        // console.log('removing layer: ', myCesiumLayers[i]);
        await viewer.dataSources.remove(myCesiumLayers[i].dataSource);
        myCesiumLayers.splice(i, 1);

    }
    // console.log('myCesiumLayers', myCesiumLayers);
    // console.log('myCesiumLayers length', length);
    // console.log('layers removed, exist layer num: ',myCesiumLayers.length);
    // console.timeEnd('removeAllLayers');
}

// async function removeAllLayers() {
//     console.time('removeAllLayers');
//     console.log('myCesiumLayers', myCesiumLayers);

//     let length = myCesiumLayers.length;
//     console.log('myCesiumLayers length', length);

//     for (let i = length - 1; i >= 0; i--) {
//         console.log('removing layer: ', myCesiumLayers[i]);
//         await viewer.dataSources.remove(myCesiumLayers[i].dataSource, true); // The second parameter ensures complete removal
//         myCesiumLayers.splice(i, 1);
//     }

//     console.log('layers removed, exist layer num: ', myCesiumLayers.length);
//     console.timeEnd('removeAllLayers');
// }


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
            break; 
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
    // console.log('Add Tile1: ', tilesetBim);
    if (!viewer.scene.primitives.contains(tilesetBim)) {
        tilesetBim = await Cesium.Cesium3DTileset.fromIonAssetId(id);
        viewer.scene.primitives.add(tilesetBim);
    }
    // 等待 tilesetBim 准备好
    await tilesetBim.readyPromise;

    // 设置模型的颜色样式
    tilesetBim.style = new Cesium.Cesium3DTileStyle({
        color: 'color("red", 0.3)'
    });
    // console.log('Add Tile2: ', tilesetBim);

    var heightOffset = 46;
    var boundingSphere = tilesetBim.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + heightOffset);
    var translation = Cesium.Cartesian3.subtract(surfacePosition, boundingSphere.center, new Cesium.Cartesian3());
    tilesetBim.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

    // await viewer.zoomTo(tilesetBim);
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

    // 设置模型的颜色样式
    // if (color == ture) {
    //     tileset.style = new Cesium.Cesium3DTileStyle({
    //         color: 'color("red")' // 将颜色设置为红色
    //     });
    //     console.log('Add Tile2: ', tileset);
    // }
    // tilesetCity.style = new Cesium.Cesium3DTileStyle({
    //     color: "color('black',0.7)"
    // });
    // if (height == ture) {
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
    console.log('Remove Tile1: ', tileset);
    if (viewer.scene.primitives.contains(tileset)) {
        viewer.scene.primitives.remove(tileset);
    }
    console.log('Remove Tile2: ', tileset);
}

async function removeExceptFstTilesets() {
    let primitives = viewer.scene.primitives;
    let length = primitives.length;
    // console.log('Remove Tile all: ', tilesetBim);
    // for (let i = length - 1; i >= 0; i--) {
    //     let primitive = primitives.get(i);
    //     if (primitive instanceof Cesium.Cesium3DTileset) {
    //         primitives.remove(primitive);
    //     }
    // }
    if (length == 0) { return; }
    for (let i = length - 1; i > 0; i--) {
        let primitive = primitives.get(i);
        if (primitive instanceof Cesium.Cesium3DTileset) {
            primitives.remove(primitive);
        }
    }
    // console.log('Remove Tile all: ', tilesetBim);
    // console.log('All tilesets removed');
}

function setZoomFactor(factor) {
    viewer.scene.screenSpaceCameraController._zoomFactor = factor;
}

async function RemoveTileset() {
    removeTileset(tilesetBim);
}

async function AddBimTileset() {
    showTileset(2689749);
}

async function removeAllGeojson() {
    removeAllLayers();
    geoJsonLayers = {};

}

async function testAddGeo() {
    console.time('testAddGeo'); 
    let test = 'data\\OfficeComputerQgis_modi.geojson';
    // await loadCesiumGeoJSON(test, "Test");
    // let resource = await Cesium.IonResource.fromAssetId(2682098);
    // let dataSource = await Cesium.GeoJsonDataSource.load(resource);

    // await loadCesiumGeoJSON(test, "Test").then((newLayer) => {
    //     console.log('GeoJSON data loaded and stored globally.');
    // }).catch((error) => {
    //     console.error('Error:', error);
    // });
    let startTime = performance.now();

    loadCesiumIonGeoJSON(2682420, 'TestComputer1');
    // loadCesiumIonGeoJSON(2682424,'TestComputer2');
    // loadCesiumIonGeoJSON(2682425,'TestComputer3');
    // loadCesiumIonGeoJSON(2682426,'TestComputer4');
    // loadCesiumIonGeoJSON(2682427,'TestComputer5');
    // loadCesiumIonGeoJSON(2682428,'TestComputer6');
    // loadCesiumIonGeoJSON(2682429,'TestComputer7');
    // loadCesiumIonGeoJSON(2682458,'CubeComputer');
    loadCesiumIonGeoJSON(2682742, 'TestFurniture1');



    // await loadCesiumGeoJSON(test, "Test").then((newLayer) => {
    //     console.log('GeoJSON data loaded and stored globally.');
    // }).catch((error) => {
    //     console.error('Error:', error);
    // });

    let endTime = performance.now(); 
    let add2MapTime = endTime - startTime; 
    console.log(`GeoJSON data added to map in ${add2MapTime.toFixed(2)} ms`);
    console.timeEnd('testAddGeo'); 
    // showCesiumGeoJSON("Test");

}

async function showAddGeo() {
    showExterior();
    showFurni();
}


function loadCesiumGeoJSON1(url, layerName, fitBounds) {
    return new Promise((resolve, reject) => {
        let newLayer = new Cesium.GeoJsonDataSource();
        newLayer.load(url).then(() => {
            viewer.dataSources.add(newLayer);
            if (fitBounds) {
                viewer.flyTo(newLayer);
            }
            myCesiumLayers.push({ name: layerName, dataSource: newLayer });
            // console.log('myCesiumLayers: ', myCesiumLayers);
            resolve();
        }).catch((error) => {
            console.error('Error loading GeoJSON:', error);
            reject(error);
        });
    });
}

function loadCesiumGeoJSON2(url, layerName, fillColor = Cesium.Color.GRAY, strokeColor = Cesium.Color.DARKGRAY, fitBounds = false) {
    return new Promise((resolve, reject) => {
        let newLayer = new Cesium.GeoJsonDataSource();
        newLayer.load(url).then(() => {
            viewer.dataSources.add(newLayer);

            
            let entities = newLayer.entities.values;
            for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                if (entity.polygon) {
                    entity.polygon.material = fillColor.withAlpha(0.5);  
                    entity.polygon.outline = true;  
                    entity.polygon.outlineColor = strokeColor;  
                    entity.polygon.outlineWidth = 1;  
                }
            }

            if (fitBounds) {
                viewer.flyTo(newLayer);
            }
            myCesiumLayers.push({ name: layerName, dataSource: newLayer });
            resolve();
        }).catch((error) => {
            console.error('Error loading GeoJSON:', error);
            reject(error);
        });
    });
}

async function loadCesiumGeoJSON3(url, layerName, fitBounds = false) {
    console.time('loadCesiumGeoJSON - total'); 

    try {
        let newLayer = new Cesium.GeoJsonDataSource();

        console.time('loadCesiumGeoJSON - load');
        await newLayer.load(url);
        console.timeEnd('loadCesiumGeoJSON - load'); 

        console.time('loadCesiumGeoJSON - addDataSource');
        viewer.dataSources.add(newLayer);
        console.timeEnd('loadCesiumGeoJSON - addDataSource'); 


        // console.time('loadCesiumGeoJSON - style');
        // let entities = newLayer.entities.values;
        // for (let i = 0; i < entities.length; i++) {
        //     let entity = entities[i];
        //     if (entity.polygon) {
        //         entity.polygon.material = fillColor.withAlpha(0.5);  
        //         entity.polygon.outline = true;  
        //         entity.polygon.outlineColor = strokeColor;  
        //         entity.polygon.outlineWidth = 1; 
        //     }
        // }
        // console.timeEnd('loadCesiumGeoJSON - style'); 

        console.time('loadCesiumGeoJSON - flyTo');
        if (fitBounds) {
            await viewer.flyTo(newLayer);
        }
        console.timeEnd('loadCesiumGeoJSON - flyTo');

        myCesiumLayers.push({ name: layerName, dataSource: newLayer });

        console.time('loadCesiumGeoJSON - display');

        await new Promise(requestAnimationFrame);
        console.timeEnd('loadCesiumGeoJSON - display');
        
        console.timeEnd('loadCesiumGeoJSON - total'); 

    } catch (error) {
        console.error('Error loading GeoJSON or flying to new layer:', error);
        console.timeEnd('loadCesiumGeoJSON - total'); 
        throw error;
    }
}


async function addDataGeoJSON() {
    // first show the Cesium map just in case it is not visible
    console.time('addDataGeoJSON'); 
    showDiv('cesiumWrapper');

    let layerURL2 = "./data/OfficeExteriorQgis_modiZ0.geojson";
    await loadCesiumGeoJSON(layerURL2, "Floors", true);
    console.timeEnd('addDataGeoJSON'); 
}

function findLayerByName(viewer, layers, layerName) {
    for (let i = 0; i < layers.length; i++) {
        let dataSource = viewer.dataSources.get(layers[i].dataSource);
        if (layers[i].name == layerName) {
            return i;
        }
    }
    return null; 
}

async function addPostgreSqlBenchmark() {
    console.time("getPostgreSqlBenchmarkData")
    await getPostgreSqlBenchmarkData();
    console.timeEnd("getPostgreSqlBenchmarkData")
}

async function showPostgreSqlBenchmark() {
    console.time("showBmkData")
    await showCesiumGeojsonBenchmark('OfficePostgreSqlBenchmark');
    console.timeEnd("showBmkData")
}

async function addMongoBenchmark() {
    console.time("getMongoBenchmarkData")
    await getMongoBenchmarkData('OfficeMongoBenchmark');
    console.timeEnd("getMongoBenchmarkData")
}

async function showMongoBenchmark() {
    console.time("getMongoBenchmarkData")
    await showCesiumGeojsonBenchmark('OfficeMongoBenchmark');
    console.timeEnd("getMongoBenchmarkData")
}


