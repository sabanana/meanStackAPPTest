// because it is a json file, we can just require() it
// Or, we have to require("file") and then open and read that file asyncly.
var hotelData = require("../data/hotel-data.json");

var dbconn = require('../data/dbconnection.js');
var ObjectId = require('mongodb').ObjectId;


module.exports.hotelsGetAll = function(req, res) {
	// get the db from dbconnection
	var db = dbconn.get();
	var collection = db.collection('hotels');

	console.log("Get db", db);
	console.log("GET the hotels data");

	// 'req.query' passes querystring into controllers
	console.log(req.query);

	// defaul offset and count for querying hotels
	var offset = 0;
	var count = 5;

	// user defined offset and count passed in as url querystring
	if (req.query && req.query.offset) {
		// parse the req.query.offset from string to int (string, radix)
		offset = parseInt(req.query.offset, 10);
	}

	if (req.query && req.query.count) {
		// parse the req.query.offset from string to int (string, radix)
		count = parseInt(req.query.count, 10);
	}

	collection
		.find()	// returns cursor obj which can yield json obj
		.skip(offset)
		.limit(count)
		// asynchronously convert the cursor obj to json array
		.toArray(function (err, docs) {
			res
				.status(200)
				.json(docs);			
		});
};

module.exports.hotelsGetOne = function(req, res) {
	// get the db from dbconnection
	var db = dbconn.get();
	var collection = db.collection("hotels");

	console.log("Get db");

	var hotelID = req.params.hotelID;

	collection
		// query for a single doc by its ObjectId asynchronously
		.findOne({
			_id : ObjectId(hotelID)
		}, function (err, doc) {
			res
				.status(200)
				.json(doc);
		});

	var thisHotel = hotelData[hotelID];

};

module.exports.hotelsAddOne = function(req, res) {
	// get the db from dbconnection
	var db = dbconn.get();

	console.log("Get db");

	console.log("POST new hotel");
	console.log(req.body);
	res
		.status(200)
		.json(req.body);
}