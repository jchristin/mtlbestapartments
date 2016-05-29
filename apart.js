"use strict";

var _ = require("lodash"),
	co = require("co"),
	ObjectID = require("mongodb").ObjectID,
	request = require("superagent"),
	turfInside = require("turf-inside"),
	turfPoint = require("turf-point"),
	turfPolygon = require("turf-polygon"),
	database = require("./database"),
	match = require("./match"),
	boroughs = require("./boroughs"),
	googleApiKeys = [
		process.env.GOOGLE_API_KEY_1,
		process.env.GOOGLE_API_KEY_2,
		process.env.GOOGLE_API_KEY_3,
		process.env.GOOGLE_API_KEY_4,
	];

// Construct a turf polygon for each borough.
_.forEach(boroughs, function(borough) {
	borough.turfPolygon = turfPolygon([borough.coord], {
		name: borough.name
	});
});

// Return false is apart is not valid.
var filterApart = function(apart) {
	if(!apart.borough) {
		return false;
	}

	return true;
};

var getBorough = function(coord) {
	if(!coord) {
		return null;
	}

	var borough = null;
	_.forEach(boroughs, function(value, key) {
		if(turfInside(turfPoint(coord), value.turfPolygon)) {
			borough = key;
			return false;
		}
	});

	return borough;
};

var checkAddress = co.wrap(function* (address) {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
		address +
		"&components=administrative_area:Québec&key=" +
		googleApiKeys[0];

	var response = yield request.get(url);

	switch(response.body.status) {
		case "OK":
			var result = response.body.results[0];
			return result.formatted_address == "Québec, Canada" ? null : result;

		case "ZERO_RESULTS":
			return null;

		case "OVER_QUERY_LIMIT":
			googleApiKeys.push(googleApiKeys.shift());

		default:
			throw new Error(response.body.status);
	}
});

var normalizeAddress = co.wrap(function* (address) {
	var result = yield checkAddress(encodeURIComponent(address));

	// If fails, try another address form.
	if(!result) {
		result = yield checkAddress(_.words(_.deburr(address)));
	}

	return result;
});

var normalizeApart = co.wrap(function* (apart) {
	apart._id = new ObjectID(apart._id);
	apart.date = apart.date ? new Date(apart.date) : new Date();

	apart.coord = null;
	var result = yield normalizeAddress(apart.address);
	if(result) {
		apart.formattedAddress = result.formatted_address;
		apart.coord = [result.geometry.location.lng, result.geometry.location.lat];
	}

	apart.borough = getBorough(apart.coord);
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

module.exports.normalizeApart = normalizeApart;
