//require('./api/data/dbconnection.js').open();
require('./api/data/db.js');

var express = require('express');	// add express to app
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./api/routes');

app.set('port', 3000);	// set port

// an Express middleware to log all the requests the client sent
app.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();
});

// build static html homepage
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// user body-parser middleware to parser HTML form data in req.body
// 
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());	// angularJS submit form in json format by default

app.use('/api', routes);


var server = app.listen(app.get('port'), function() {
	var port = server.address().port;
	console.log('Magic happens on port ' + port);
});