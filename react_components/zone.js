"use strict";

var React = require("react"),
	actions = require("../react_stores/actions.js");

module.exports = React.createClass({
	handleClick: function() {
		actions.addBorough("ville-marie");
	},
	render: function() {
		return React.createElement("div", {
				className: "zone"
			},
			React.createElement("div", {
				className: "zone-a"
			}, "Zone A"),
			React.createElement("div", {
				className: "zone-a"
			}, "Zone B"),
			React.createElement("div", {
				className: "zone-a"
			}, "Zone C"),
			React.createElement("div", {
				className: "zone-a",
				onClick: this.handleClick
			}, "Ville-Marie")
		);
	}
});
