var express = require("express");
// Instantiate a Router
var router = express.Router();

var ctrlHotels = require("../controllers/hotels.controllers.js");
var ctrlReviews = require("../controllers/reviews.controllers.js");

// GET/POST hotels
// 1. Get All Hotels OR Add One Hotel using POST method
router
	.route('/hotels')
	// GET method; callback controller
	.get(ctrlHotels.hotelsGetAll)
	// POST a new hotel
	.post(ctrlHotels.hotelsAddOne);

// 2. Get a hotel by its ID
router
	.route('/hotels/:hotelID')
	.get(ctrlHotels.hotelsGetOne);



// GET/POST reviews
// 1. Get all reviews for a hotel OR Post a new review for the hotel
router
	.route('/hotels/:hotelID/reviews')
	.get(ctrlReviews.reviewsGetAll)
	.post(ctrlReviews.reviewAddOne);

// 2. Get a single review for a hotel
router
	.route('/hotels/:hotelID/reviews/:reviewID')
	.get(ctrlReviews.reviewsGetOne);

module.exports = router;	