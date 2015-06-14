"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js"),
	zoneStoreBorough = require("./zone-store-borough"),
	zoneStoreWalking = require("./zone-store-walking"),
	tinside = require("turf-inside"),
	tpoint = require("turf-point"),
	$ = require("jquery"),
	_ = require("lodash");

module.exports = Reflux.createStore({
	init: function() {
		// Retrieve all apartments from server.
		this.allApartments = [];
		$.get("api/flats", function(data, status) {
			if (status === "success") {
				this.allApartments = data;

				// turf point.
				_.forEach(
					this.allApartments,
					function(apt) {
						apt.turfPoint = tpoint([apt.longitude, apt.latitude]);
					}
				);

				this.trigger(this.filter());
			}
		}.bind(this));

		// Define internal state.
		this.price = [0, 4000];
		this.bedroom = [1, 7];
		this.zonesBorough = [];
		this.zonesWalking = [];
		this.zones = [];

		// Listen to actions.
		this.listenTo(actions.setPrice, this.handleSetPrice);
		this.listenTo(actions.setBedroom, this.handleSetBedroom);
		this.listenTo(zoneStoreBorough, this.handleZoneBoroughChange);
		this.listenTo(zoneStoreWalking, this.handleZoneWalkingChange);
	},

	filter: function() {
		return _.filter(this.allApartments, function(apart) {
			return apart.price >= this.price[0] &&
				apart.price <= this.price[1] &&
				apart.room >= this.bedroom[0] &&
				apart.room <= this.bedroom[1] &&
				this.isZonesValid(apart);
		}, this);
	},
	isZonesValid: function(apart) {
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
	handleZoneBoroughChange: function(zones) {
		this.zonesBorough = zones;
		this.zones = this.zonesBorough.concat(this.zonesWalking);
		this.trigger(this.filter());
	},
	handleZoneWalkingChange: function(zones) {
		this.zonesWalking = zones;
		this.zones = this.zonesBorough.concat(this.zonesWalking);
		this.trigger(this.filter());
	},
});
