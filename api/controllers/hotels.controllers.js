// because it is a json file, we can just require() it
// Or, we have to require("file") and then open and read that file asyncly.
var hotelData = require("../data/hotel-data.json");
var dbconn = require('../data/dbconnection.js');


module.exports.hotelsGetAll = function(req, res) {
	// get the db from dbconnection
	var db = dbconn.get();

	console.log("db", db);
	console.log("GET the hotels data");

	// 'req.query' passes querystring into controllers
	console.log(req.query);

	// defaul offset and count for querying hotels
	var offset = 0;
	var count = 5;

	// get query-offset data from 'req' obj
	if (req.query && req.query.offset) {
		// parse the req.query.offset from string to int (string, radix)
		offset = parseInt(req.query.offset, 10);
	}

	// get query-count data from 'req' obj
	if (req.query && req.query.count) {
		// parse the req.query.offset from string to int (string, radix)
		count = parseInt(req.query.count, 10);
	}

	var returnData = hotelData.slice(offset, offset + count);

	res
		.status(200)
		.json(returnData);
};

module.exports.hotelsGetOne = function(req, res) {
	// get the db from dbconnection
	var db = dbconn.get();

	console.log("db", db);

	var hotelID = req.params.hotelID;
	var thisHotel = hotelData[hotelID];

	console.log("GET hotelID: ", hotelID);
	res
		.status(200)
		.json(thisHotel);
};

module.exports.hotelsAddOne = function(req, res) {
	// get the db from dbconnection
	var db = dbconn.get();

	console.log("db", db);

	console.log("POST new hotel");
	console.log(req.body);
	res
		.status(200)
		.json(req.body);
}