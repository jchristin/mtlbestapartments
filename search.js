"use strict";

var database = require("./database");

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
	database.searches.updateOne({
		user: req.user._id
	}, {
		$set: {
			criteria: req.body
		}
	}, function(err) {
		if (err) {
			console.log(err);
			res.status(500).send("Server error. Please retry later.");
		} else {
			res.end();
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
	res.json(null);
};
