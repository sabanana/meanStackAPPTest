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