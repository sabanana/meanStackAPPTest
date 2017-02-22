// Get hotel collection by using Mongoose model
var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// Get all reviews for hotelID
module.exports.reviewsGetAll = function(req, res) {
	var hotelID = req.params.hotelID;

	Hotel
		.findById(hotelID)
		.select("reviews")	// Telling MongoDB to only return reivews, which saves bandwidth
		.exec(function(err, doc) {
			var response = {
				status : 200,
				message : doc.reviews 
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
				console.log("Returned doc", doc);
			}

			res
				.status(response.status)
				.json(response.message);			
		});
};

// Get one review for hotelID
module.exports.reviewsGetOne = function(req, res) {
	var hotelID = req.params.hotelID;
	var reviewID = req.params.reviewID;

	console.log("GET reviewID " + reviewID + "for hotelID " + hotelID);

	Hotel
		.findById(hotelID)
		.select("reviews")	// Telling MongoDB to only return reviews, which saves bandwidth
		.exec(function(err, hotel) {
			var response = {
				status : 200,
				message : hotel
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
				console.log("Returned hotel", hotel);
				var review = hotel.reviews.id(reviewID);
				response.message = review;
			}

			res
				.status(response.status)
				.json(response.message);
		});
};

var _addReview = function(req, res, hotel) {
	hotel.reviews.push({
		name : req.body.name,
		rating : parseInt(req.body.rating, 10),
		review : req.body.review
	});

	// Use Mongoose save() method to save the model
	hotel.save(function(err, hotelUpdated) {
		if (err) {
			res
				.status(500)
				.json(err);
		}
		else {
			res
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.reviews.length-1]);
		}
	});
};

// Add One review for hotelID
module.exports.reviewsAddOne = function(req, res) {
	var hotelID = req.params.hotelID;
	console.log("Get hotelID", hotelID);

	Hotel
		.findById(hotelID)
		.select('reviews')
		.exec(function(err, doc) {
			var response = {
				status : 200,
				message : []
			};

			if (err) {
				console.log("Error finding hotel");
				response.status = 500;
				response.message = err;
			}
			else if (!doc) {
				console.log("Hotel id not found in database", id);
				response.status = 404;
				response.message = {
					"message" : "Hotel ID not found" + id					
				};
			}

			if (doc) {
				_addReview(req, res, doc);	
			}
			else {
				res
					.status(response.status)
					.json(response.message);
			}
});
};