"use strict";

var ObjectID = require("mongodb").ObjectID,
	database = require("./database");

module.exports.addApart = function(req, res) {
	res.end();
};

module.exports.updateApart = function(req, res) {
	res.end();
};

module.exports.getApart = function(req, res) {
	if (typeof req.query === "undefined") {
		res.status(404).send("Invalid flat.");
		return;
	}

	database.apartments.findOne({
		_id: new ObjectID(req._parsedUrl.query),
	}, function(err, doc) {
		if (err) {
			console.log(err);
			res.status(404).send("Invalid flat.");
		} else {
			res.json(doc);
		}
	});
};

module.exports.getStaffPicks = function(req, res) {
	database.apartments.find({
		active: true,
	}).sort({
		"date": -1
	}).limit(50).toArray(function(err, docs) {
		if (err) {
			console.log(err);
		} else {
			res.json(docs);
		}
	});
};
