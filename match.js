"use strict";

var _ = require("lodash"),
	database = require("./database"),
	notification = require("./notification"),
	criteriaManagers = require("./criteria-managers"),
	threshold = 99.9;

var notify = function(userId, apartment) {
	database.users.findOne({
		_id: userId
	}, function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			notification.notify(doc, apartment);
		}
	});
};

var computeScore = function(search, apartment) {
	var score = _.sumBy(search.criteria, function(criterion) {
		return criteriaManagers[criterion.type].computeScore(criterion, apartment);
	});

	return (100/5) * score / search.criteria.length;
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

		var score = computeScore(search, apartment);
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

		var score = computeScore(search, apartment);
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
				} else {
					if(search.notification) {
						notify(search.user, apartment);
					}
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
