"use strict";

var _ = require("lodash"),
	firstIteration = true,
	polygonpoints = [],
	tpoint = require("turf-point"),
	tconvex = require("turf-convex"),
	tfeaturecollection = require("turf-featurecollection"),
	trigohelper = require("./trigohelper.js");

function nearestPointNode(osm, latdeg, lngdeg) {
	var nearestNode;
	var nearestdistance;

	_.forEach(osm.graph, function(node) {
		if (typeof nearestNode === 'undefined') {
			nearestNode = node;

			nearestdistance = trigohelper.distanceMeter(
				node.latitude,
				node.longitude,
				latdeg,
				lngdeg);
		} else {
			var currentdistance = trigohelper.distanceMeter(
				node.latitude,
				node.longitude,
				latdeg,
				lngdeg);

			if (currentdistance < nearestdistance) {
				nearestNode = node;
				nearestdistance = currentdistance;
			}
		}
	});

	return nearestNode;
}

function traversingGraph(
	centerlat,
	centerlng,
	parentnode,
	initdistance,
	distancemax,
	polygonpoints) {

	_.forEach(parentnode.edges, function(childnode) {

		if ((typeof childnode === 'undefined') || childnode.viewed) {
			return;
		}

		childnode.viewed = true;

		var currentdistance = 0;

		if (firstIteration === true) {
			firstIteration = false;

			currentdistance = trigohelper.distanceMeter(
				centerlat,
				centerlng,
				childnode.latitude,
				childnode.longitude
			);
		} else {
			currentdistance = trigohelper.distanceMeter(
				parentnode.latitude,
				parentnode.longitude,
				childnode.latitude,
				childnode.longitude
			);
		}

		if (initdistance + currentdistance > distancemax) {
			// Compute intermediate distance.
			var currentAngle = trigohelper.coodinatesAngle(
				parentnode.latitude,
				parentnode.longitude,
				childnode.latitude,
				childnode.longitude
			);

			var coordinates = trigohelper.destinationPoint(
				parentnode.latitude,
				parentnode.longitude,
				distancemax - initdistance,
				currentAngle
			);

			var angleFromCenter = trigohelper.coodinatesAngle(
				Number(centerlat).toFixed(7),
				Number(centerlng).toFixed(7),
				Number(coordinates[0]).toFixed(7),
				Number(coordinates[1]).toFixed(7)
			);

			polygonpoints.push([
				Number(coordinates[0]).toFixed(7),
				Number(coordinates[1]).toFixed(7),
				Number(angleFromCenter).toFixed(7)
			]);

		} else {
			traversingGraph(
				centerlat,
				centerlng,
				childnode,
				Number(initdistance + currentdistance),
				Number(distancemax),
				polygonpoints);
		}
	});
}

module.exports = function(osm, distmeter, lat, lng) {

	// Reset view node state.
	_.forEach(osm.graph, function(node) {
		node.viewed = false;
	});

	var nearestNode = nearestPointNode(osm, lat, lng);

	firstIteration = true;
	polygonpoints.length = 0;

	traversingGraph(
		lat,
		lng,
		nearestNode,
		Number(0),
		Number(distmeter),
		polygonpoints
	);

	var points = _.map(polygonpoints, function(coord) {
		return tpoint([Number(coord[0]), Number(coord[1])]);
	});

	var fcpoints = tfeaturecollection(points);
	var hull = tconvex(fcpoints);

	return hull;
};
