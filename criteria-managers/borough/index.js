"use strict";

var _ = require("lodash");

function computeScore(criterion, apartment) {
	return _.find(criterion.boroughs, apartment.borough) ? 5 : 0;
}

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-globe"
};
