"use strict";

var mongoClient = require("mongodb").MongoClient,
	database = null;

module.exports = function() {
	return database;
};

mongoClient.connect(process.env.MONGODB_URL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		database = db;
	}
});
