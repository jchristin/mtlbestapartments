"use strict";

var _ = require("lodash"),
	ObjectID = require("mongodb").ObjectID,
	turfInside = require("turf-inside"),
	turfPoint = require("turf-point"),
	turfPolygon = require("turf-polygon"),
	database = require("./database"),
	boroughs = require("./boroughs");

// Construct a turf polygon for each borough.
_.forEach(boroughs, function(borough, key) {
	var turfCoords = _.map(borough.coord, function(coord) {
		return [coord.lng, coord.lat];
	});

	borough.turfPolygon = turfPolygon([turfCoords], {
		name: key
	});
});

var getBoroughName = function(coord) {
	var borough = _.find(boroughs, function(b) {
		return turfInside(turfPoint(coord), b.turfPolygon);
	});

	return borough !== undefined ? borough.turfPolygon.properties.name : "Montreal";
};

var normalizeApart = function(apart) {
	apart.borough = getBoroughName(apart.coord);
};

var addOrUpdateApart = function(apart, callback) {
	normalizeApart(apart);

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
