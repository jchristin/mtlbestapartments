"use strict";

var computeScore = function(criterion, apartment) {
	if (criterion.boroughs.length === 0) {
		return 5;
	}

	return criterion.boroughs.indexOf(apartment.borough) === -1 ? 0 : 5;
};

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-map-signs",
	name: "borough-name",
	locale: {
		en: require("./locale/en"),
		fr: require("./locale/fr")
	}
};
