/* global google, document */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	boroughs = require("../boroughs"),
	polygonOptions = require("./polygon-options");

module.exports = React.createClass({
	componentDidMount: function() {
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
			var boroughCoord = boroughs[this.props.children.borough].coord;

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

		_.forEach(coordinates, _.bind(function(coord) {
			var LatLng = new google.maps.LatLng(coord.lat, coord.lng);

			// Add coordinate to the path for the polygon.
			this.path.push(LatLng);

			// Extend bound for the map.
			this.bounds.extend(LatLng);
		}, this));

		//
		// Draw polygon.
		//
		var polygon = new google.maps.Polygon({
			path: this.path,
			map: this.map
		});

		polygon.setOptions(polygonOptions.selected);

		new google.maps.Marker({
			position: this.bounds.getCenter(),
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
