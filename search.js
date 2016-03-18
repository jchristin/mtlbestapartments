"use strict";

var database = require("./database"),
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

module.exports.getCriteria = function(req, res) {
	database.searches.findOne({
		user: req.user._id
	}, function(err, doc) {
		if (err) {
			console.log(err);
			res.status(500).send("Server error. Please retry later.");
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
	invalidateResult(req.user, res.end);

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
			res.status(500).send("Server error. Please retry later.");
		} else {
			updateResult(req.user);
		}
	});
};

module.exports.remove = function(req, res) {
	database.searches.deleteOne({
		name: req.user._id
	}, function(err) {
		if (err) {
			console.log(err);
			res.status(500).end();
		} else {
			res.end();
		}
	});
};

module.exports.getResult = function(req, res) {
	database.searches.findOne({
		user: req.user._id
	}, function(err, doc) {
		if (err) {
			console.log(err);
			res.status(500).send("Server error. Please retry later.");
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
						console.log(err);
					} else {
						res.json(docs);
					}
				});
			}
		}
	});
};
