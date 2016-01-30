/* global module:true, window:true */

// http://codepen.io/Bouhtouch/pen/DHALw

"use strict";

var React = require("react"),
	searchPrice = require("./search-full-price");

module.exports = React.createClass({
	handleClick: function(event) {
		// this.props.history.pushState(null, "/search/new/room");
	},
	render: function() {
		return React.createElement("div", null,
			React.createElement(searchPrice),
			React.createElement("button", {
				onClick: this.handleClick
			}, "Validate")
		);
	}
});
