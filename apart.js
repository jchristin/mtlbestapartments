"use strict";

var _ = require("lodash"),
	co = require("co"),
	ObjectID = require("mongodb").ObjectID,
	request = require("superagent"),
	turfInside = require("turf-inside"),
	turfPoint = require("turf-point"),
	turfPolygon = require("turf-polygon"),
	turfFeaturecollection = require("turf-featurecollection"),
	turfConvex = require("turf-convex"),
	database = require("./database"),
	match = require("./match"),
	boroughs = require("./boroughs");

// Construct a turf polygon for each borough.
_.forEach(boroughs, function(borough) {
	borough.turfPolygon = turfPolygon([borough.coord], {
		name: borough.name
	});
});

// Construct a turf polygon for Montreal.
var points = [];
_.forEach(boroughs, function(borough) {
	_.forEach(borough.coord, function(coordinate) {
		points.push(turfPoint(coordinate));
	});
});

var turfPolygonMontreal = turfConvex(turfFeaturecollection(points));

var filterApart = function(apart) {
	if (!turfInside(turfPoint(apart.coord), turfPolygonMontreal)) {
		return false;
	}

	return true;
};

var getBoroughName = function(coord) {
	if(!coord) {
		return "Montreal";
	}

	var borough = _.find(boroughs, function(b) {
		return turfInside(turfPoint(coord), b.turfPolygon);
	});

	return borough !== undefined ? borough.turfPolygon.properties.name : "Montreal";
};

var normalizeApart = co.wrap(function* (apart) {
	apart._id = new ObjectID(apart._id);
	apart.date = apart.date ? new Date(apart.date) : new Date();
	apart.last = new Date();

	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
		_.words(_.deburr(apart.address)) +
		"&components=administrative_area:QC&key=" +
		process.env.GOOGLE_API_KEY;

	var response = yield request.get(url);
	var result = response.body.results[0];

	apart.formattedAddress = result.formatted_address;
	apart.coord = [result.geometry.location.lng, result.geometry.location.lat];
	apart.borough = getBoroughName(apart.coord);
});

var updateApart = function(apart) {
	return function(done) {
		database.apartments.updateOne({
			_id: apart._id
		}, apart, {
			upsert: true
		},
		function(err) {
			done(err);
		});
	};
};

module.exports.addOrUpdateApart = function(req, res) {
	co(function* () {
		yield normalizeApart(req.body);

		if(!filterApart(req.body)) {
			res.sendStatus(400);
		} else {
			yield updateApart(req.body);

			res.end();
			match.computeScoreApartement(req.body);
		}
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
};

module.exports.deactivateApart = function(req, res) {
	database.apartments.updateOne({
		_id: new ObjectID(req.body._id)
	}, {
		$set: {
			active: false
		}
	}, function(err) {
		if (err) {
			console.log(err);
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

module.exports.getLatest = function(req, res) {
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
