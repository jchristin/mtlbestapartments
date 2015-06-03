/* global document:true */

"use strict";

var React = require("react"),
	Router = require('react-router'),
	Route = Router.Route,
	App = require("./app"),
	App2 = require("./app2");

var routes = [
	React.createElement(Route, {
		handler: App,
		path: "/"
	}),
	React.createElement(Route, {
		handler: App2,
		path: "/2"
	})
];

Router.run(routes, Router.HistoryLocation, function(Root) {
	React.render(React.createElement(Root), document.getElementById("app"));
});
