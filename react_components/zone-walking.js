"use strict";

var React = require("react"),
	actions = require("../react_stores/actions"),
	zoneStoreWalking = require("../react_stores/zone-store-walking"),
	$ = require("jquery-ui"),
	$ = require("jquery");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			time: zoneStoreWalking.walkingzonetime
		};
	},
	createCheckbox: function() {
		return React.createElement("div", null,
			React.createElement("input", {
				type: "checkbox",
				defaultChecked: zoneStoreWalking.enableWalkingZone,
				onChange: this.handleChange
			}, " Enable walking zone")
		);
	},
	handleChange: function(e) {
		actions.enableWalkingZone(e.target.checked);
	},
	componentDidMount: function() {
		$("#walking-zone-slider").slider({
			range: false,
			min: 1,
			max: 20,
			step: 1,
			value: zoneStoreWalking.walkingzonetime,
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
				className: "zone-walking"
			},
			React.createElement("div", {
				className: "enable-walking-zone"
			}, this.createCheckbox()),
			React.createElement("div", {
				className: "caption"
			}, this.state.time + " min"),
			React.createElement("div", {
				id: "walking-zone-slider"
			}));
	}
});
