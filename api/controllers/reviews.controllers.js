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
			console.log("Returned doc", doc);
			res
				.status(200)
				.json(doc.reviews);
		});
};

// Get one review for hotelID
module.exports.reviewsGetOne = function(req, res) {
	var hotelID = req.params.hotelID;
	var reviewID = req.params.reviewID;

	console.log("GET reviewID " + reviewID + "for hotelID " + hotelID);

	Hotel
		.findById(hotelID)
		.select("reviews")	// Telling MongoDB to only return reivews, which saves bandwidth
		.exec(function(err, hotel) {
			var review = hotel.reviews.id(reviewID);
			console.log("Returned hotel", hotel);
			res
				.status(200)
				.json(review);
		});
};