"use strict";

var _ = require("lodash");

var computeScore = function(criterion, apartment) {
	if (_.every(criterion.bedrooms, function(x) {
			return !x;
		})) {
		return 5;
	}

	return criterion.bedrooms[apartment.bedroom] === true ? 5 : 0;
};

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-bed",
	name: "bedroom-name",
	locale: {
		en: require("./locale/en"),
		fr: require("./locale/fr")
	}
};
