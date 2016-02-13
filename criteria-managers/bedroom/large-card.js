"use strict";

var React = require("react");

module.exports = React.createClass({
	componentDidMount: function() {
		var Slider = require("bootstrap-slider");
		this.slider = new Slider("#slider-room", {
			min: 1,
			max: 5,
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
			React.createElement("div", null, "Number of room between " + this.props.criterion.min + " room and " + this.props.criterion.max + " rooms"),
			React.createElement("input", {
				type: "text",
				id: "slider-room",
			})
		);
	}
});
