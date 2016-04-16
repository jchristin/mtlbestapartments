"use strict";

var co = require("co");

co(function*() {
	// Wait for database to connect.
	yield require("./database").connect();
	console.log("Database connected.");

	// Run server.
	require("./server").listen(process.env.PORT || 5000);
	console.log("Server listening...");
}).catch(function(err) {
	console.log(err);
});
