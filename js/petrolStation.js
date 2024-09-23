"use strict"

/**
 * 
 * a global variable to store the station layer once it has been added to the map
 * global as will need to be referened by the station remove functionality
 * 
 */

let petrolStationLayer;

/**
 * @function showPetrolStation
 * 
 * @description show the PetrolStation layer, assume that the data is stored in a data directory on the local server
 * 
 */

function showPetrolStation() {
    // as we are hosting the data on our server, we don't need to provide the full https:// ... detail
    let layerURL = document.location.origin + "/api/geojson24/getGeoJSON/cege0043/petrol_station/petrol_station_id/location";
    // If the layer was existed, remove it.
    if (petrolStationLayer) {
        mymap.removeLayer(petrolStationLayer);
    }

    $.ajax({
        url: layerURL,
        crossDomain: true,
        success: function (result) {
            // load the geoJSON layer
            petrolStationLayer = L.geoJson(result,
                {
                    // the onEachFeature command loops through every featulre in the GeoJSON dataset and creates the popup and style for each one
                    onEachFeature: function (f, l) {
                        l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
                    } // end of point to layer
                }).addTo(mymap);

            // change the map zoom so that all the data is shown
            mymap.fitBounds(petrolStationLayer.getBounds());

        }// end of the inner function
    }); // end of the ajax request
}

/**
 * @function 
 * 
 * @description show List of Petrol Stations with shortest queue times
 * 
 */
function showStationShortestQueue() {
    // alert("Functionality to do List of Petrol Stations with shortest queue times");


    let serviceUrl = document.location.origin + "/api/geojson24/petrolStationsWithFastQueues";
    console.log(serviceUrl);
    let data;
    let ajax = $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function (result) {
            console.log(result.array_to_json);
            data = result.array_to_json;
        },
    });
    $.when(ajax).done(function () {
        console.log('There are ' + data.length + ' stations with shortest queue times');
        let layerDialog = document.getElementById("listStationArray");
        let layerSelect = document.getElementById("listStationArraySelect");
        removeOptions(layerSelect);
        for (let i = 0; i < data.length; i++) {
            let option = document.createElement("option");
            option.text = data[i].petrol_station_name;
            layerSelect.add(option);
        }
        layerDialog.showModal();

    });


}



/**
 * @function 
 * 
 * @description show Bar graph showing number of Petrol stations within each queue time category
 * 
 */
function showStationBarGarph() {
    // alert("Functionality to do Bar graph showing number of Petrol stations within each queue time category");

    showDiv('assetDataWrapperWrapper');

    document.getElementById("assetDataWrapperWrapper").innerHTML = `
  <div>
    <button type="button" class="btn btn-primary ms-4" onclick="closeAssetData()">Close Graph</button>
    <div id="assetDataWrapper" class="vw-100" style="height:calc(100% - 165px); width:100%; border-color=blue; border-width=5px;"> 
    </div>
  </div>`;

    // we then need to set a short delay before we try to meaure the height and width of the DIV to hold the graph
    // this is because the height and width are not correctly set until the DIV is fully rendered
    // so use setTimeout to set the dealy - 1000 milli-seconds
    // and then call a function called measureDiv to measure the div and start loading the graph
    setTimeout(measureDivLoadPetrolGraph, 3000);
}

/**
 * @function 
 * 
 * @description measure Div Load Graph in map
 * 
 */
function measureDivLoadPetrolGraph() {
    let widtha = document.getElementById("assetDataWrapperWrapper").offsetWidth;
    console.log("width is " + widtha);
    let heighta = document.getElementById("assetDataWrapperWrapper").offsetHeight;

    // add an  SVG element for the graph
    document.getElementById("assetDataWrapper").innerHTML += `<svg fill="blue" width="` + widtha + `" height="` + heighta + `" id="svg1">
                  </svg><div>`;

    let data;
    let serviceUrl = document.location.origin + "/api/geojson24/petrolStationsByQueueLength";
    let ajax = $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function (result) {
            // console.log(result);
            data = result;
        },
    });

    $.when(ajax).done(function () {
        console.log(data);
        showGraphStation(data);


    });


    // d3.json(dataURL).then(function (data) { showGraph(data) });

}

