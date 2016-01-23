/* global module:true, window:true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	generateLayout: function(apts) {
		console.log(apts);
	},
	getAptSearch: function() {
		request
			.get("/api/search/result")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.generateLayout(res.body);
				}
			}.bind(this));
	},
	componentWillMount: function() {
		request
			.get("/api/search/criteria")
			.end(function(err) {
				if (err) {
					if (err.status === 404) {
						this.props.history.pushState(null, "/search/new/map");
					} else {
						console.log(err);
					}
				} else {
					this.getAptSearch();
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
