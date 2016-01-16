"use strict";

var ObjectID = require("mongodb").ObjectID,
	database = require("./database");

var addOrUpdateApart = function(apart, callback) {
	database.apartments.update({
			_id: apart._id
		}, apart, {
			upsert: true
		},
		function(err) {
			callback(err);
		}
	);
};

module.exports.addApart = function(req, res) {
	addOrUpdateApart(req.body, function(err) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.end();
		}
	});
};

module.exports.updateApart = function(req, res) {
	addOrUpdateApart(req.body, function(err) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.end();
		}
	});
};

module.exports.getApart = function(req, res) {
	database.apartments.findOne({
		_id: new ObjectID(req.params.id),
	}, function(err, doc) {
		if (err) {
			console.log(err);
			res.sendStatus(404);
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
