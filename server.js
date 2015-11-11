"use strict";

var path = require("path"),
	express = require("express"),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	favicon = require("serve-favicon"),
	passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	osmToGraph = require("osm-to-graph"),
	graph = osmToGraph.loadGraph("./montreal.json"),
	polygon = require("./polygon"),
	server = express(),
	cacheMaxAge = process.env.NODE_ENV === "development" ? 0 : 3600000,
	port = process.env.PORT || 5000,
	mongoClient = require("mongodb").MongoClient,
	database;

// Passport setup.
passport.use(new LocalStrategy(function(username, password, done) {
	if (username === "Teub") {
		return done(null, "Teub");
	}

	return done(null, false, {
		message: "Incorrect username."
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(id, done) {
	done(null, id);
});

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

server.use(passport.initialize());

server.use(passport.session());

server.use(express.static(path.join(__dirname, "public"), {
	maxAge: cacheMaxAge
}));

server.post("/api/signin",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/signin"
	})
);

server.get("/api/signout", function(req, res) {
	req.logout();
	res.redirect("/");
});

server.get("/api/user", function(req, res) {
	res.send(req.user);
});

server.get("/api/flats", function(req, res) {
	if (!database) {
		res.sendStatus(500);
		return;
	}

	database.collection("apartments").find({
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

// Connect database.
mongoClient.connect(process.env.MONGODB_URL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database");
		database = db;
	}
});

// Start server.
server.listen(port);
console.log("Listening on " + port);
