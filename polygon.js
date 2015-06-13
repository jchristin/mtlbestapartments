"use strict";

var _ = require("lodash"),
	firstIteration = true,
	polygonpoints = [],
	turfpoint = require("turf-point"),
	turfconvex = require("turf-convex"),
	turffeaturecollection = require("turf-featurecollection"),
	trigohelper = require("./trigohelper.js");

function computeDistance(traveltype, timeinmin) {
	var distmeter = 0;

	switch (traveltype) {
		case 'walking':
			// Average walking speed is 4.86 Km / h
			// 4860 / 60 = 81 meters / minutes.
			distmeter = 81 * timeinmin;
			break;

		case 'bicycling':
			// Average bicycling speed is 15.5 km / h
			// 15500 / 60 = 258.33 meters / minutes.
			distmeter = 258.33 * timeinmin;
			break;

		case 'driving':
			// Average walking speed is 28.64 Km / h
			// 28640 / 60 = 477.33 meters / minutes.
			distmeter = 477.33 * timeinmin;
			break;

		case 'transit':
			// Average bicycling speed is 40.0 km / h
			// 40000 / 60 = 666.66 meters / minutes.
			distmeter = 666.66 * timeinmin;
			break;

		default:
			console.log("Unknown travel type = " + traveltype);
			console.log("Time in minutes = " + timeinmin);
			break;
	}
	return distmeter;
}

function nearestPointNode(graph, latdeg, lngdeg) {
	var nearestNode;
	var nearestdistance;

	_.forEach(graph, function(node) {
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

module.exports = function(graph, traveltype, timeinmin, lat, lng) {

	var distmeter = computeDistance(traveltype, timeinmin);

	// Reset view node state.
	_.forEach(graph, function(node) {
		node.viewed = false;
	});

	var nearestNode = nearestPointNode(graph, lat, lng);

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
		return turfpoint([Number(coord[0]), Number(coord[1])]);
	});

	var fcpoints = turffeaturecollection(points);
	var hull = turfconvex(fcpoints);

	return hull;
};
