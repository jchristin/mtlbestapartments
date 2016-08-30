"use strict";

var _ = require("lodash"),
	point = require("turf-point"),
	polygon = require("turf-polygon"),
	inside = require("turf-inside");

var computeScore = function(criterion, apartment) {
	if (criterion.polygon.length === 0) {
		return 0;
	}

	var points = _.map(criterion.polygon, function(p) {
		return [p.lng, p.lat];
	});

	if (inside(point(apartment.coord), polygon([points]))) {
		return 5;
	}

	return 0;
};

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-globe",
	name: "zone-name",
	locale: {
		en: require("./locale/en"),
		fr: require("./locale/fr")
	}
};
