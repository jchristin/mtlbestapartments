"use strict";

var mongoClient = require("mongodb").MongoClient,
	collections = {};

module.exports = collections;

mongoClient.connect(process.env.MONGODB_URL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		collections.users = db.collection("users");
		collections.apartments = db.collection("apartments");
	}
});
