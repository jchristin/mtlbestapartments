/* global module:true, window:true */

"use strict";

var React = require("react"),
	Layout = require("./layout"),
	request = require("superagent"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	getInitialState: function() {
		return {apartments: []};
	},
	componentDidMount: function() {
		request
			.get("/api/search/result")
			.end(function(err, res) {
				if (err) {
					if (err.status === 404) {
						this.props.history.pushState(null, "/search/new/map");
					} else {
						console.log(err);
					}
				} else {
					this.setState({apartments: res.body});
				}
			}.bind(this));
	},
	render: function() {
		return React.createElement("div", null,
			"SEARCH",
			React.createElement(Link, {
				to: "/search/edit"
			}, "Edit"),
			React.createElement(Layout, {apartments: this.state.apartments})
		);
	}
});
