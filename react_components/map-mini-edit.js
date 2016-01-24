/* global google, document */

"use strict";

var React = require("react"),
	turfPoint = require("turf-point"),
	turfFeatureCollection = require("turf-featurecollection"),
	turfCenter = require("turf-center"),
	_ = require("lodash");

module.exports = React.createClass({
	componentDidMount: function() {
		this.boroughs = {
			"ahuntsic-cartierville": require("../boroughs/ahuntsic-cartierville"),
			"anjou": require("../boroughs/anjou"),
			"baie-durfe": require("../boroughs/baie-durfe"),
			"beaconsfield": require("../boroughs/beaconsfield"),
			"cote-des-neiges-notre-dame-de-grace": require("../boroughs/cote-des-neiges-notre-dame-de-grace"),
			"cote-saint-luc": require("../boroughs/cote-saint-luc"),
			"dollard-des-ormeaux": require("../boroughs/dollard-des-ormeaux"),
			"dorval": require("../boroughs/dorval"),
			"hampstead": require("../boroughs/hampstead"),
			"ile-bizard-sainte-genevieve": require("../boroughs/ile-bizard-sainte-genevieve"),
			"kirkland": require("../boroughs/kirkland"),
			"lachine": require("../boroughs/lachine"),
			"lasalle": require("../boroughs/lasalle"),
			"le-plateau-mont-royal": require("../boroughs/le-plateau-mont-royal"),
			"le-sud-ouest": require("../boroughs/le-sud-ouest"),
			"mercier-hochelaga-maisonneuve": require("../boroughs/mercier-hochelaga-maisonneuve"),
			"montreal-est": require("../boroughs/montreal-est"),
			"montreal-nord": require("../boroughs/montreal-nord"),
			"montreal-ouest": require("../boroughs/montreal-ouest"),
			"mont-royal": require("../boroughs/mont-royal"),
			"outremont": require("../boroughs/outremont"),
			"pierrefonds-roxboro": require("../boroughs/pierrefonds-roxboro"),
			"pointe-claire": require("../boroughs/pointe-claire"),
			"riviere-des-prairies-pointe-aux-trembles": require("../boroughs/riviere-des-prairies-pointe-aux-trembles"),
			"rosemont-la-petite-patrie": require("../boroughs/rosemont-la-petite-patrie"),
			"sainte-anne-de-bellevue": require("../boroughs/sainte-anne-de-bellevue"),
			"saint-laurent": require("../boroughs/saint-laurent"),
			"saint-leonard": require("../boroughs/saint-leonard"),
			"senneville": require("../boroughs/senneville"),
			"verdun": require("../boroughs/verdun"),
			"ville-marie": require("../boroughs/ville-marie"),
			"villeray-saint-michel-parc-extension": require("../boroughs/villeray-saint-michel-parc-extension"),
			"westmount": require("../boroughs/westmount"),
		};

		if ((this.props.children.polygon === undefined) &&
			(this.props.children.borough === undefined)) {
			console.log("map-mini-edit: no parameters");
			return;
		}

		this.bounds = new google.maps.LatLngBounds();

		// Create the map.
		this.map = new google.maps.Map(
			document.getElementById("map-canvas" + this.props.children.id),
			require("./map-options"));

		// Draw the borough polygon.
		if (this.props.children.borough !== undefined) {

			var boroughCoord = this.boroughs[this.props.children.borough];

			if (boroughCoord !== undefined) {
				this.drawZone(boroughCoord);
			} else {
				console.log("Unknown borough: " + this.props.children.borough);
			}
		}

		// Draw the polygon.
		if (this.props.children.polygon !== undefined) {
			this.drawZone(this.props.children.polygon);
		}

		// Adjust bounds of the map.
		this.map.fitBounds(this.bounds);

		// Apply style to the map.
		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");
	},
	drawZone: function(coordinates) {
		this.path = [];
		this.turfPoints = [];

		_.forEach(coordinates, function(coord) {
			var LatLng = new google.maps.LatLng(coord.lat, coord.lng);

			// Add coordinate to the path for the polygon.
			this.path.push(LatLng);

			// Create a turf polygon.
			this.turfPoints.push(turfPoint([coord.lng, coord.lat]));

			// Extend bound for the map.
			this.bounds.extend(LatLng);
		}, this);

		//
		// Draw polygon.
		//
		var polygon = new google.maps.Polygon({
			path: this.path,
			map: this.map
		});

		polygon.setOptions(require("./polygon-option-selected"));

		//
		// Compute center of the polygon to place a marker.
		//
		var turfPointsFeature = turfFeatureCollection(this.turfPoints);
		var centerPt = turfCenter(turfPointsFeature);

		var center = new google.maps.LatLng(
			centerPt.geometry.coordinates[1],
			centerPt.geometry.coordinates[0]
		);

		new google.maps.Marker({
			position: center,
			map: this.map,
		});
	},
	render: function() {
		return React.createElement("div", {
			id: "map-canvas" + this.props.children.id,
			style: {
				margin: "0px",
				padding: "0px",
				height: "400px"
			}
		});
	}
});
