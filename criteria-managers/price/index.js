"use strict";

function computeScore(criterion, apartment) {
	if (apartment.price >= criterion.min && apartment.room <= criterion.max) {
		return 5;
	}

	return 0;
}

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-usd"
};
