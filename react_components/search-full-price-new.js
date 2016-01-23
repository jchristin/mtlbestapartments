/* global module:true, window:true */

"use strict";

var React = require("react"),
	searchPrice = require("./search-full-price");

module.exports = React.createClass({
	handleClick: function(event) {
		// this.props.history.pushState(null, "/search/new/room");
	},
	render: function() {
		return React.createElement("div", {
				className: "search-full-price-new"
			},
			React.createElement(searchPrice),
			React.createElement("button", {
				onClick: this.handleClick
			}, "Validate")
		);
	}
});
