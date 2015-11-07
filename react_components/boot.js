/* global document:true */

"use strict";

var http = require("http"),
	React = require("react"),
	Router = require("react-router").Router,
	browserHistory = require("history").createHistory();

var redirect = function(pathIfLogged, pathIfNotLogged) {
	return function(nextState, replaceState, callback) {
		http.get("/api/user", function(res) {
			var user = "";

			res.on("data", function(buf) {
				user += buf;
			});

			res.on("end", function() {
				console.log(user);
				if (pathIfLogged && user !== "") {
					replaceState({
						nextPathname: nextState.location.pathname
					}, pathIfLogged);
				}

				if(pathIfNotLogged && user === "") {
					replaceState({
						nextPathname: nextState.location.pathname
					}, pathIfNotLogged);
				}

				callback();
			});
		});
	};
};

var routes = [{
	path: "/",
	component: require("./home"),
	onEnter: redirect("/search", null)
}, {
	path: "/",
	component: require("./app"),
	childRoutes: [{
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

React.render(React.createElement(Router, {
	history: browserHistory
}, routes), document.getElementById("app"));
