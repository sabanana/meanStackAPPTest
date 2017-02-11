var express = require("express");
// Instantiate a Router
var router = express.Router();

var ctrlHotels = require("../controllers/hotels.controllers.js");
var ctrlReviews = require("../controllers/reviews.controllers.js");

// GET/POST hotels
// 1. Get All Hotels
router
	.route('/hotels')

	// GET method; callback controller
	.get(ctrlHotels.hotelsGetAll);

// 2. Get a hotel by its ID
router
	.route('/hotels/:hotelID')
	.get(ctrlHotels.hotelsGetOne);

// 3. Add a hotel by POST an HTML form
router
	.route('/hotels/new')
	.post(ctrlHotels.hotelsAddOne);


// GET/POST reviews
// 1. Get all reviews for a hotel
router
	.route('/hotels/:hotelID/reviews')
	.get(ctrlReviews.reviewsGetAll);

// 2. Get a single review for a hotel
router
	.route('/hotels/:hotelID/reviews/:reviewId')
	.get(ctrlReviews.reivewsGetOne);

module.exports = router;	