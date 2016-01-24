/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars"),
	miniMapEdit = require("./map-mini-edit");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null, "Walking zone"),
			React.createElement(miniMapEdit, null,this.props.children),
			React.createElement("hr", null),
			React.createElement(
				starsLayout, {
					stars: this.props.children.stars
				}
			)
		);
	}
});
