"use strict"

let positions = [];
let isMeasuring = false;
let isBoundingBoxActive = false;
let startPosition;
let selectionRectangleEntity;

let featureTypes = {
    doors: {
        regex: /^(door|doors)$/i,
        layerKey: 'OfficeDoorsPostgre',
        highlightKey: 'OfficeHightlightDoors'
    },
    windows: {
        regex: /^(window|windows)$/i,
        layerKey: 'OfficeWindowsPostgre',
        highlightKey: 'OfficeHightlightWindows'
    },
    walls: {
        regex: /^(wall|walls)$/i,
        layerKey: 'OfficeWallsPostgre',
        highlightKey: 'OfficeHightlightWalls'
    },
    floors: {
        regex: /^(floor|floors)$/i,
        layerKey: 'OfficeFloorsPostgre',
        highlightKey: 'OfficeHightlightFloors'
    },
    ceilings: {
        regex: /^(ceiling|ceilings)$/i,
        layerKey: 'OfficeCeilingsPostgre',
        highlightKey: 'OfficeHightlightCeilings'
    }
};

let flagHide = false;

// Search function

async function selectFeatures(query) {
    const normalizedQuery = query.trim().toLowerCase();

    let featureFound = false;

    for (const featureType in featureTypes) {
        if (featureTypes[featureType].regex.test(normalizedQuery)) {
            alert('Searching for: ' + normalizedQuery);
            await defaultColor();
            geoJsonLayers[featureTypes[featureType].highlightKey] = geoJsonLayers[featureTypes[featureType].layerKey];
            removeLayer(featureTypes[featureType].layerKey);
            showCesiumGeoJSON(featureTypes[featureType].highlightKey, 0.5, 0.1, Cesium.Color.LIME, Cesium.Color.LIME);
            featureFound = true;
            break;
        }
    }

    if (!featureFound) {
        alert('Search Not Found');
    }
}


async function defaultColor() {
    await removeAllLayers();
    await showCesiumGeoJSON('OfficeFloorsPostgre', 0.5, 0.1);
    await showCesiumGeoJSON('OfficeCeilingsPostgre', 0.5, 0.1);
    await showCesiumGeoJSON('OfficeDoorsPostgre', 0.5, 0.1);
    await showCesiumGeoJSON('OfficeWallsPostgre', 0.5, 0.1);
    await showCesiumGeoJSON('OfficeWindowsPostgre');
    await showCesiumGeoJSON('OfficeRoomTarget', 0.5, 0.1, Cesium.Color.YELLOW, Cesium.Color.YELLOW);
}


async function hideShowObject() {
    console.log("Feature Value, id: ", picked_object, picked_object_id);

    if (flagHide == false) {
        for (const featureType in featureTypes) {
            if (featureTypes[featureType].regex.test(picked_object)) {
                flagHide = true;
                removeLayer(featureTypes[featureType].layerKey);
                break;
            }
        }
    }


    else if (flagHide == true) {
        for (const featureType in featureTypes) {
            if (featureTypes[featureType].regex.test(picked_object)) {
                showCesiumGeoJSON(featureTypes[featureType].layerKey)
                console.log('LayerKey', featureTypes[featureType].layerKey)
                console.log('flagHide', flagHide)
                flagHide = false;
                break;
            }
        }
    }

}

// Measure Toggler
function toggleMeasure() {
    isMeasuring = !isMeasuring;
    const measureLink = document.getElementById('measureLink');
    measureLink.textContent = isMeasuring ? 'Measuring...' : 'Measure';
    if (!isMeasuring) {
        positions = []; // Reset positions if measurement is canceled
    }
}


// Bounding Box Selection 

let startPoint;
let orgStartPoint;
// let orgEndPoint;
let selectionBox;
let isSelecting = false;
let clickHandler_bbox = true;
let stPickedPosition;
let selectedEntities = [];