/**
 * @function 
 * 
 * @description show Graph in map
 * 
 */
function showGraphStation(data) {
    console.log(data);
    let marginTop = 30;
    let marginBottom = 260;
    let marginLeft = 50;
    let marginRight = 20;

    // loop through the data and get the length of the x axis titles
    let xLen = 0;
    data.forEach(feature => {
        if (xLen < feature.queue_length_description.length) {
            xLen = feature.queue_length_description.length;
        }
        console.log(xLen);
    });

    // adjust the space available for the x-axis titles, depending on the length of the text
    if (xLen > 100) {
        marginBottom = Math.round(xLen / 3, 0) + 120; // the 120 allows for the close button
    }
    else {
        marginBottom = xLen + 120;  // the 120 allows for the close button 
    }

    // g is a grouping element
    // in SVG this is the letter used to name the element that contains all the other SVG elements 
    // so all the other SVG elements (e.g. the bars and text of the graph) are appended (added) to g
    let svg = d3.select("#svg1"),
        margin = { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
        width = svg.attr("width") - marginLeft - marginRight,
        height = svg.attr("height") - marginTop - marginBottom,
        x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
        y = d3.scaleLinear().rangeRound([height, 0]),
        g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    x.domain(data.map(d => d.queue_length_description));
    y.domain([0, d3.max(data, d => d.num_petrol_stations)]);

    // adapted from: https://bl.ocks.org/mbostock/7555321 10th March 2021/
    g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll(".tick text")
        .call(wrap, x.bandwidth());


    g.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y).ticks(10).tickSize(8));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.queue_length_description))
        .attr("y", d => y(d.num_petrol_stations))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.num_petrol_stations));
}



/**
 * @function 
 * 
 * @description showStationCesium
 * 
 */
function showStationCesium() {
    // alert("showStationCesium");
    // let viewer = new Cesium.Viewer('cesiumContainer');

    showDiv('cesiumWrapper');

    const colorMapping = {
        'Queue is very long (over 15 minutes)': Cesium.Color.RED,
        'Queue is moderately long (between 10 and 15 minutes)': Cesium.Color.GREEN,
        'Queue is OK (between 5 and 10 minutes)': Cesium.Color.PURPLE,
        'Queue is very short (less than 5 minutes)': Cesium.Color.PINK,
        'No queue': Cesium.Color.BLUE,
        'Unknown': Cesium.Color.YELLOW,
        'default': Cesium.Color.BLACK
    };

    let geoJSONRoute = 'geojson24';
    let url = document.location.origin + "/api/" + geoJSONRoute + "/petrolStationsByUser/" + user_id;

    let geoJsonDataSource = new Cesium.GeoJsonDataSource();
    geoJsonDataSource.load(url).then(function (dataSource) {
        viewer.dataSources.add(dataSource);

        dataSource.entities.values.forEach(entity => {
            let properties = entity.properties;
            let queueLengthDescription = properties.queue_length_description.getValue();

            let color = colorMapping[queueLengthDescription] || colorMapping['default'];

            entity.point = new Cesium.PointGraphics({
                color: color,
                pixelSize: 10
            });
        });

        viewer.flyTo(dataSource);
    });
}

/**
 * @function 
 * 
 * @description show Bar graph showing number of Petrol stations within each queue time category
 * 
 */
function showStationBarGarph2() {
    // alert("Functionality to do Bar graph showing number of Petrol stations within each queue time category");

    showDiv('assetDataWrapperWrapper');

    document.getElementById("assetDataWrapperWrapper").innerHTML = `
  <div>
    <button type="button" class="btn btn-primary ms-4" onclick="closeAssetData()">Close Graph</button>
    <div id="assetDataWrapper" class="vw-100" style="height:calc(100% - 165px); width:100%; border-color=blue; border-width=5px;"> 
    </div>
  </div>`;

    // we then need to set a short delay before we try to meaure the height and width of the DIV to hold the graph
    // this is because the height and width are not correctly set until the DIV is fully rendered
    // so use setTimeout to set the dealy - 1000 milli-seconds
    // and then call a function called measureDiv to measure the div and start loading the graph
    setTimeout(measureDivLoadPetrolGraph2, 3000);
}

