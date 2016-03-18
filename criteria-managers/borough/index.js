"use strict";

function computeScore(criterion, apartment) {
	if(criterion.boroughs.length === 0) {
		return 5;
	}

	return criterion.boroughs.indexOf(apartment.borough) != -1 ? 5 : 0;
}

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-map-signs",
	name: "Borough"
};
