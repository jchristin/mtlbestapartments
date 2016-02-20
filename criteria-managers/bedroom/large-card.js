"use strict";

var React = require("react");

module.exports = React.createClass({
	componentDidMount: function() {
		var Slider = require("bootstrap-slider");
		this.slider = new Slider("#slider", {
			min: 0,
			max: 4,
			step: 1,
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
			React.createElement("div", null, "Number of bedrooms between " + this.props.criterion.min + " and " + this.props.criterion.max),
			React.createElement("input", {
				type: "text",
				id: "slider",
			})
		);
	}
});
