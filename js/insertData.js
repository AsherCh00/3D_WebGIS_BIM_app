'use strict'

/**
 * @function
 * @description test inserting data into a table in the database by sending a string to the server api end point
 * <br>the string is hard coded data for testing purposes
 */
function testInsertData() {
	// create a fake string of hard-coded data
	// to test the process of inserting data into a database
	let postString = "name=astudent&surname=withashortsurname&module=cege0043&latitude=0.28&longitude=5.99&language=Japanese&lecturetime=early&modulelist=cege0043,cege0052";

	// create the AJAX call
	// make sure to use document.location.origin - don't hard code the URL
	let serviceUrl= document.location.origin+"/api/crud24/insertTestFormData";
	console.log(serviceUrl);
	$.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "POST",
		success: insertResult,
		data: postString
	});

}

/**
 * @function
 * @description alert result here is the message sent by the res.send command in the API
 */
function insertResult(result){
	// result here is the message sent by the res.send command in the API
	alert(result);
}