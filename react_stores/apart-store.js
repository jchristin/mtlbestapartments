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
			}
		}.bind(this));

		// Define internal state.
		this.price = [0, 4000];

		// Listen to actions.
		this.listenTo(actions.setPrice, this.handleSetPrice);
	},
	filter: function() {
		return _.filter(this.allApartments, function(apart) {
			return apart.price >= this.price[0] && apart.price <= this.price[1];
		}, this);
	},
	handleSetPrice: function(price) {
		this.price = price;
		this.trigger(this.filter());
	}
});
