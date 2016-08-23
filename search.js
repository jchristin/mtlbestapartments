"use strict";

var _ = require("lodash"),
	moment = require("moment"),
	database = require("./database"),
	match = require("./match");

var updateResult = function(user) {
	database.searches.findOne({
		user: user._id
	}, function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			match.computeScoreSearch(doc);
		}
	});
};

var enableNotificationIfNotSet = function(user) {
	database.searches.updateOne({
		user: user._id,
		notification: {$exists: false}
	}, {
		$set: {
			notification: true
		}
	}, function(err) {
		if (err) {
			console.log(err);
		}
	});
};

var invalidateResult = function(user, callback) {
	database.searches.updateOne({
		user: user._id
	}, {
		$set: {
			result: null
		}
	}, {
		upsert: true
	}, function(err) {
		if (err) {
			console.log(err);
		}

		callback();
	});
};

var keepSearchActive = function(user) {
	database.searches.updateOne({
		user: user._id
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

module.exports.getCriteria = function(req, res, next) {
	database.searches.findOne({
		user: req.user._id
	}, function(err, doc) {
		if (err) {
			next(err);
		} else {
			if (doc === null) {
				res.sendStatus(404);
			} else {
				res.json(doc.criteria);
			}
		}
	});
};

module.exports.createOrUpdateCriteria = function(req, res) {
	// Clear the old results.
	invalidateResult(req.user, res.end);

	// Save the new criteria and re-calculate the matches.
	database.searches.updateOne({
		user: req.user._id
	}, {
		$set: {
			criteria: req.body
		}
	}, {
		upsert: true
	}, function(err) {
		if (err) {
			console.log(err);
		} else {
			updateResult(req.user);
			enableNotificationIfNotSet(req.user);
		}
	});
};

module.exports.remove = function(req, res, next) {
	database.searches.deleteOne({
		name: req.user._id
	}, function(err) {
		if (err) {
			next(err);
		} else {
			res.end();
		}
	});
};

module.exports.updateNotification = function(req, res, next) {
	database.searches.updateOne({
		user: req.user._id
	}, {
		$set: {
			notification: req.params.state === "on"
		}
	}, function(err) {
		if (err) {
			next(err);
		} else {
			res.end();
		}
	});
};

module.exports.getResult = function(req, res, next) {
	keepSearchActive(req.user);

	database.searches.findOne({
		user: req.user._id
	}, function(err, doc) {
		if (err) {
			next(err);
		} else {
			if (doc === null) {
				res.sendStatus(404);
			} else if (doc.result === null) {
				res.json(null);
			} else {
				database.apartments.find({
					_id: {
						$in: doc.result
					}
				}).sort({date: -1}).limit(50).toArray(function(err, docs) {
					if (err) {
						next(err);
					} else {
						res.json({apartments: docs, notification: doc.notification});
					}
				});
			}
		}
	});
};

module.exports.getActiveSearchCount = function(req, res, next) {
	database.searches.count({
		lastSeen: { "$gt": moment().subtract(1, "months").toDate() }
	}, function(err, count) {
		if (err) {
			next(err);
		} else {
			res.json(count);
		}
	});
};

module.exports.deleteOrphanSearches = function(req, res, next) {
	database.users.find().toArray(function(err, users) {
		if (err) {
			next(err);
		} else {
			database.searches.deleteMany({
				user: {
					$nin: _.map(users, "_id")
				}
			}, function(err) {
				if (err) {
					next(err);
				} else {
					res.end();
				}
			});
		}
	});
};

module.exports.usersWithoutSearch = function(req, res, next) {
	database.searches.find().toArray(function(err, searches) {
		if (err) {
			next(err);
		} else {
			database.users.find({
				"_id": {
					$nin: _.map(searches, "user")
				}
			}).toArray(function(err, users) {
				if (err) {
					next(err);
				} else {
					res.json(users);
				}
			});
		}
	});
};
