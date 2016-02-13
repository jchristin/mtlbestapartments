"use strict";

var _ = require("lodash"),
	database = require("./database"),
	criteriaManagers = require("./criteria-managers"),
	threshold = 75;

var computeScore = function(search, apartment, multiplier) {
	var unit = 20 / _.reduce(search.criteria, function(result, criterion) {
		return result + Math.pow(criterion.stars, multiplier);
	}, 0);

	return _.reduce(search.criteria, function(total, criterion) {
		var score = criteriaManagers[criterion.type].computeScore(criterion, apartment);
		return total + Math.pow(criterion.stars, multiplier) * unit * score;
	}, 0);
};

var computeScoreSearch = function(search) {
	var result = [];

	database.apartments.find({
		active: true
	}).each(function(err, apartment) {
		if (err) {
			console.log(err);
			return false;
		}

		if (!apartment) {
			database.searches.updateOne({
				_id: search._id
			}, {
				$set: {
					result: result
				}
			}, function(err) {
				if (err) {
					console.log(err);
				}
			});
			return false;
		}

		var score = computeScore(search, apartment, 1);
		if(score >= threshold) {
			result.push(apartment._id);
		}
	});
};

var computeScoreApartement = function(apartment) {
	database.searches.find().each(function(err, search) {
		if (err) {
			console.log(err);
			return false;
		}

		if (!search) {
			return false;
		}

		var score = computeScore(search, apartment, 1);
		if(score >= threshold) {
			database.searches.updateOne({
				_id: search._id
			}, {
				$addToSet: {
					result: apartment._id
				}
			}, function(err) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
};

module.exports = {
	computeScore: computeScore,
	computeScoreSearch: computeScoreSearch,
	computeScoreApartement: computeScoreApartement
};
