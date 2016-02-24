/* global module:true */

"use strict";

var React = require("react"),
	LayoutCard = require("./layout-card"),
	LayoutMap = require("./layout-map");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			layoutType: (this.props.type || "card")
		};
	},
	handleLayoutChange: function(type) {
		this.setState({layoutType: type});
	},
	render: function() {
		var content;

		switch (this.state.layoutType) {
			case "card":
				content = React.createElement(LayoutCard, {apartments: this.props.apartments});
				break;

			case "map":
				content = React.createElement(LayoutMap, {apartments: this.props.apartments});
				break;

			default:
				// Not handled yet
				console.log(this.state.layoutType);
				content = null;
				break;
		}

		return React.createElement("div", null, React.createElement("button", {
			className: "fa fa-square-o",
			onClick: this.handleLayoutChange.bind(this, "card")
		}), React.createElement("button", {
			className: "fa fa-map",
			onClick: this.handleLayoutChange.bind(this, "map")
		}), content);
	}
});
