/* global document:true */

"use strict";

var React = require("react"),
	ReactDOM = require("react-dom"),
	Router = require("react-router").Router,
	Route = require("react-router").Route,
	IndexRoute = require("react-router").IndexRoute,
	browserHistory = require("react-router").browserHistory,
	request = require("superagent"),
	Loading = require("./loading");

var Boot = React.createClass({
	redirect: function(pathIfLogged, pathIfNotLogged) {
		return function(nextState, replace) {
			var isLogged = this.state.user !== null;
			if (pathIfLogged && isLogged) {
				replace(pathIfLogged);
			}

			if (pathIfNotLogged && !isLogged) {
				replace(pathIfNotLogged);
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
			React.createElement(Route, {
					path: "/",
					component: require("./app")
				},
				React.createElement(IndexRoute, {
					component: require("./latest")
				}),
				React.createElement(Route, {
					path: "a/:_id",
					component: require("./apt-detail")
				}),
				React.createElement(Route, {
					path: "favorite",
					component: require("./favorite"),
					onEnter: this.redirect(null, "/signin?next=/favorite")
				}),
				React.createElement(Route, {
					path: "posted",
					component: require("./posted"),
					onEnter: this.redirect(null, "/signin?next=/posted")
				}),
				React.createElement(Route, {
					path: "search",
					component: require("./search"),
					onEnter: this.redirect(null, "/signin?next=/search")
				}),
				React.createElement(Route, {
					path: "search/edit",
					component: require("./edit"),
					onEnter: this.redirect(null, "/signin?next=/search/edit")
				}),
				React.createElement(Route, {
					path: "settings",
					component: require("./settings"),
					onEnter: this.redirect(null, "/signin?next=/settings")
				}),
				React.createElement(Route, {
					path: "signin",
					component: require("./signin")
				}),
				React.createElement(Route, {
					path: "signup",
					component: require("./signup"),
					onEnter: this.redirect("/", null)
				})
			)
		);
	}
});

ReactDOM.render(React.createElement(Boot), document.getElementById("container"));
