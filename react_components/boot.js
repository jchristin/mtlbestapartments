/* global document:true */

"use strict";

var React = require("react"),
	Router = require("react-router").Router,
	browserHistory = require("react-router/node_modules/history/lib/createBrowserHistory")();

var routes = [{
	path: "/",
	component: require("./home")
}, {
	path: "/",
	component: require("./app"),
	childRoutes: [{
		path: "account",
		component: require("./account")
	}, {
		path: "favorite",
		component: require("./favorite")
	}, {
		path: "posted",
		component: require("./posted")
	}, {
		path: "search",
		component: require("./search")
	}, {
		path: "search/edit",
		component: require("./edit")
	}, {
		path: "settings",
		component: require("./settings")
	}, {
		path: "signin",
		component: require("./signin")
	}, {
		path: "signup",
		component: require("./signup")
	}, {
		path: "staff-picks",
		component: require("./staff-picks")
	}]
}];

React.render(React.createElement(Router, {
	history: browserHistory
}, routes), document.getElementById("app"));
