"use strict";

var mongoClient = require("mongodb").MongoClient;

module.exports.connect = function() {
	var promise = mongoClient.connect(process.env.MONGODB_URL);

	promise.then(function(database) {
		module.exports.instance = database;
		module.exports.users = database.collection("users");
		module.exports.searches = database.collection("searches");
		module.exports.apartments = database.collection("apartments");
	});

	return promise;
};
