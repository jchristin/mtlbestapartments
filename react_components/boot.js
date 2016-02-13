/* global document:true */

"use strict";

var React = require("react"),
	ReactDOM = require("react-dom"),
	Router = require("react-router").Router,
	Route = require("react-router").Route,
	Redirect = require("react-router").Redirect,
	Loading = require("./loading"),
	browserHistory = require("history").createHistory(),
	request = require("superagent");

var Boot = React.createClass({
	redirect: function(pathIfLogged, pathIfNotLogged) {
		return function(nextState, replaceState) {
			var isLogged = this.state.user !== null;
			if (pathIfLogged && isLogged) {
				replaceState({
					nextPathname: nextState.location.pathname
				}, pathIfLogged);
			}

			if (pathIfNotLogged && !isLogged) {
				replaceState({
					nextPathname: nextState.location.pathname
				}, pathIfNotLogged);
			}
		}.bind(this);
	},
	getInitialState: function() {
		return {
			user: undefined
		};
	},
	childContextTypes: {
		user: React.PropTypes.object
	},
	getChildContext: function() {
		return {
			user: this.state.user
		};
	},
	componentWillMount: function() {
		request
			.get("/api/user")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						user: res.body
					});
				}
			}.bind(this));
	},
	render: function() {
		if(this.state.user === undefined) {
			return React.createElement(Loading);
		}

		return React.createElement(Router, {
				history: browserHistory
			},
			React.createElement(Redirect, {
				from: "/",
				to: this.state.user ? "/search" : "/staff-picks"
			}),
			React.createElement(Route, {
					path: "/",
					component: require("./app")
				},
				React.createElement(Route, {
					path: "a/:_id",
					component: require("./apt-detail")
				}),
				React.createElement(Route, {
					path: "favorite",
					component: require("./favorite"),
					onEnter: this.redirect(null, "/signin")
				}),
				React.createElement(Route, {
					path: "posted",
					component: require("./posted"),
					onEnter: this.redirect(null, "/signin")
				}),
				React.createElement(Route, {
					path: "search",
					component: require("./search"),
					onEnter: this.redirect(null, "/signin")
				}),
				React.createElement(Route, {
					path: "search/edit",
					component: require("./edit")
				}),
				React.createElement(Route, {
					path: "search/edit/:num",
					component: require("./edit-large")
				}),
				React.createElement(Redirect, {
					from: "search/new",
					to: "search/new/1"
				}),
				React.createElement(Route, {
					path: "search/new/:num",
					component: require("./new-large"),
				}),
				React.createElement(Route, {
					path: "settings",
					component: require("./settings"),
					onEnter: this.redirect(null, "/signin")
				}),
				React.createElement(Route, {
					path: "signin",
					component: require("./signin")
				}),
				React.createElement(Route, {
					path: "signup",
					component: require("./signup")
				}),
				React.createElement(Route, {
					path: "staff-picks",
					component: require("./staff-picks")
				})
			)
		);
	}
});

ReactDOM.render(React.createElement(Boot), document.getElementById("container"));