function bboxSelect_org() {
    if (handler) {
        handler.destroy();
    }

    viewer.scene.screenSpaceCameraController.enableRotate = false;
    viewer.scene.screenSpaceCameraController.enableTranslate = false;
    viewer.scene.screenSpaceCameraController.enableZoom = false;
    viewer.scene.screenSpaceCameraController.enableTilt = false;
    viewer.scene.screenSpaceCameraController.enableLook = false;
    disableClickHandler();
    // viewer.infoBox.viewModel.showInfo = false;

    handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction(async function (click) {
        if (!isSelecting) {
            isSelecting = true;

            const canvasPosition = viewer.canvas.getBoundingClientRect();
            startPoint = {
                x: click.position.x + canvasPosition.left,
                y: click.position.y + canvasPosition.top
            };
            orgStartPoint = {
                x: click.position.x,
                y: click.position.y
            };
            stPickedPosition = viewer.scene.pickPosition(orgStartPoint);

            // console.log(click.position);
            // console.log(canvasPosition);
            if (!selectionBox) {
                selectionBox = document.createElement('div');
                selectionBox.id = 'selectionBox';
                document.body.appendChild(selectionBox);
            }

            selectionBox.style.left = startPoint.x + 'px';
            selectionBox.style.top = startPoint.y + 'px';
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
            selectionBox.style.display = 'block';

        } else {
            selectedEntities.forEach(entity => {
                entity.polygon.material = Cesium.Color.RED.withAlpha(0.5);
                entity.polygon.outlineColor = Cesium.Color.RED.withAlpha(0.5);
            });
            selectedEntities = [];
            isSelecting = false;
            selectionBox.style.display = 'none';

            const canvasPosition = viewer.canvas.getBoundingClientRect();
            const endPoint = {
                x: click.position.x + canvasPosition.left,
                y: click.position.y + canvasPosition.top
            };

            const orgEndPoint = {
                x: click.position.x,
                y: click.position.y
            };

            // not
            // const pickedObjects = viewer.scene.drillPick(new Cesium.BoundingRectangle(
            //     Math.min(orgStartPoint.x, orgEndPoint.x),
            //     Math.min(orgStartPoint.y, orgEndPoint.y),
            //     Math.abs(orgEndPoint.x - orgStartPoint.x),
            //     Math.abs(orgEndPoint.y - orgStartPoint.y)
            // ));

            // use lon lat
            let endPickedPosition = viewer.scene.pickPosition(orgEndPoint);
            let pointLonLat = pointsToLonLat(viewer, stPickedPosition, endPickedPosition);
            console.log("orgStartPoint", orgStartPoint);
            console.log("orgEndPoint", orgEndPoint);

            let cornerPoint1 = {
                x: orgStartPoint.x + orgEndPoint.x,
                y: orgStartPoint.y
            };

            let cornerPoint2 = {
                x: orgStartPoint.x,
                y: orgStartPoint.y + orgEndPoint.y
            };

            let cornerPoint1Pos = viewer.scene.pickPosition(cornerPoint1);
            let cornerPoint2Pos = viewer.scene.pickPosition(cornerPoint2);
            let pointLonLatCor = pointsToLonLat(viewer, cornerPoint1Pos, cornerPoint2Pos);
            console.log("cornerPoint1", cornerPoint1);
            console.log("cornerPoint2", cornerPoint2);

            const west = Math.min(pointLonLat.start.lon, pointLonLat.end.lon);
            const east = Math.max(pointLonLat.start.lon, pointLonLat.end.lon);
            const south = Math.min(pointLonLat.start.lat, pointLonLat.end.lat);
            const north = Math.max(pointLonLat.start.lat, pointLonLat.end.lat);
            // console.log(viewer.dataSources);

            // let dataSourceNum = 4;
            // console.log(viewer.dataSources);
            let dataSourceNum = findLayerByName(viewer, myCesiumLayers, 'OfficeRoomFurniture');
            // console.log('dataSourceNum',dataSourceNum);
            if (viewer.dataSources.get(dataSourceNum)) {
                viewer.dataSources.get(dataSourceNum).entities.values.forEach(entity => {
                    const polygon = entity.polygon;
                    if (polygon) {
                        // console.log('polygon:', polygon);
                        const positions = polygon.hierarchy.getValue().positions;
                        // console.log('poly', polygon);
                        // console.log('polyPos', positions);
                        positions.forEach(async position => {
                            const cartographic = Cesium.Cartographic.fromCartesian(position);
                            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                            // console.log('polyLonLat', longitude,latitude);
                            // console.log('wesn',west,east,south,north);
                            if (longitude >= west && longitude <= east && latitude >= south && latitude <= north) {
                                selectedEntities.push(entity);
                                console.log(entity);
                                entity.polygon.material = Cesium.Color.LIME.withAlpha(0.7);
                                entity.polygon.outlineColor = Cesium.Color.LIME.withAlpha(0.1);
                                viewer.scene.requestRender();
                            }
                        });
                    }
                });
            }





            console.log('Selected Entities:', selectedEntities);
            // console.log('pickedObjects:', pickedObjects);
            // console.log('startPoint:', orgStartPoint);
            // console.log('endPoint:', orgEndPoint);
            // console.log('pointLonLat:', pointLonLat);


            // let endPickedPosition = viewer.scene.pickPosition(orgEndPoint);
            console.log('Start Point:', stPickedPosition);
            console.log('End Point:', endPickedPosition);

            viewer.scene.screenSpaceCameraController.enableRotate = true;
            viewer.scene.screenSpaceCameraController.enableTranslate = true;
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            viewer.scene.screenSpaceCameraController.enableTilt = true;
            viewer.scene.screenSpaceCameraController.enableLook = true;
            // viewer.infoBox.viewModel.showInfo = true; 


            handler.destroy();
            await enableClickHandler();
            loadHandler();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (movement) {
        if (isSelecting) {
            const canvasPosition = viewer.canvas.getBoundingClientRect();
            const currentPoint = {
                x: movement.endPosition.x + canvasPosition.left,
                y: movement.endPosition.y + canvasPosition.top
            };

            selectionBox.style.left = Math.min(startPoint.x, currentPoint.x) + 'px';
            selectionBox.style.top = Math.min(startPoint.y, currentPoint.y) + 'px';
            selectionBox.style.width = Math.abs(currentPoint.x - startPoint.x) + 'px';
            selectionBox.style.height = Math.abs(currentPoint.y - startPoint.y) + 'px';
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}

// bbSelect

function bboxSelect() {
    if (handler) {
        handler.destroy();
    }

    // 禁用Cesium默认的鼠标操作
    viewer.scene.screenSpaceCameraController.enableRotate = false;
    viewer.scene.screenSpaceCameraController.enableTranslate = false;
    viewer.scene.screenSpaceCameraController.enableZoom = false;
    viewer.scene.screenSpaceCameraController.enableTilt = false;
    viewer.scene.screenSpaceCameraController.enableLook = false;
    disableClickHandler();

    handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction(async function (click) {
        if (!isSelecting) {
            isSelecting = true;

            const canvasPosition = viewer.canvas.getBoundingClientRect();
            startPoint = {
                x: click.position.x + canvasPosition.left,
                y: click.position.y + canvasPosition.top
            };
            orgStartPoint = {
                x: click.position.x,
                y: click.position.y
            };
            stPickedPosition = viewer.scene.pickPosition(orgStartPoint);

            if (!selectionBox) {
                selectionBox = document.createElement('div');
                selectionBox.id = 'selectionBox';
                document.body.appendChild(selectionBox);
            }

            selectionBox.style.left = startPoint.x + 'px';
            selectionBox.style.top = startPoint.y + 'px';
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
            selectionBox.style.display = 'block';

        } else {
            selectedEntities.forEach(entity => {
                entity.polygon.material = Cesium.Color.RED.withAlpha(1);
                entity.polygon.outlineColor = Cesium.Color.RED.withAlpha(0.1);
            });
            selectedEntities = [];
            isSelecting = false;
            selectionBox.style.display = 'none';

            const canvasPosition = viewer.canvas.getBoundingClientRect();
            const endPoint = {
                x: click.position.x + canvasPosition.left,
                y: click.position.y + canvasPosition.top
            };

            const orgEndPoint = {
                x: click.position.x,
                y: click.position.y
            };

            let endPickedPosition = viewer.scene.pickPosition(orgEndPoint);

            let cornerPoint1 = {
                x: orgEndPoint.x,
                y: orgStartPoint.y
            };

            let cornerPoint2 = {
                x: orgStartPoint.x,
                y: orgEndPoint.y
            };


            let cornerPoint1Pos = screenToLonLat(viewer, cornerPoint1);
            let cornerPoint2Pos = screenToLonLat(viewer, cornerPoint2);
            let pointLonLat = pointsToLonLat(viewer, stPickedPosition, endPickedPosition);
            stPickedPosition = pointLonLat.start;
            endPickedPosition = pointLonLat.end;
            // let pointLonLatCor = pointsToLonLat(viewer, cornerPoint1Pos, cornerPoint2Pos);
            // let endPickedPositionCal = screenToLonLat(viewer, orgEndPoint)

            // console.log("cornerPoint1",cornerPoint1);
            // console.log("cornerPoint2",cornerPoint2);
            // console.log("orgStartPoint", orgStartPoint);
            // console.log("orgEndPoint", orgEndPoint);
            // console.log('cornerPoint1Pos', cornerPoint1Pos);
            // console.log('cornerPoint2Pos', cornerPoint2Pos);
            // console.log('b', b);
            // console.log('stPickedPosition', stPickedPosition);
            // console.log('endPickedPosition', endPickedPosition);
            // console.log('endPickedPositionCal', endPickedPositionCal);
            // console.log('pointLonLat', pointLonLat);
            // console.log('pointLonLatCor', pointLonLatCor);



            let cornerLonLats = [
                stPickedPosition,
                cornerPoint1Pos,
                endPickedPosition,
                cornerPoint2Pos
            ];

            console.log("cornerLonLats", cornerLonLats);

            let dataSourceNum = findLayerByName(viewer, myCesiumLayers, 'OfficeRoomFurniture');



            if (viewer.dataSources.get(dataSourceNum)) {
                const entities = viewer.dataSources.get(dataSourceNum).entities.values;
            
                let processedObjectIds = new Set();
            
                entities.forEach(entity => {
                    const polygon = entity.polygon;
                    if (polygon) {
                        const objectid = entity.properties.objectid.getValue(); 
                        if (processedObjectIds.has(objectid)) {
                            return; 
                        }
            
                        const positions = polygon.hierarchy.getValue().positions;

                        let inside = positions.some(position => {
                            const cartographic = Cesium.Cartographic.fromCartesian(position);
                            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                            return isPointInPolygon({ lon: longitude, lat: latitude }, cornerLonLats);
                        });
            
                        if (inside) {
                            entities.forEach(ent => {
                                if (ent.properties.objectid.getValue() === objectid) {
                                    selectedEntities.push(ent);
                                    ent.polygon.material = Cesium.Color.LIME.withAlpha(1);
                                    ent.polygon.outlineColor = Cesium.Color.LIME.withAlpha(0.1);
                                }
                            });
            
                            
                            processedObjectIds.add(objectid);
            
                            
                            viewer.scene.requestRender();
                        }
                    }
                });
            }

            console.log('Selected Entities:', selectedEntities);

            viewer.scene.screenSpaceCameraController.enableRotate = true;
            viewer.scene.screenSpaceCameraController.enableTranslate = true;
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            viewer.scene.screenSpaceCameraController.enableTilt = true;
            viewer.scene.screenSpaceCameraController.enableLook = true;

            handler.destroy();
            await enableClickHandler();
            loadHandler();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (movement) {
        if (isSelecting) {
            const canvasPosition = viewer.canvas.getBoundingClientRect();
            const currentPoint = {
                x: movement.endPosition.x + canvasPosition.left,
                y: movement.endPosition.y + canvasPosition.top
            };

            selectionBox.style.left = Math.min(startPoint.x, currentPoint.x) + 'px';
            selectionBox.style.top = Math.min(startPoint.y, currentPoint.y) + 'px';
            selectionBox.style.width = Math.abs(currentPoint.x - startPoint.x) + 'px';
            selectionBox.style.height = Math.abs(currentPoint.y - startPoint.y) + 'px';
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

// 检查一个点是否在多边形内
function isPointInPolygon(point, polygon) {
    let x = point.lon, y = point.lat;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].lon, yi = polygon[i].lat;
        let xj = polygon[j].lon, yj = polygon[j].lat;

        let intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function getRectanglePoints(start, end) {
    const xMin = Math.min(start.x, end.x);
    const xMax = Math.max(start.x, end.x);
    const yMin = Math.min(start.y, end.y);
    const yMax = Math.max(start.y, end.y);

    return [
        new Cesium.Cartesian2(xMin, yMin),
        new Cesium.Cartesian2(xMax, yMin),
        new Cesium.Cartesian2(xMax, yMax),
        new Cesium.Cartesian2(xMin, yMax)
    ];
}
//////////////////////



async function enableClickHandler() {
    clickHandler_bbox = await viewer.screenSpaceEventHandler.setInputAction(function (click) {
        const pickedObject = viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
            viewer.selectedEntity = pickedObject.id;  
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function disableClickHandler() {
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    clickHandler_bbox = null;
}

function screenToLonLat(viewer, screenPosition) {
    // let ellipsoid = Cesium.Ellipsoid.WGS84;
    // let cartesian = viewer.scene.camera.pickEllipsoid(screenPosition, ellipsoid);
    // var cartesian = viewer.scene.camera.pickEllipsoid(screenPosition, viewer.scene.ellipsoid);
    var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(screenPosition), viewer.scene);

    if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        return { lon, lat };
    }
    return null;
}


function coordinateToLonLat(viewer, crdPosition) {

    const cartographic = Cesium.Cartographic.fromCartesian(crdPosition);
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    return { lon, lat };

}

function lonLatToScreen(viewer, lon, lat) {
    const cartesian = Cesium.Cartesian3.fromDegrees(lon, lat);
    const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);
    return screenPosition;
}

function pointsToLonLat(viewer, stPickedPosition, endPickedPosition) {
    let stPickedPositionDg = coordinateToLonLat(viewer, stPickedPosition);
    let enPickedPositionDg = coordinateToLonLat(viewer, endPickedPosition);

    return {
        start: stPickedPositionDg,
        end: enPickedPositionDg
    };
}

// Modify data
function openDialog() {
    console.log("Feature Value, id: ", picked_object, picked_object_id);
    var dialog = document.getElementById('BimVisForm');
    const assetLabel = document.getElementById('assetLabel');
    assetLabel.innerText = 'Your selected object is ' + picked_object + ', ObjectId: ' + picked_object_id;
    // document.getElementById('assetId').value = '';
    document.getElementById('sug').value = '';
    document.getElementById('modiValue').value = '';
    document.querySelectorAll('input[name="attribute"]').forEach(input => {
        input.checked = false;
    });
    dialog.showModal();
}

// Function to close the dialog
function cancelSubmissionBim(event) {
    event.preventDefault();
    document.getElementById('BimVisForm').close();
}

// Function to handle form submission
function SubmissionBim(event) {
    event.preventDefault();
    // var assetId = document.getElementById('assetId').value;
    // var suggestions = document.getElementById('sug').value;
    // console.log('Asset ID:', assetId);
    // console.log('Suggestions:', suggestions);
    processBimData();
    document.getElementById('BimVisForm').close();
}


async function processBimData() {
    let objectId = picked_object_id;
    let basecatego = picked_object_baCate;
    let suggestions = document.getElementById('sug').value;
    let attribute = document.querySelector('input[name="attribute"]:checked').value;
    let modiValue = document.getElementById('modiValue').value;
    console.log('objectId:', objectId);
    console.log('Suggestions:', suggestions);

    let postString = {
        objectId: objectId,
        basecatego: basecatego,
        attribute: attribute,
        modiValue: modiValue,
        suggestions: suggestions
    };

    console.log(postString);


    let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/crud24/testCRUD";
    // console.log(serviceUrl);
    let ajax1 = $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function (result) {
            console.log(result);
        },
        data: postString
    });

    let serviceUrl2 = document.location.origin.replace(':4443', ':4480') + "/crud24/insertBimSuggestions";
    // console.log(serviceUrl2);
    let ajax2 = $.ajax({
        url: serviceUrl2,
        crossDomain: true,
        type: "POST",
        success: function (result) {
            console.log(result);
        },
        data: postString
    });

    let serviceUrl3 = document.location.origin.replace(':4443', ':4480') + "/crud24/updateBim";
    let ajax3 = $.ajax({
        url: serviceUrl3,
        crossDomain: true,
        type: "POST",
        success: function (result) {
            alert(result);
        },
        data: postString
    });



    $.when(ajax1, ajax2, ajax3).done(function () {
        console.log('Suggestions Posted.');
    });


    let formattedPostString = JSON.stringify(postString, null, 2);
    // alert(formattedPostString);
    await removeAllLayers();
    geoJsonLayers = {};
    await loadCesiumIonAsset_forUpdateFeature();
    await zoomLayeringCesium();
    // if (basecatego === 'SpecialtyEquipment' || basecatego === 'Furniture') {
    //     showFurni();
    // }
    // else {
    //     await removeExceptFstTilesets();
    //     await showExterior();
    // }

}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

