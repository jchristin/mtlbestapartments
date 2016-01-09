"use strict";

var _ = require("lodash"),
	database = require("../database");

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

var computeScoreAll = function() {
	var searches = [];

	database.users.find().each(function(err, user) {
		if (err) {
			console.log(err);
			return false;
		}

		if (!user) {
			database.apartments.find({
				active: true
			}).each(function(err, apartment) {
				if (err) {
					console.log(err);
					return false;
				}

				if (!apartment) {
					console.log("Done.");
					setTimeout(computeScoreAll, 3000);
					return false;
				}

				database.apartments.updateOne({
					_id: apartment._id
				}, {
					$set: {
						scores: _.reduce(searches, function(result, search) {
							result[search._id] = computeScore(search.criteria, apartment, 1);
							return result;
						}, {})
					}
				}, function(err) {
					if (err) {
						console.log(err);
					}
				});
			});
			return false;
		}

		searches.push(user.searches[0]);
	});
};

module.exports = {
	computeScore: computeScore,
	computeScoreAll: computeScoreAll
};

// setTimeout(module.exports.computeScoreAll, 3000);
