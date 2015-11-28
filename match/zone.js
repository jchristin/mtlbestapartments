"use strict";

var _ = require("lodash"),
	point = require("turf-point"),
	polygon = require("turf-polygon"),
	inside = require("turf-inside");

module.exports = function(criteria, apartment) {
	var points = _.map(criteria.polygon, function(point) {
		return [point.lng, point.lat];
	});

	if (inside(point(apartment.coord), polygon([points]))) {
		return 5;
	}

	return 0;
};
