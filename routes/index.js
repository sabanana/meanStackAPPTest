var express = require("express");
// Instantiate a Router
var router = express.Router();

// chaining the method of the router
router
	.route('/json')

	// GET method
	.get(function(req, res) {
			console.log("GET the json");
			res
				.status(200)
				.json({"jsonData": true});
	})

	// POST method
	.post(function(req, res) {
			console.log("POST the json");
			res
				.status(200)
				.json({"jsonData": "POST received"});
	});


module.exports = router;	