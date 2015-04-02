"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js"),
	polygon = require("turf-polygon"),
	_ = require("lodash");

module.exports = Reflux.createStore({
	init: function() {
		this.boroughs = {
			"anjou": require("../boroughs/anjou"),
			"le-plateau-mont-royal": require("../boroughs/le-plateau-mont-royal"),
			"mercier-hochelaga-maisonneuve": require("../boroughs/mercier-hochelaga-maisonneuve"),
			"montreal-est": require("../boroughs/montreal-est"),
			"riviere-des-prairies-pointe-aux-trembles": require("../boroughs/riviere-des-prairies-pointe-aux-trembles"),
			"ville-marie": require("../boroughs/ville-marie"),
			"montreal-nord": require("../boroughs/montreal-nord"),
			"saint-leonard": require("../boroughs/saint-leonard"),
			"rosemont-la-petite-patrie": require("../boroughs/rosemont-la-petite-patrie"),
		};

		this.zones = [];

		// Listen to actions.
		this.listenTo(actions.addBorough, this.handleAddBorough);
	},
	handleAddBorough: function(name) {
		var borough = this.boroughs[name];

		if (borough === undefined) {
			console.log("Unknown borough: " + name);
			return;
		}

		// Transform JSON data to turf data.
		var coords = _.map(borough, function(coord) {
			return [coord.lat, coord.lng];
		});

		// Create a turf polygon.
		var zone = polygon(coords, {
			name: name
		});

		// TODO added trick here to return void zone on %2 click (to be removed)
		if (this.zones.length) {
			this.zones.length = 0;
		} else {
			this.zones.push(zone);
		}

		this.trigger(this.zones);
	},
});
