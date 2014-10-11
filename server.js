var path = require("path"),
	fs = require("fs"),
	express = require("express"),
	morgan = require("morgan"),
	bodyParser = require("body-parser"),
	favicon = require("serve-favicon"),
	server = express(),
	cacheMaxAge = process.env.NODE_ENV === "development" ? 0 : 3600000,
	port = process.env.PORT || 5000;

// Enable logging for development environment
if (process.env.NODE_ENV === "development") {
	server.use(morgan({immediate: true, format: "dev"}));
}

server.use(express.query());

server.use(bodyParser.json());

server.use(favicon(path.join(__dirname, "public/img/favicon.ico"), { maxAge: cacheMaxAge }));

server.use(express.static(path.join(__dirname, "public"), { maxAge: cacheMaxAge }));

server.use(express.static(path.join(__dirname, "bower_components"), { maxAge: cacheMaxAge }));

// Start server
server.listen(port);
console.log("Listening on " + port);

