/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "edit-search"
			},
			React.createElement("i", {
				className: "fa fa-bed"
			}),
			React.createElement("div", {
				className: "edit-search-room-caption"
			}, "Between " + this.props.children.min + " and " + this.props.children.max + " rooms"),
			React.createElement("hr", {
				className: "edit-search-price-caption-sep"
			}),
			React.createElement(
				starsLayout, {
					stars: this.props.children.stars
				})
		);
	}
});
