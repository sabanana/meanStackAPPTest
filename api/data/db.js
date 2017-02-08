// Connecting to MongoDB--meanhotel using Mongoose

var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);

// Listening to event 'mongoose connected'
mongoose.connection.on('connected', function() {
	console.log('Mongoose connected db ' + dburl);
});

// Listening to event 'mongoose disconnected'
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected!');
});

// Listening to event 'mongoose connect error'
mongoose.connection.on('error', function(err) {
	console.log('Mongoose connected error ' + err);
});


// using nodeJS process listening to system event 
// 1) clean up the app by disconnect Mongoose when shutting down app using ctrl+c
process.on('SIGINT', function() {
	// disconnect to mongoose
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGINT)');
		// tell the process it can exit
		process.exit(0);
	});
});

// 2) SIGTERM is the event submitted by various server platform e.g. Heruko
process.on('SIGTERM', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGTERM)');
		process.exit(0);
	});
});

// 2) SIGUSR2 is listened by nodemon to know when to restart the app
// 	  Thus, we should only capture the event once and issue it agian when
//    Mongoose got disconnected so that nodemon can recapture it
process.once('SIGUSR2', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGUSR2)');
		// kill the nodeJS process and fire event 'SIGUSR2'
		process.kill(process.pid, 'SIGUSR2');
	});
});