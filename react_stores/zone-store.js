"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js"),
	polygon = require("turf-polygon"),
	_ = require("lodash"),
	$ = require("jquery");

module.exports = Reflux.createStore({
	init: function() {
		this.boroughs = {
			"ahuntsic-cartierville": require("../boroughs/ahuntsic-cartierville"),
			"anjou": require("../boroughs/anjou"),
			"baie-durfe": require("../boroughs/baie-durfe"),
			"beaconsfield": require("../boroughs/beaconsfield"),
			"cote-des-neiges-notre-dame-de-grace": require("../boroughs/cote-des-neiges-notre-dame-de-grace"),
			"cote-saint-luc": require("../boroughs/cote-saint-luc"),
			"dollard-des-ormeaux": require("../boroughs/dollard-des-ormeaux"),
			"dorval": require("../boroughs/dorval"),
			"hampstead": require("../boroughs/hampstead"),
			"ile-bizard-sainte-genevieve": require("../boroughs/ile-bizard-sainte-genevieve"),
			"kirkland": require("../boroughs/kirkland"),
			"lachine": require("../boroughs/lachine"),
			"lasalle": require("../boroughs/lasalle"),
			"le-plateau-mont-royal": require("../boroughs/le-plateau-mont-royal"),
			"le-sud-ouest": require("../boroughs/le-sud-ouest"),
			"mercier-hochelaga-maisonneuve": require("../boroughs/mercier-hochelaga-maisonneuve"),
			"montreal-est": require("../boroughs/montreal-est"),
			"montreal-nord": require("../boroughs/montreal-nord"),
			"montreal-ouest": require("../boroughs/montreal-ouest"),
			"mont-royal": require("../boroughs/mont-royal"),
			"outremont": require("../boroughs/outremont"),
			"pierrefonds-roxboro": require("../boroughs/pierrefonds-roxboro"),
			"pointe-claire": require("../boroughs/pointe-claire"),
			"riviere-des-prairies-pointe-aux-trembles": require("../boroughs/riviere-des-prairies-pointe-aux-trembles"),
			"rosemont-la-petite-patrie": require("../boroughs/rosemont-la-petite-patrie"),
			"sainte-anne-de-bellevue": require("../boroughs/sainte-anne-de-bellevue"),
			"saint-laurent": require("../boroughs/saint-laurent"),
			"saint-leonard": require("../boroughs/saint-leonard"),
			"senneville": require("../boroughs/senneville"),
			"verdun": require("../boroughs/verdun"),
			"ville-marie": require("../boroughs/ville-marie"),
			"villeray-saint-michel-parc-extension": require("../boroughs/villeray-saint-michel-parc-extension"),
			"westmount": require("../boroughs/westmount"),
		};

		this.zones = [];

		this.enableWalkingZone = false;
		this.walkingzonetime = 0;
		this.walkingzonecenter = undefined;

		// Listen to actions.
		this.listenTo(actions.addBorough, this.handleAddBorough);
		this.listenTo(actions.removeBorough, this.handleRemoveBorough);
		this.listenTo(actions.enableWalkingZone, this.handleEnableWalkingZone);
		this.listenTo(actions.setWalkingZoneTime, this.handleSetWalkingZoneTime);
		this.listenTo(actions.setWalkingZoneCenter, this.handleSetWalkingZoneCenter);
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
						console.log(data);
						this.zones.push(data);
						this.trigger(this.zones);
					}
				}.bind(this)
			);
		}
	}
});
