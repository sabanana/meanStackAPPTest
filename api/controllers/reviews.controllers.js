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

	console.log("GET reviewID " + reviewID + " for hotelID " + hotelID);

	Hotel
		.findById(hotelID)
		.select("reviews")	// Telling MongoDB to only return reviews, which saves bandwidth
		.exec(function(err, hotel) {
			var response = {
				status : 200,
				message : {}
			};

			if (err) {
				console.log("Error finding hotel", hotelID);
				response.status = 500;
				response.message = err;
			}
			else if (!hotel) {
				response.status = 404;
				response.message = {
					"message" : "HotelID not found"
				};
			}
			else {
				console.log("Returned review:" + reviewID + " of hotel:" + hotel);
				var review = hotel.reviews.id(reviewID);
				if (!review) {
					console.log("reviewID of the hotel not found!");
					response.status = 404;
					response.message = {
            			"message" : "Review ID not found " + reviewId
          			};
				}
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

var _updateReview = function(req, res, hotel, thisReview) {
	console.log("Updating review of hotel:" + hotel);
	thisReview.name = req.body.name;
	thisReview.rating = parseInt(req.body.rating, 10);
	thisReview.review = req.body.review;

	// Use Mongoose save() method to save the model
	hotel.save(function(err, hotelUpdated) {
		if (err) {
			console.log("Error saving changes to review:" + reviewID + "of hotel:" + hotel);
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
};

// Update One review for hotelID
module.exports.reviewsUpdateOne = function(req, res) {
	var hotelID = req.params.hotelID;
	var reviewID = req.params.reviewID;

	console.log("GET reviewID " + reviewID + " for hotelID " + hotelID);

	Hotel
		.findById(hotelID)
		.select("reviews")	// Telling MongoDB to only return reviews, which saves bandwidth
		.exec(function(err, hotel) {
			var thisReview;
			var response = {
				status : 200,
				message : {}
			};

			if (err) {
				console.log("Error finding hotel", hotelID);
				response.status = 500;
				response.message = err;
			}
			else if (!hotel) {
				console.log("HotelID" + hotelID + "not found!");
				response.status = 404;
				response.message = {
					"message" : "HotelID not found"
				};
			}
			else {
				// Get the review
				thisReview = hotel.reviews.id(reviewID);
				// If the review doesn't exists Mongoose returns null
				if (!thisReview) {
					console.log("reviewID: " + reviewID + " of the hotel not found");
					response.status = 404;
					response.message = {
            			"message" : "Review ID not found " + reviewId
          			};
				}
			}

			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message);
			}
			else {
				_updateReview(req, res, hotel, thisReview);
			}
		});
};