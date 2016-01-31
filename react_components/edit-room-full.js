/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars");

module.exports = React.createClass({
	changeMinRoom: function(event) {
		this.props.criterion.min = event.target.value;
		this.forceUpdate();
	},
	changeMaxRoom: function(event) {
		this.props.criterion.max = event.target.value;
		this.forceUpdate();
	},
	render: function() {
		return React.createElement("div", {
			className: "edit-search"
		}, React.createElement("div", null, "Number of room between " + this.props.criterion.min + " room and " + this.props.criterion.max + " rooms"), React.createElement("input", {
			type: "range",
			name: "points",
			min: "1",
			max: "4",
			step: "1",
			value: this.props.criterion.min,
			onChange: this.changeMinRoom
		}), React.createElement("input", {
			type: "range",
			name: "points",
			min: "1",
			max: "5",
			step: "1",
			value: this.props.criterion.max,
			onChange: this.changeMaxRoom
		}), React.createElement("hr", null), React.createElement(starsLayout, {
			stars: this.props.criterion.stars,
			editable: true
		}));
	}
});
