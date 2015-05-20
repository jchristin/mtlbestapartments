"use strict";

var React = require("react"),
	actions = require("../react_stores/actions"),
	$ = require("jquery-ui"),
	$ = require("jquery");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			time: 0
		};
	},
	componentDidMount: function() {
		$("#walking-zone-slider").slider({
			range: false,
			min: 0,
			max: 20,
			step: 1,
			value: 0,
			slide: function(event, ui) {
				actions.setWalkingZoneTime(ui.value);
				this.setState({
					time: ui.value
				});
			}.bind(this)
		});
	},
	render: function() {
		return React.createElement("div", {
				className: "walking-zone"
			},
			React.createElement("div", {
				className: "caption"
			}, this.state.time + " min"),
			React.createElement("div", {
				id: "walking-zone-slider"
			}));
	}
});
