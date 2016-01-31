/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars");

module.exports = React.createClass({
	getInitialState: function() {
		return {priceMin: 500, priceMax: 1500, stars: 5};
	},
	changeMinPrice: function(event) {
		this.setState({priceMin: event.target.value});
	},
	changeMaxPrice: function(event) {
		this.setState({priceMax: event.target.value});
	},
	render: function() {
		return React.createElement("div", {
			className: "edit-search"
		}, React.createElement("div", null, "Price between " + this.state.priceMin + "$ and " + this.state.priceMax + "$"), React.createElement("input", {
			type: "range",
			name: "points",
			min: "0",
			max: "3950",
			step: "50",
			value: this.state.priceMin,
			onChange: this.changeMinPrice
		}), React.createElement("input", {
			type: "range",
			name: "points",
			min: "50",
			max: "4000",
			step: "50",
			value: this.state.priceMax,
			onChange: this.changeMaxPrice
		}), React.createElement("hr", null), React.createElement(starsLayout, {
			stars: this.state.stars,
			editable: true
		}));
	}
});
