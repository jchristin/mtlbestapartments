"use strict";

var _ = require("lodash");

var map = {
	price: require("./price"),
	room: require("./room"),
	zone: require("./zone")
};

module.exports = function(criteria, apartment, multiplier) {
	var unit = 20 / _.reduce(criteria, function(result, n) {
		return result + Math.pow(n.stars, multiplier);
	}, 0);

	return _.reduce(criteria, function(total, n) {
		return total + Math.pow(n.stars, multiplier) * unit * map[n.type](n, apartment);
	}, 0);
};

