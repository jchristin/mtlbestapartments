"use strict";

var point = require("turf-point"),
	polygon = require("turf-polygon"),
	inside = require("turf-inside");

module.exports = function(criteria, apartment) {
	if (inside(point(apartment.coord), polygon(criteria.polygon))) {
		return 5;
	}

	return 0;
};
