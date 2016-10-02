"use strict";

var _ = require("lodash"),
	moment = require("moment"),
	database = require("./database"),
	notification = require("./notification"),
	criteriaManagers = require("./criteria-managers"),
	threshold = 99.9;

var keepSearchActive = function(search) {
	database.searches.updateOne({
		_id: search._id
	}, {
		$set: {
			lastSeen: new Date()
		}
	}, function(err) {
		if (err) {
			console.log(err);
		}
	});
};

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

	return 100 / 5 * score / search.criteria.length;
};

var computeScoreSearch = function(search) {
	keepSearchActive(search);

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
			}, function(err2) {
				if (err2) {
					console.log(err2);
				}
			});

			return false;
		}

		var score = computeScore(search, apartment);
		if (score >= threshold) {
			result.push(apartment._id);
		}

		return true;
	});
};

var computeScoreApartement = function(apartment) {
	database.searches.find({
		lastSeen: {
			$gt: moment()
				.subtract(2, "weeks")
				.toDate()
		}
	}).each(function(err, search) {
		if (err) {
			console.log(err);

			return false;
		}

		if (!search) {
			return false;
		}

		var score = computeScore(search, apartment);
		if (score >= threshold) {
			database.searches.updateOne({
				_id: search._id
			}, {
				$addToSet: {
					result: apartment._id
				}
			}, function(err2) {
				if (err2) {
					console.log(err2);
				} else if (search.notification) {
					notify(search.user, apartment);
				}
			});
		}

		return true;
	});
};

module.exports = {
	computeScore: computeScore,
	computeScoreSearch: computeScoreSearch,
	computeScoreApartement: computeScoreApartement
};
