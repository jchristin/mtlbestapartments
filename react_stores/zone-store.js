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
			"senneville": require("../boroughs/senneville"),
			"verdun": require("../boroughs/verdun"),
			"saint-laurent": require("../boroughs/saint-laurent"),
			"le-sud-ouest": require("../boroughs/le-sud-ouest"),
			"villeray-saint-michel-parc-extension": require ("../boroughs/villeray-saint-michel-parc-extension"),
			"ahuntsic-cartierville": require ("../boroughs/ahuntsic-cartierville"),
		};

		this.zones = [];

		// Listen to actions.
		this.listenTo(actions.addBorough, this.handleAddBorough);
		this.listenTo(actions.removeBorough, this.handleRemoveBorough);
	},
	handleAddBorough: function(name) {
		var zone = _.find(this.zones, function(z) {
			return z.properties.name === name;
		});

		if (zone !== undefined) {
			console.log("Borough alread added: " + name);
			return;
		}

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
		zone = polygon([coords], {
			name: name
		});

		this.zones.push(zone);

		this.trigger(this.zones);
	},
	handleRemoveBorough: function(name) {
		_.remove(this.zones, function(zone) {
			return zone.properties.name === name;
		});

		this.trigger(this.zones);
	}
});
