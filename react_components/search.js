/* global module:true, window:true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	componentWillMount: function() {
		request
			.get("/api/search/criteria")
			.end(function(err, res) {
				if (err.status === 404) {
					window.location = "/search/new";
				} else {
					console.log(err);
				}
			}.bind(this));
	},
	render: function() {
		return React.createElement("div", null,
			"SEARCH",
			React.createElement(Link, {
				to: "/search/edit"
			}, "Edit")
		);
	}
});
