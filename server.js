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
	database = require("./database"),
	auth = require("./auth"),
	search = require("./search"),
	apart = require("./apart"),
	fs = require("fs"),
	_ = require("lodash"),
	// eslint-disable-next-line no-sync
	indexTemplate = _.template(fs.readFileSync(path.join(__dirname, "/public/index.tpl"), {
		encoding: "utf8"
	})),
	url = require("url");

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
	secret: process.env.SESSION_SECRET,
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

server.use(function(req, res, next) {
	var urlObj = url.parse(req.url);
	var regexp = /\/((?:en)|(?:fr))\//;
	var regexpAPI = /\/((?:api))\//;

	if (urlObj.pathname.match(regexpAPI)) {
		// If the request comes to the /api, don't redirect it
		next();
	} else if (urlObj.pathname.match(regexp)) {
		// If we have the locale param in the URL, pass the request along
		next();
	} else {
		// If not, redirect the request to /fr
		urlObj.pathname = "/fr" + urlObj.pathname;
		res.redirect(301, url.format(urlObj));
	}
});

server.post("/api/signup", auth.signUp);

server.post("/api/signin", auth.signIn);

server.get("/api/signout", auth.signOut);

server.get("/api/user", auth.getUserInfo);

server.delete("/api/user", auth.isAuthenticated, auth.deleteUser);

server.get("/api/apart/:id", apart.getApart);

server.post("/api/apart", apart.addOrUpdateApart);

server.delete("/api/apart", apart.deactivateApart);

server.get("/api/latest", apart.getLatest);

server.get("/api/search/criteria", auth.isAuthenticated, search.getCriteria);

server.post("/api/search/criteria", auth.isAuthenticated, search.createOrUpdateCriteria);

server.post("/api/search/notification/:state", auth.isAuthenticated, search.updateNotification);

server.get("/api/search/result", auth.isAuthenticated, search.getResult);

server.get("/api/searches/active", auth.isAuthenticated, search.getActiveSearchCount);

server.get("/api/searches/orphan", auth.isAuthenticated, search.deleteOrphanSearches);

server.get("/api/users/orphan", auth.isAuthenticated, search.usersWithoutSearch);

server.delete("/api/search", auth.isAuthenticated, search.remove);

server.get("/api/layout", auth.isAuthenticated, auth.getLayout);

server.post("/api/layout", auth.isAuthenticated, auth.updateLayout);

server.get("*", function(req, res) {
	res.send(indexTemplate({
		lang: req.params.lang,
		googleMapApiKey: process.env.GOOGLE_MAP_API_KEY
	}));
});

// Unhandled exception handler.
server.use(function(err, req, res) {
	console.log(err);
	res.sendStatus(500);
});

module.exports = server;
