"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js"),
	$ = require("jquery"),
	_ = require("lodash");

module.exports = Reflux.createStore({
	init: function() {
		// Retrieve all apartments from server.
		this.allApartments = [];
		$.get("api/flats", function(data, status) {
			if (status === "success") {
				this.allApartments = data;
				this.trigger(this.filter());
			}
		}.bind(this));

		// Define internal state.
		this.price = [0, 4000];
		this.bedroom = [1, 7];

		// Listen to actions.
		this.listenTo(actions.setPrice, this.handleSetPrice);
		this.listenTo(actions.setBedroom, this.handleSetBedroom);
	},
	filter: function() {
		return _.filter(this.allApartments, function(apart) {
			return apart.price >= this.price[0] &&
				apart.price <= this.price[1] &&
				apart.room >= this.bedroom[0] &&
				apart.room <= this.bedroom[1];
		}, this);
	},
	handleSetPrice: function(price) {
		this.price = price;
		this.trigger(this.filter());
	},
	handleSetBedroom: function(bedroom) {
		this.bedroom = bedroom;
		this.trigger(this.filter());
	}
});
