"use strict";

function computeScore(criterion, apartment) {
	return 0;
}

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-terminal"
};
