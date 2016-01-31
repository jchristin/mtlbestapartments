/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars");

module.exports = React.createClass({
	changeMinPrice: function(event) {
		this.props.criterion.min = event.target.value;
		this.forceUpdate();
	},
	changeMaxPrice: function(event) {
		this.props.criterion.max = event.target.value;
		this.forceUpdate();
	},
	render: function() {
		return React.createElement("div", {
			className: "edit-search"
		}, React.createElement("div", null, "Price between " + this.props.criterion.min + "$ and " + this.props.criterion.max + "$"), React.createElement("input", {
			type: "range",
			name: "points",
			min: "0",
			max: "3950",
			step: "50",
			value: this.props.criterion.min,
			onChange: this.changeMinPrice
		}), React.createElement("input", {
			type: "range",
			name: "points",
			min: "50",
			max: "4000",
			step: "50",
			value: this.props.criterion.max,
			onChange: this.changeMaxPrice
		}), React.createElement("hr", null), React.createElement(starsLayout, {
			stars: this.props.criterion.stars,
			editable: true
		}));
	}
});
