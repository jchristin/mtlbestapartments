"use strict";

var _ = require("lodash");

function computeScore(criterion, apartment) {
	if(criterion.keywords.length === 0) {
		return 5;
	}

	var description = _.deburr(_.toLower(apartment.description));

	return _.every(criterion.keywords, function(keyword) {
		return description.includes(_.deburr(_.toLower(keyword)));
	}) ? 5 : 0;
}

module.exports = {
	Card: require("./card"),
	LargeCard: require("./large-card"),
	computeScore: computeScore,
	default: require("./default"),
	icon: "fa-terminal",
	name: "keyword-name",
	locale: {
		en: require("./locale/en"),
		fr: require("./locale/fr")
	}
};
