/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null,
				"Between " + this.props.children.min + " and " + this.props.children.max + " rooms"),
			React.createElement("hr", null),
			React.createElement(
				starsLayout, {
					stars: this.props.children.stars
				})
		);
	}
});
