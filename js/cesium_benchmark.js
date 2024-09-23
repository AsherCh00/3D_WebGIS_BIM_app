"use strict"

async function getPostgreSqlCeilingsData() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/office_ceilings";
	let ajax = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(function () {
		console.log(data);
		getPostgreSqlGeoJSON(data, 'OfficeCeilingsPostgre');
	});

}
async function getPostgreSqlDoorsData() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/office_doors";
	let ajax = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(function () {
		console.log(data);
		getPostgreSqlGeoJSON(data, 'OfficeDoorsPostgre');
	});

}
async function getPostgreSqlFloorsData() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/office_floors";
	let ajax = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(function () {
		console.log(data);
		getPostgreSqlGeoJSON(data, 'OfficeFloorsPostgre');
	});

}
async function getPostgreSqlWallsData() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/office_walls";
	let ajax = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(function () {
		console.log(data);
		getPostgreSqlGeoJSON(data, 'OfficeWallsPostgre');
	});

}
async function getPostgreSqlWindowsData() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/office_windows";
	let ajax = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(function () {
		console.log(data);
		getPostgreSqlGeoJSON(data, 'OfficeWindowsPostgre');
	});

}

async function getPostgreSqlRoomFurnitureData() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/room_furniture";
	let ajax = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(function () {
		console.log(data);
		getPostgreSqlGeoJSON(data, 'OfficeRoomFurniture');
	});

}

async function getPostgreSqlRoomFurnitureData_forView() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/room_furniture_forView";
	let ajax = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(function () {
		console.log(data);
		getPostgreSqlGeoJSON(data, 'OfficeRoomFurniture_forView');
	});

}

async function getPostgreSqlRoomData() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/office_room";
	let ajax = $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(function () {
		console.log(data);
		getPostgreSqlGeoJSON(data, 'OfficeRoomTarget');
	});

}

async function getPostgreSqlBenchmarkData() {
	let data;
	let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/benchmark_postgresql";
	let ajax = await $.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "GET",
		success: function (result) {
			data = result;
		},
	});

	await $.when(ajax).done(async function () {
		// console.log(data);
		await getPostgreSqlGeoJSON(data, 'OfficePostgreSqlBenchmark');
	});

}

async function getPostgreSqlGeoJSON(data, layerName) {

	let newLayer = new Cesium.GeoJsonDataSource();

	await newLayer.load(data).then(() => {
		geoJsonLayers[layerName] = newLayer;
	}).catch((error) => {
		console.error('Error loading GeoJSON:', error);
	});
}

async function getMongoBenchmarkData(layerName) {
	try {
		let data;
		let serviceUrl = document.location.origin.replace(':4443', ':4480') + "/geojson24/benchmark_mongodb";
		let ajax = await $.ajax({
			url: serviceUrl,
			crossDomain: true,
			type: "GET",
			success: function (result) {
				data = result;
				// console.log('MongoDB_Benchmark', result);
			},
			error: function (error) {
				console.error('Error fetching GeoJSON:', error);
			}
		});

		await $.when(ajax).done(async function () {
			let newLayer = new Cesium.GeoJsonDataSource();
			await newLayer.load(data).then(() => {
				geoJsonLayers[layerName] = newLayer;
			});

		});
	} catch (error) {
		console.error('Error fetching GeoJSON:', error);
	}
}

function saveGeoJSONToFile(geojson, filename) {
	let blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
	let url = URL.createObjectURL(blob);

	let a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();

	setTimeout(() => {
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}, 0);
}
