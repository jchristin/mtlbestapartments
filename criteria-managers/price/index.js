"use strict";

var computeScore = function(criterion, apartment) {
	if (apartment.price >= criterion.min && apartment.price <= criterion.max) {
		return 5;
	}

	return 0;
};

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-usd",
	name: "price-name",
	locale: {
		en: require("./locale/en"),
		fr: require("./locale/fr")
	}
};
