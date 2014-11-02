"use strict";

var path = require("path"),
	express = require("express"),
	morgan = require("morgan"),
	bodyParser = require("body-parser"),
	favicon = require("serve-favicon"),
	server = express(),
	cacheMaxAge = process.env.NODE_ENV === "development" ? 0 : 3600000,
	port = process.env.PORT || 5000,
	mongoClient = require("mongodb").MongoClient,
	mongoUrl = "mongodb://flat-scraper-craigslist:" + process.env.MONGODB_PASSWORD + "@linus.mongohq.com:10059/flats",
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

server.use(express.static(path.join(__dirname, "bower_components"), {
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

server.get("/api/dflats", function(req, res) {
	res.json([{
		latitude: 45.530647,
		longitude: -73.553009,
		url: "http://montreal.craigslist.ca/apa/4709021413.html",
		image: "http://images.craigslist.org/00X0X_gPbt3rwyIKy_600x450.jpg",
		price: 1195,
		colorvalid: "f80808",
		colornotvalid: "f69e9e",
	}, {
		latitude: 45.530101,
		longitude: -73.554358,
		url: "http://montreal.craigslist.ca/apa/4706263004.html",
		image: "http://images.craigslist.org/00p0p_ivQx7owqTqV_600x450.jpg",
		price: 750,
		colorvalid: "f7fe2e",
		colornotvalid: "f5f6ce",
	}, {
		latitude: 45.535699,
		longitude: -73.554094,
		url: "http://montreal.craigslist.ca/apa/4708677098.html",
		image: "http://images.craigslist.org/00U0U_gNFNrOVHRjQ_600x450.jpg",
		price: 750,
		colorvalid: "bf00ff",
		colornotvalid: "e2a9f3",
	}, {
		latitude: 45.536966,
		longitude: -73.557717,
		url: "http://montreal.craigslist.ca/apa/4687054029.html",
		image: "http://images.craigslist.org/00606_7FJDQLzcKNh_600x450.jpg",
		price: 795,
		colorvalid: "0040ff",
		colornotvalid: "a9bcf5",
	}, {
		latitude: 45.529059,
		longitude: -73.546431,
		url: "http://montreal.craigslist.ca/apa/4701521546.html",
		image: "http://images.craigslist.org/00k0k_gAZi9XJZoT2_600x450.jpg",
		price: 2100,
		colorvalid: "f80808",
		colornotvalid: "f69e9e",
	}, {
		latitude: 45.5301959,
		longitude: -73.555445,
		url: "http://montreal.craigslist.ca/apa/4673658359.html",
		image: "http://images.craigslist.org/00J0J_kgvw2FfsepN_600x450.jpg",
		price: 875,
		colorvalid: "f7fe2e",
		colornotvalid: "f5f6ce",
	}, {
		latitude: 45.530373,
		longitude: -73.547115,
		url: "http://montreal.craigslist.ca/apa/4691813178.html",
		image: "http://images.craigslist.org/00y0y_1071srZZxap_600x450.jpg",
		price: 800,
		colorvalid: "bf00ff",
		colornotvalid: "e2a9f3",
	}, {
		latitude: 45.530101,
		longitude: -73.554358,
		url: "http://montreal.craigslist.ca/apa/4691415638.html",
		image: "http://images.craigslist.org/01010_5591URthgVY_600x450.jpg",
		price: 920,
		colorvalid: "0040ff",
		colornotvalid: "a9bcf5",
	}, {
		latitude: 45.537582,
		longitude: -73.563415,
		url: "http://montreal.craigslist.ca/apa/4647473740.html",
		image: "http://images.craigslist.org/00303_4hbdVVWQbfI_600x450.jpg",
		price: 1295,
		colorvalid: "f80808",
		colornotvalid: "f69e9e",
	}, {
		latitude: 45.530263,
		longitude: -73.551096,
		url: "http://montreal.craigslist.ca/apa/4682355509.html",
		image: "http://images.craigslist.org/00W0W_6FklD6GDn6A_600x450.jpg",
		price: 700,
		colorvalid: "f7fe2e",
		colornotvalid: "f5f6ce",
	}, {
		latitude: 45.537948,
		longitude: -73.559732,
		url: "http://montreal.craigslist.ca/apa/4679172306.html",
		image: "http://images.craigslist.org/00C0C_4A2gmcOM8yq_600x450.jpg",
		price: 795,
		colorvalid: "bf00ff",
		colornotvalid: "e2a9f3",
	}, {
		latitude: 45.534176,
		longitude: -73.557286,
		url: "http://montreal.craigslist.ca/apa/4662041629.html",
		image: "http://images.craigslist.org/01313_8EO9z1f5jBE_600x450.jpg",
		price: 665,
		colorvalid: "0040ff",
		colornotvalid: "a9bcf5",
	}, {
		latitude: 45.535844,
		longitude: -73.554500,
		url: "http://montreal.craigslist.ca/apa/4658741200.html",
		image: "http://images.craigslist.org/01414_7644X1K52MZ_600x450.jpg",
		price: 600,
		colorvalid: "f80808",
		colornotvalid: "f69e9e",
	}, {
		latitude: 45.534841,
		longitude: -73.551285,
		url: "http://montreal.craigslist.ca/apa/4658872837.html",
		image: "http://images.craigslist.org/00n0n_got29OklSzO_600x450.jpg",
		price: 1050,
		colorvalid: "f7fe2e",
		colornotvalid: "f5f6ce",
	}]);
});

mongoClient.connect(mongoUrl, function(err, db) {
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
