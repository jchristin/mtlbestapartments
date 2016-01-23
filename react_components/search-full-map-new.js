/* global module:true */

"use strict";

var React = require("react"),
	searchZone = require("./search-full-map");

module.exports = React.createClass({
	componentDidMount: function() {

	},
	handleClick: function(event) {
		this.props.history.pushState(null, "/search/new/room");
	},
	render: function() {
		return React.createElement("div", {
				className: "search-full-zone-new"
			},
			React.createElement("button", {
				onClick: this.handleClick
			}, "Validate"),
			React.createElement(searchZone, {
				id: "map-canvas-full",
				height: "90%"
			})
		);
	}
});
