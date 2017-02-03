var express = require("express");
// Instantiate a Router
var router = express.Router();

var ctrlHotels = require("../controllers/hotels.controllers.js");

// chaining the method of the router
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

module.exports = router;	