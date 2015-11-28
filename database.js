"use strict";

var mongoClient = require("mongodb").MongoClient,
	collections = {};

module.exports = collections;

if(!process.env.MONGODB_URL) {
	console.log("MONGODB_URL missing.");
	return;
}

mongoClient.connect(process.env.MONGODB_URL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		collections.users = db.collection("users");
		collections.apartments = db.collection("apartments");
	}
});
