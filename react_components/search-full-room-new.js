/* global module:true */

"use strict";

var React = require("react"),
	searchRoom = require("./search-full-room");

module.exports = React.createClass({
	handleClick: function(event) {
		this.props.history.pushState(null, "/search/new/map");
	},
	render: function() {
		return React.createElement("div", {
				className: "search-full-room-new"
			},
			React.createElement(searchRoom),
			React.createElement("button", {
				onClick: this.handleClick
			}, "Validate")
		);
	}
});
