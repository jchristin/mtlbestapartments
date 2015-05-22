/* global document:true */

"use strict";

var React = require("react"),
	Router = require('react-router'),
	Route = Router.Route,
	App = require("./app");

var routes = React.createElement(Route, {
	handler: App,
	path: "/"
});

Router.run(routes, Router.HistoryLocation, function(Root) {
	React.render(React.createElement(Root), document.getElementById("app"));
});
