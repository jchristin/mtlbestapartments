/* global module:true, google, document */

"use strict";

var React = require("react"),
	_ = require("lodash"),
	boroughs = require("../boroughs");

module.exports = React.createClass({
	componentDidMount: function() {
		this.allZone = [];

		this.map = new google.maps.Map(
			document.getElementById(this.props.id),
			require("./map-options"));

		this.bounds = new google.maps.LatLngBounds();

		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		_.forEach(boroughs, function(borough) {
				var polygon = this.drawZone(borough.coord);
				this.allZone.push(polygon);
			},
			this
		);

		this.map.fitBounds(this.bounds);
	},
	drawZone: function(coordinates) {
		var path = [];

		_.forEach(coordinates, function(coord) {
			var LatLng = new google.maps.LatLng(coord.lat, coord.lng);

			// Add coordinate to the path for the polygon.
			path.push(LatLng);

			// Extend bound for the map.
			this.bounds.extend(LatLng);
		}, this);

		//
		// Draw polygon.
		//
		var polygon = new google.maps.Polygon({
			path: path,
			map: this.map
		});

		polygon.zoneSelected = false;

		polygon.setOptions(require("./polygon-option-out"));

		google.maps.event.addListener(polygon, "mouseover", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(require("./polygon-option-over"));
			}
		}.bind(this));

		google.maps.event.addListener(polygon, "mouseout", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(require("./polygon-option-out"));
			}
		}.bind(this));

		google.maps.event.addListener(polygon, "click", function() {
			if (polygon.zoneSelected) {
				polygon.setOptions(require("./polygon-option-over"));
				polygon.zoneSelected = false;
			} else {
				polygon.setOptions(require("./polygon-option-selected"));
				polygon.zoneSelected = true;
			}
		}.bind(this));

		return polygon;
	},
	render: function() {
		return React.createElement("div", {
			id: this.props.id,
			style: {
				margin: "0px",
				padding: "0px",
				height: this.props.height
			}
		});
	}
});
