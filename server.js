"use strict";

var path = require("path"),
	express = require("express"),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	favicon = require("serve-favicon"),
	MongoStore = require("connect-mongo")(session),
	server = express(),
	cacheMaxAge = process.env.NODE_ENV === "development" ? 0 : 3600000,
	port = process.env.PORT || 5000,
	database = require("./database"),
	auth = require("./auth"),
	search = require("./search"),
	apart = require("./apart");

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
	saveUninitialized: false,
	store: new MongoStore({
		db: database.instance
	})
}));

server.use(auth.initialize());

server.use(auth.session());

server.use(express.static(path.join(__dirname, "public"), {
	maxAge: cacheMaxAge
}));

server.post("/api/signup", auth.signUp);

server.post("/api/signin", auth.signIn);

server.get("/api/signout", auth.signOut);

server.get("/api/user", auth.getUserInfo);

server.delete("/api/user", auth.isAuthenticated, auth.deleteUser);

server.get("/api/apart/:id", apart.getApart);

server.put("/api/apart/:id", apart.updateApart);

server.post("/api/apart", apart.addApart);

server.get("/api/staff-picks", apart.getStaffPicks);

server.get("/api/search/criteria", auth.isAuthenticated, search.getCriteria);

server.post("/api/search/criteria", auth.isAuthenticated, search.createOrUpdateCriteria);

server.get("/api/search/result", auth.isAuthenticated, search.getResult);

server.delete("/api/search", auth.isAuthenticated, search.remove);

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
	//var distmeter = Math.ComputeDistance(
	//	req.query.traveltype,
	//	req.query.timeinmin
	//);

	//var hull = polygon(graph, distmeter, req.query.lat, req.query.long);
	//res.json(hull);
	res.end();
});

server.get("*", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

// Start server.
module.exports.listen = function() {
	server.listen(port);
};
