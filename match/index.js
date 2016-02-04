"use strict";

var _ = require("lodash"),
	database = require("../database"),
	threshold = 75;

var map = {
	price: require("./price"),
	room: require("./room"),
	zone: require("./zone")
};

var computeScore = function(criteria, apartment, multiplier) {
	var unit = 20 / _.reduce(criteria, function(result, n) {
		return result + Math.pow(n.stars, multiplier);
	}, 0);

	return _.reduce(criteria, function(total, n) {
		return total + Math.pow(n.stars, multiplier) * unit * map[n.type](n, apartment);
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

		var score = computeScore(search.criteria, apartment, 1);
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

		var score = computeScore(search.criteria, apartment, 1);
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
