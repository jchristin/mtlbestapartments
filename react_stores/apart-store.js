"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js"),
	zoneStore = require("./zone-store"),
	tinside = require("turf-inside"),
	tpoint = require("turf-point"),
	tPolygon = require("turf-polygon"),
	$ = require("jquery"),
	_ = require("lodash");

module.exports = Reflux.createStore({
	buildPolygon: function(name, coords) {
		var borough = this.boroughs[name];

		if (borough === undefined) {
			console.log("Unknown borough: " + name);
			return;
		}

		// Transform JSON data to turf data.
		var turfCoords = _.map(coords, function(coord) {
			return [coord.lat, coord.lng];
		});

		// Create a turf polygon.
		return tPolygon([turfCoords], {
			name: name
		});
	},
	getAptBorough: function(aptTurfPoint) {
		var aptBoroughName = "Unknown";

		_.forEach(this.turfPolygon, function(polygon) {
			if (tinside(aptTurfPoint, polygon)) {
				aptBoroughName = polygon.properties.name;
				return aptBoroughName;
			}
		});

		return aptBoroughName;
	},
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

		this.turfPolygon = [];

		// Create a turf polygon.
		this.turfPolygon = _.map(this.boroughs, function(coords, name) {
			return this.buildPolygon(name, coords);
		}, this);

		// Retrieve all apartments from server.
		this.allApartments = [];
		$.get("/api/flats", function(data, status) {
			if (status === "success") {
				this.allApartments = data;

				// turf point.
				_.forEach(
					this.allApartments,
					function(apt) {
						apt.turfPoint = tpoint([apt.coord[1], apt.coord[0]]);
						apt.borough = this.getAptBorough(apt.turfPoint);
					}, this
				);

				this.trigger(this.filter());
			}
		}.bind(this));

		// Define internal state.
		this.price = [0, 4000];
		this.bedroom = [1, 7];
		this.zones = [];

		// Listen to actions.
		this.listenTo(actions.setPrice, this.handleSetPrice);
		this.listenTo(actions.setBedroom, this.handleSetBedroom);
		this.listenTo(zoneStore, this.handleZoneChange);
	},

	filter: function() {
		return _.filter(this.allApartments, function(apart) {
			return apart.price >= this.price[0] &&
				apart.price <= this.price[1] &&
				apart.room >= this.bedroom[0] &&
				apart.room <= this.bedroom[1] &&
				this.isZoneValid(apart);
		}, this);
	},
	isZoneValid: function(apart) {
		return this.zones.length === 0 || _.any(this.zones, function(polygon) {
			return tinside(apart.turfPoint, polygon);
		});
	},
	handleSetPrice: function(price) {
		this.price = price;
		this.trigger(this.filter());
	},
	handleSetBedroom: function(bedroom) {
		this.bedroom = bedroom;
		this.trigger(this.filter());
	},
	handleZoneChange: function(zones) {
		this.zones = zones;
		this.trigger(this.filter());
	},
});
