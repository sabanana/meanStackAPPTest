var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	review : {
		type : String,
		required : true
	},
	rating : {
		type : Number,
		min : 0,
		max : 5,
		required : true
	},
	createOn : {
		type : Date,
		"default" : Date.now
	}
});

var roomSchema = new mongoose.Schema({
	type : String,
	number : Number,
	description : String,
	photos : [String],
	price : Number
});

var hotelSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	stars : {
		type : Number,
		min : 0,
		max : 5,
		"default" : 0
	},
	services : [String],
	description : String,
	photos : [String],
	currency : String,
	reviews : [reviewSchema],
	rooms : [roomSchema],
	location : {
		address : String,
		// Always store coordinates: longitude(E/W), latitude(N/S)
		coordinates : {
			type : [Number],
			index : '2dsphere'	// MongoDB Datatype
		}
	}
});

// compile the schema-hotelSchema into model-Hotel using collection-hotels
mongoose.model('Hotel', hotelSchema);