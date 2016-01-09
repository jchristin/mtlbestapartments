/* global document:true */

"use strict";

var React = require("react"),
	ReactDOM = require("react-dom"),
	Router = require("react-router").Router,
	browserHistory = require("history").createHistory(),
	request = require("superagent");

var redirect = function(pathIfLogged, pathIfNotLogged) {
	return function(nextState, replaceState, callback) {
		request
			.get("/api/user")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					if (pathIfLogged && res.text !== "") {
						replaceState({
							nextPathname: nextState.location.pathname
						}, pathIfLogged);
					}

					if (pathIfNotLogged && res.text === "") {
						replaceState({
							nextPathname: nextState.location.pathname
						}, pathIfNotLogged);
					}

					callback();
				}
			});
	};
};

var routes = [{
	path: "/",
	component: require("./home"),
	onEnter: redirect("/search", "/staff-picks")
}, {
	path: "/",
	component: require("./app"),
	childRoutes: [{
		path: "a/:_id",
		component: require("./apt-detail")
	},{
		path: "account",
		component: require("./account"),
		onEnter: redirect(null, "/signin")
	}, {
		path: "favorite",
		component: require("./favorite"),
		onEnter: redirect(null, "/signin")
	}, {
		path: "posted",
		component: require("./posted"),
		onEnter: redirect(null, "/signin")
	}, {
		path: "search",
		component: require("./search"),
		onEnter: redirect(null, "/signin")
	}, {
		path: "search/new",
		component: require("./search-new")
	}, {
		path: "search/edit",
		component: require("./edit")
	}, {
		path: "settings",
		component: require("./settings"),
		onEnter: redirect(null, "/signin")
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

ReactDOM.render(React.createElement(Router, {
	history: browserHistory
}, routes), document.getElementById("app"));
