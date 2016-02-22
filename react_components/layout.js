/* global module:true */

"use strict";

var React = require("react"),
	LayoutCard = require("./layout-card"),
	LayoutMap = require("./layout-map");

module.exports = React.createClass({
	render: function() {
		var type = (this.props.type || "card");
		switch (type) {
			case "card":
				return React.createElement(LayoutCard, {apartments: this.props.apartments});

			case "map":
				return React.createElement(LayoutMap, {apartments: this.props.apartments});

			default:
				// Not handled yet
				console.log(this.props.type);
		}
	}
});
