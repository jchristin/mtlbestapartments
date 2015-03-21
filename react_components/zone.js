"use strict";

var React = require("react");

module.exports = React.createClass({
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
				className: "zone-a"
			}, "Zone D")
		);
	}
});
