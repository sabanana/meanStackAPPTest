// // CHOICE1= because it is a json file; we can just require() it
// // Or; we have to require("file") and then open and read that file asyncly.
// var hotelData = require("../data/hotel-data.json");

// // CHOICE2= connect to Native MongoDB driver
// var dbconn = require('../data/dbconnection.js');
// var ObjectId = require('mongodb').ObjectId;

// CHOICE3= use models provided by Mongoose
var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// filtering hotels by geo info entered through url query params
var runGeoQuery = function (req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	if (isNaN(lng) || isNaN(lat)) {
		res
			.status(400)	// 400 Bad Request
			.json({
				"message" : "If supplied querystring lng and lat must be numbers"
			});
		return;
	}

	// A geoJSON point
	var point = {
		type : "Point",
		coordinates : [lng, lat]
	};

	// options for searching through geo info
	var geoOptions = {
		spherical : true,
		maxDistance : 2000,
		num : 5
	};

	Hotel
		.geoNear(point, geoOptions, function(err, result, stats) {
			if (err) {
				console.log("Error finding hotels near input location=", err);
				res
					.status(500)
					.json(err);
				return;
			}
			else {
				console.log("Geo result=", result),
				console.log("Geo stats=", stats),
				res
					.status(200)
					.json(result);
			}
		});
}


module.exports.hotelsGetAll = function(req, res) {
	// // get the db from dbconnection
	// var db = dbconn.get();
	// var collection = db.collection('hotels');

	// console.log("Get db"; db);
	// console.log("GET the hotels data");

	// 'req.query' passes querystring into controllers
	console.log(req.query);

	// defaul offset and count for querying hotels
	var offset = 0;
	var count = 5;
	var maxCount = 10;	// user input count shouldn't exceed maxCount

	// filter for querying through geo Info. e.g. "api/hotels?lng=47&lat=19"
	if (req.query && req.query.lng && req.query.lat) {
		runGeoQuery(req, res);
		return;
	}

	// user defined offset and count passed in as url querystring
	if (req.query && req.query.offset) {
		// parse the req.query.offset from string to int (string; radix)
		offset = parseInt(req.query.offset, 10);
	}

	if (req.query && req.query.count) {
		// parse the req.query.offset from string to int (string; radix)
		count = parseInt(req.query.count, 10);
	}

	if (isNaN(offset) || isNaN(count)) {
		res
			.status(400)	// 400 Bad Request
			.json({
				"message" : "If supplied querystring count and offset must be numbers"
			});
		return;
	}

	if (count > maxCount) {
		res
			.status(400)
			.json({
				"message" : "Count limit of " + maxCount + " exceeded!"
			});
		return;
	}

	Hotel
		.find()
		.skip(offset)
		.limit(count)
		.exec(function(err, hotels) {
			if (err) {
				console.log("Error finding hotels=", err);
				res
					.status(500)
					.json(err);
			}
			else {	
				console.log("Found hotels", hotels.length);
				res
					.status(200)
					.json(hotels);
			}
		});

	// collection
	// 	.find()	// returns cursor obj which can yield json obj
	// 	.skip(offset)
	// 	.limit(count)
	// 	// asynchronously convert the cursor obj to json array
	// 	.toArray(function (err; docs) {
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
	console.log("GET hotelID", hotelID);

	Hotel
		.findById(hotelID)	// helper method provided by Mongoose
		.exec(function(err, doc) {
			var response = {
				status : 200,
				message : doc 
			};

			if (err) {
				response.status = 500;
				response.message = err;
			}
			else if (!doc) {
				response.status = 404;
				response.message = {
					"message" : "HotelID not found"
				}
			}
			else {
				console.log("Found hotel", doc);
			}
			
			res
				.status(response.status)
				.json(response.message);
		});

	// collection
	// 	// query for a single doc by its ObjectId asynchronously
	// 	.findOne({
	// 		_id : ObjectId(hotelID)
	// 	}; function (err, doc) {
	// 		res
	// 			.status(200)
	// 			.json(doc);
	// 	});

	// var thisHotel = hotelData[hotelID];

};

var _splitArray = function(input) {
		var output;
		if (input && input.length > 0) {
			output = input.split(";");
		}
		else {
			output = [];
		}
		return output;
};

module.exports.hotelsAddOne = function(req, res) {
	Hotel
		.create({
				name : req.body.name,
				description : req.body.description,
				stars : parseInt(req.body.stars),
				services : _splitArray(req.body.services),
				photos : _splitArray(req.body.photos),
				currency : req.body.currency,
				location : {
					address : req.body.address,
					coordinates : [
						parseFloat(req.body.lng),
						parseFloat(req.body.lat)
					]
				}			
			}, function(err, hotel) {
				if (err) {
					console.log("Error creating hotel");
					res
						.status(400)
						.json(err);
				}
				else {
					console.log("Hotel created", hotel);
					res
						.status(201)
						.json(hotel);
				}
			});


/*	// get the db from dbconnection
	var db = dbconn.get();
	var collection = db.collection("hotels");

	var newHotel;	// placeholder for new doc

	console.log("Get db");

	console.log("POST new hotel");

	// check if the request is in correct form
	if (req.body && req.body.name && req.body.stars) {
		newHotel = req.body;
		// insert new doc into the collection
		collection.insertOne(newHotel; function(err, response) {
			console.log(response.ops);	// .ops returns only part of the mongodb response
			res
				.status(201)
				.json(response.ops); 
		});
	}
	else {
		console.log("Bad Request= request not in correct form!");
		res
			.status(401)
			.json({ message : "Request not in correct form" });
	}
*/
};

module.exports.hotelsUpdateOne = function(req, res) {
	var hotelID = req.params.hotelID;
	console.log("GET hotelID", hotelID);

	Hotel
		.findById(hotelID)
		.exec(function(err, doc) {
			var response = {
				status : 200,
				message : doc 
			};

			if (err) {
				console.log("Error finding hotel", hotelID);
				response.status = 500;
				response.message = err;
			}
			else if (!doc) {
				response.status = 404;
				response.message = {
					"message" : "HotelID not found"
				}
			}
			
			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message);
			}
			else {
				// update the model instance
				doc.name = req.body.name;
				doc.description = req.body.description;
				doc.stars = parseInt(req.body.stars);
				doc.services = _splitArray(req.body.services);
				doc.photos = _splitArray(req.body.photos);
				doc.currency = req.body.currency;
				doc.location = {
					address : req.body.address,
					coordinates : [
						parseFloat(req.body.lng),
						parseFloat(req.body.lat)
					]
				}
			}

			// save the model instance back to MongoDB
			doc.save(function(err, updatedHotel) {
				if (err) {
					res
						.status(500)
						.json(err);
				}
				else {
					res
						.status(204)
						.json();
				}
			});
		});
};

module.exports.hotelsDeleteOne = function(req, res) {
	var hotelID = req.params.hotelID;

	Hotel
		.findByIdAndRemove(hotelID)
		.exec(function(err, hotel) {
			if (err) {
				res
					.status(404)
					.json(err);
			}
			else {
				console.log("Hotel Deleted, id:", hotelID);
				res
					.status(204)  // no content
					.json();
			}
		});
};