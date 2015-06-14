"use strict";

var _ = require("lodash"),
	firstIteration = true,
	polygonpoints = [],
	turfpoint = require("turf-point"),
	turfconvex = require("turf-convex"),
	turfdistance = require("turf-distance"),
	turfdestination = require("turf-destination"),
	turfbearing = require("turf-bearing"),
	turffeaturecollection = require("turf-featurecollection");

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

function nearestPointNode(graph, tpointorign) {
	var nearestNode;
	var nearestdistance;

	_.forEach(graph, function(node) {
		if (typeof nearestNode === 'undefined') {
			// Set the initial value (should run once)
			nearestNode = node;

			nearestdistance = turfdistance(
				node.tpoint,
				tpointorign,
				'kilometers');
		} else {
			var currentdistance = turfdistance(
				node.tpoint,
				tpointorign,
				'kilometers');

			if (currentdistance < nearestdistance) {
				nearestNode = node;
				nearestdistance = currentdistance;
			}
		}
	});

	return nearestNode;
}

function traversingGraph(
	pointorigin,
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

			currentdistance = turfdistance(
				pointorigin,
				childnode.tpoint,
				'kilometers');
		} else {
			currentdistance = turfdistance(
				parentnode.tpoint,
				childnode.tpoint,
				'kilometers');
		}

		if (initdistance + currentdistance > distancemax) {
			// Compute intermediate distance.
			var currentAngle = turfbearing(
				parentnode.tpoint,
				childnode.tpoint);

			var coordinates = turfdestination(
				parentnode.tpoint,
				distancemax - initdistance,
				currentAngle,
				'kilometers'
			);

			polygonpoints.push(coordinates);

		} else {
			traversingGraph(
				pointorigin,
				childnode,
				Number(initdistance + currentdistance),
				Number(distancemax),
				polygonpoints);
		}
	});
}

module.exports = function(graph, traveltype, timeinmin, lat, lng) {

	var distkilometer = computeDistance(traveltype, timeinmin) / 1000;

	// Reset view node state.
	_.forEach(graph, function(node) {
		node.viewed = false;

		// Add turf point property (should run once)
		if (node.tpoint === undefined) {
			node.tpoint = turfpoint([node.longitude, node.latitude]);
		}
	});

	var pointorigin = turfpoint([Number(lng), Number(lat)]);
	var nearestNode = nearestPointNode(graph, pointorigin);

	firstIteration = true;
	polygonpoints.length = 0;

	traversingGraph(
		pointorigin,
		nearestNode,
		Number(0),
		Number(distkilometer),
		polygonpoints
	);

	var fcpoints = turffeaturecollection(polygonpoints);
	var hull = turfconvex(fcpoints);

	return hull;
};
