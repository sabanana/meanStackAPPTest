// // CHOICE1: because it is a json file, we can just require() it
// // Or, we have to require("file") and then open and read that file asyncly.
// var hotelData = require("../data/hotel-data.json");

// // CHOICE2: connect to Native MongoDB driver
// var dbconn = require('../data/dbconnection.js');
// var ObjectId = require('mongodb').ObjectId;

// CHOICE3: use models provided by Mongoose
var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');


module.exports.hotelsGetAll = function(req, res) {
	// // get the db from dbconnection
	// var db = dbconn.get();
	// var collection = db.collection('hotels');

	// console.log("Get db", db);
	// console.log("GET the hotels data");

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

	Hotel
		.find()
		.skip(offset)
		.limit(count)
		.exec(function(err, hotels) {
			console.log("Found hotels", hotels.length);
			res
				.status(200)
				.json(hotels);
		});

	// collection
	// 	.find()	// returns cursor obj which can yield json obj
	// 	.skip(offset)
	// 	.limit(count)
	// 	// asynchronously convert the cursor obj to json array
	// 	.toArray(function (err, docs) {
	// 		res
	// 			.status(200)
	// 			.json(docs);			
	// 	});
};

module.exports.hotelsGetOne = function(req, res) {
	// // get the db from dbconnection
	// var db = dbconn.get();
	// var collection = db.collection("hotels");

	// console.log("Get db");

	var hotelID = req.params.hotelID;

	Hotel
		.findById(hotelID)	// helper method provided by Mongoose
		.exec(function(err, doc) {
			console.log("Found hotel", doc);
			res
				.status(200)
				.json(doc);
		});

	// collection
	// 	// query for a single doc by its ObjectId asynchronously
	// 	.findOne({
	// 		_id : ObjectId(hotelID)
	// 	}, function (err, doc) {
	// 		res
	// 			.status(200)
	// 			.json(doc);
	// 	});

	// var thisHotel = hotelData[hotelID];

};

module.exports.hotelsAddOne = function(req, res) {
	// get the db from dbconnection
	var db = dbconn.get();
	var collection = db.collection("hotels");

	var newHotel;	// placeholder for new doc

	console.log("Get db");

	console.log("POST new hotel");

	// check if the request is in correct form
	if (req.body && req.body.name && req.body.stars) {
		newHotel = req.body;
		// insert new doc into the collection
		collection.insertOne(newHotel, function(err, response) {
			console.log(response.ops);	// .ops returns only part of the mongodb response
			res
				.status(201)
				.json(response.ops); 
		});
	}
	else {
		console.log("Bad Request: request not in correct form!");
		res
			.status(401)
			.json({ message : "Request not in correct form" });
	}
}