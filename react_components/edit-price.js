/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null,
				"Price between " + this.props.children.min + "$ and " + this.props.children.max + "$"),
			React.createElement("hr", null),
			React.createElement(
				starsLayout, {
					stars: this.props.children.stars
				})
		);
	}
});
