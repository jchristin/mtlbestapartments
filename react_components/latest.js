/* global module:true */

"use strict";

var React = require("react"),
	Layout = require("./layout"),
	request = require("superagent");

module.exports = React.createClass({
	getInitialState: function() {
		return {apartments: []};
	},
	componentWillMount: function() {
		request
			.get("/api/latest")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.setState({apartments: res.body});
				}
			}.bind(this)
		);
	},
	render: function() {
		return React.DOM.div({
			className: "row"
		},
		React.createElement("h1", null, "Recently added"),
		React.createElement(Layout, {apartments: this.state.apartments, lang: this.props.params.lang}));
	}
});
