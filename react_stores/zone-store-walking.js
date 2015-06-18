"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js"),
	$ = require("jquery");

module.exports = Reflux.createStore({
	init: function() {
		this.zoneswalking = [];

		this.enableWalkingZone = false;
		this.walkingzonetime = 1;
		this.walkingzonecenter = undefined;

		// Listen to actions.
		this.listenTo(actions.enableWalkingZone, this.handleEnableWalkingZone);
		this.listenTo(actions.setWalkingZoneTime, this.handleSetWalkingZoneTime);
		this.listenTo(actions.setWalkingZoneCenter, this.handleSetWalkingZoneCenter);
	},
	handleEnableWalkingZone: function(state) {
		this.enableWalkingZone = state;
	},
	handleSetWalkingZoneTime: function(time) {
		this.walkingzonetime = time;
		this.requestWalkingZone();
	},
	handleSetWalkingZoneCenter: function(center) {
		if (this.enableWalkingZone) {
			this.walkingzonecenter = center;
			this.requestWalkingZone();
		} else {
			this.walkingzonecenter = undefined;
		}
	},
	requestWalkingZone: function() {
		if (this.enableWalkingZone &&
			(this.walkingzonetime > 0) &&
			(this.walkingzonecenter !== undefined)) {
			$.get("api/polygon?" +
				$.param({
					lat: this.walkingzonecenter[0],
					long: this.walkingzonecenter[1],
					timeinmin: this.walkingzonetime,
					traveltype: 'walking',
				}),
				function(data, status) {
					if (status === 'success') {
						this.trigger(data);
					}
				}.bind(this)
			);
		}
	}
});