/**
 * @function 
 * 
 * @description measure Div Load Graph in map
 * 
 */
function measureDivLoadPetrolGraph2() {
    let widtha = document.getElementById("assetDataWrapperWrapper").offsetWidth;
    console.log("width is " + widtha);
    let heighta = document.getElementById("assetDataWrapperWrapper").offsetHeight;

    // add an  SVG element for the graph
    document.getElementById("assetDataWrapper").innerHTML += `<svg fill="blue" width="` + widtha + `" height="` + heighta + `" id="svg1">
                  </svg><div>`;

    let data;
    let serviceUrl = document.location.origin + "/api/geojson24/petrolStationLatestPrices/" + user_id;
    let ajax = $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function (result) {
            // console.log(result);
            data = result;
        },
    });

    $.when(ajax).done(function () {
        console.log(data);
        showGraphStation2(data);
    });

}


/**
 * @function 
 * 
 * @description show Graph in map
 * 
 */
function showGraphStation2(data) {
    // console.log(data);
    let marginTop = 0;  // 增加上边距
    let marginBottom = 550;
    let marginLeft = 50;
    let marginRight = 20;

    // 逻辑处理部分保持不变
    let xLen = 0;
    data.forEach(feature => {
        if (xLen < feature.petrol_station_name.length) {
            xLen = feature.petrol_station_name.length;
        }
    });

    if (xLen > 100) {
        marginBottom = Math.round(xLen / 3) + 120;  // 使用 Math.round() 正确地四舍五入
    } else {
        marginBottom = xLen + 120;
    }

    let svg = d3.select("#svg1"),
        margin = { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
        width = svg.attr("width") - marginLeft - marginRight,
        height = svg.attr("height") - marginTop - marginBottom,
        x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
        y = d3.scaleLinear().rangeRound([height, 0]),
        g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain(data.map(d => d.petrol_station_name));
    y.domain([0, d3.max(data, d => d.price_in_pounds)]);

    // adapted from: https://bl.ocks.org/mbostock/7555321 10th March 2021/
    g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll(".tick text")
        .call(wrap, x.bandwidth());


    g.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y).ticks(10).tickSize(8));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.petrol_station_name))
        .attr("y", d => y(d.price_in_pounds))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.price_in_pounds));
}




/**
 * @function 
 * 
 * @description show the Petrol Station Heat Map, assume that the data is stored in a data directory on the local server
 * 
 */
function showStationHeatMap() {
    
    let serviceUrl = document.location.origin + "/api/geojson24/petrolStationsByUser/" + user_id;
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function (result) {
            let data = result;
            drawHeatmap(data);
        }
    });
}
/**
 * @function 
 * 
 * @description show the Petrol Station Heat Map, draw Heat map
 * 
 */

function drawHeatmap(data) {

    if (petrolStationLayer) {
        mymap.removeLayer(petrolStationLayer);
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(mymap);

    

    let heatArray = data.features.map(feature => [
        feature.geometry.coordinates[1], 
        feature.geometry.coordinates[0], 
        mapQueueLengthToValue(feature.properties.queue_length_description) 
    ]);

    console.log(heatArray);

    petrolStationLayer = L.heatLayer(heatArray, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
    }).addTo(mymap);

    mymap.setView([heatArray[0][0], heatArray[0][1]], 14);

}

/**
 * @function 
 * 
 * @description to set map Queue Length To Value
 * 
 */
function mapQueueLengthToValue(description) {
    const mappings = {
        'Queue is very long (over 15 minutes)': 50,
        'Queue is moderately long (between 10 and 15 minutes)': 20,
        'Queue is OK (between 5 and 10 minutes)': 10,
        'Queue is very short (less than 5 minutes': 5,
        'No queue': 0,
        'Unknown': 3
    };
    return mappings[description] || 0;  // 默认为0，如果没有匹配的键
}
