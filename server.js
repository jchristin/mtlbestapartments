"use strict";

var path = require("path"),
	request = require("request"),
	express = require("express"),
	morgan = require("morgan"),
	bodyParser = require("body-parser"),
	favicon = require("serve-favicon"),
	server = express(),
	cacheMaxAge = process.env.NODE_ENV === "development" ? 0 : 3600000,
	port = process.env.PORT || 5000,
	mongoClient = require("mongodb").MongoClient,
	database;

// Enable logging for development environment
if (process.env.NODE_ENV === "development") {
	server.use(morgan({
		immediate: true,
		format: "dev"
	}));
}

server.use(express.query());

server.use(bodyParser.json());

server.use(favicon(path.join(__dirname, "public/img/favicon.ico"), {
	maxAge: cacheMaxAge
}));

server.use(express.static(path.join(__dirname, "public"), {
	maxAge: cacheMaxAge
}));

server.get("/api/flats", function(req, res) {
	database.collection("active").find({
		source: "craigslist"
	}).limit(1000).toArray(function(err, docs) {
		if (err) {
			console.log(err);
		} else {
			res.json(docs);
		}
	});
});

server.get("/api/polygon", function(req, res) {

	request.get(process.env.FLAT_CARTO_URL + "api/polygon?" +
	"lat=" + req.query.lat + "&" +
	"long=" +  req.query.long + "&" +
	"timeinmin=" + req.query.timeinmin + "&" +
	"traveltype=" + req.query.traveltype).pipe(res);
});

mongoClient.connect(process.env.MONGODB_URL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database");
		database = db;

		// Start server
		server.listen(port);
		console.log("Listening on " + port);
	}
});
