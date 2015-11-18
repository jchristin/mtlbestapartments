"use strict";

var path = require("path"),
	express = require("express"),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	favicon = require("serve-favicon"),
	osmToGraph = require("osm-to-graph"),
	graph = osmToGraph.loadGraph("./montreal.json"),
	polygon = require("./polygon"),
	server = express(),
	cacheMaxAge = process.env.NODE_ENV === "development" ? 0 : 3600000,
	port = process.env.PORT || 5000,
	database = require("./database"),
	auth = require("./auth");

// Server setup.
server.use(favicon(path.join(__dirname, "public/img/favicon-32x32.png"), {
	maxAge: cacheMaxAge
}));

server.use(express.query());

server.use(bodyParser.json());

server.use(bodyParser.urlencoded({
	extended: false
}));

server.use(cookieParser());

server.use(session({
	secret: "fleuby",
	resave: false,
	saveUninitialized: false
}));

server.use(auth.initialize());

server.use(auth.session());

server.use(express.static(path.join(__dirname, "public"), {
	maxAge: cacheMaxAge
}));

server.post("/api/signup", auth.signUp);

server.post("/api/signin", auth.signIn);

server.get("/api/signout", auth.signOut);

server.get("/api/user", auth.getUserId);

server.delete("/api/user", auth.isAuthenticated, auth.deleteUser);

server.get("/api/criteria", function(req, res) {
	res.json(req.user.searches[0].criteria);
});

server.post("/api/criteria", function(req, res) {
	res.end();
});

server.get("/api/flat", function(req, res) {

	if (typeof req.query === "undefined") {
		res.status(404).send("Invalid flat.");
		return;
	}

	database.apartments.findOne({
		_id: req._parsedUrl.query,
	}, function(err, doc) {
		if (err) {
			console.log(err);
			res.status(404).send("Invalid flat.");
		} else {
			res.json(doc);
		}
	});
});

server.get("/api/flats", function(req, res) {
	database.apartments.find({
		active: true,
		image: {
			$ne: null
		},
		room: {
			$ne: null
		}
	}).sort({
		"date": -1
	}).limit(2000).toArray(function(err, docs) {
		if (err) {
			console.log(err);
		} else {
			res.json(docs);
		}
	});
});

server.get("/api/stations/:city", function(req, res) {
	if (req.params.city === "montreal") {
		var stations = [{
			key: "green",
			color: "#00CC00",
			data: require("./metro/green-line.json"),
		}, {
			key: "orange",
			color: "#D62D20",
			data: require("./metro/orange-line.json"),
		}, {
			key: "yellow",
			color: "#f4ea03",
			data: require("./metro/yellow-line.json"),
		}, {
			key: "blue",
			color: "#0099CC",
			data: require("./metro/blue-line.json"),
		}];

		res.json(stations);
	} else {
		res.status(404).send("Invalid city.");
	}
});

server.get("/api/polygon", function(req, res) {
	if ((typeof req.query.traveltype === "undefined") ||
		(typeof req.query.timeinmin === "undefined") ||
		(typeof req.query.lat === "undefined") ||
		(typeof req.query.long === "undefined")) {
		res.json({
			"status": "error",
			"data": null,
			/* or optional error payload */
			"message": "Wrong parameters to polygon"
		});
	}

	// Compute distance in meter, according to the travel type and the time.
	var distmeter = Math.ComputeDistance(
		req.query.traveltype,
		req.query.timeinmin
	);

	var hull = polygon(graph, distmeter, req.query.lat, req.query.long);

	res.json(hull);
});

server.get("*", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

// Start server.
server.listen(port);
console.log("Listening on " + port);
