"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js"),
	polygon = require("turf-polygon"),
	_ = require("lodash");

module.exports = Reflux.createStore({
	init: function() {
		this.boroughs = {
			"ville-marie": require("../boroughs/ville-marie")
		};

		this.zones = [];

		// Listen to actions.
		this.listenTo(actions.addBorough, this.handleAddBorough);
	},
	handleAddBorough: function(name) {
		var borough = this.borough[name];

		var coords = [
			[-2.275543, 53.464547],
			[-2.275543, 53.489271],
			[-2.215118, 53.489271],
			[-2.215118, 53.464547],
			[-2.275543, 53.464547]
		];

		var zone = turf.polygon(coords, {
			name: name
		});

		this.zones.push(zone);

		this.trigger(this.zones);
	},
});
