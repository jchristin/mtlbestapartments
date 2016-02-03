/* global module:true */

"use strict";

var React = require("react"),
	Layout = require("./layout"),
	request = require("superagent"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	getResult: function () {
		request
			.get("/api/search/result")
			.end(function(err, res) {
				if (err) {
					if (err.status === 404) {
						this.props.history.pushState(null, "/search/new");
					} else {
						console.log(err);
					}
				} else {
					if(res.body === null) {
						this.timer = setTimeout(this.getResult(), 1000);
					}

					this.setState({apartments: res.body});
				}
			}.bind(this));
	},
	getInitialState: function() {
		return {apartments: null};
	},
	componentDidMount: function() {
		this.getResult();
	},
	componentWillUnmount: function() {
		clearTimeout(this.timer);
	},
	render: function() {
		var content;

		if(this.state.apartments === null ) {
			content = React.createElement("div", null, "Finding matches...");
		} else if(this.state.apartments.length === 0 ) {
			content = React.createElement("div", null, "No match found.");
		} else {
			content = React.createElement(Layout, {apartments: this.state.apartments});
		}

		return React.createElement("div", null,
			React.createElement(Link, {
				to: "/search/edit"
			}, "Edit"),
			content
		);
	}
});
