/* global module:true */

"use strict";

var React = require("react"),
	Slider = require("bootstrap-slider"),
	starsLayout = require("./edit-stars");

module.exports = React.createClass({
	componentDidMount: function() {
		this.slider = new Slider("#slider-price", {
			min: 0,
			max: 4000,
			step: 50,
			value: [this.props.criterion.min, this.props.criterion.max],
			tooltip: "hide"
		});

		this.slider.on("slide", function(event) {
			this.props.criterion.min = event[0];
			this.props.criterion.max = event[1];
			this.forceUpdate();
		}.bind(this));
	},
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null, "Price between " + this.props.criterion.min + "$ and " + this.props.criterion.max + "$"),
			React.createElement("input", {
				type: "text",
				id: "slider-price"
			}),
			React.createElement("hr", null),
			React.createElement(starsLayout, {
				stars: this.props.criterion.stars,
				editable: true
			})
		);
	}
});
