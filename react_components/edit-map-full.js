/* global module:true, google, document */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	boroughs = require("../boroughs"),
	polygonOptions = require("./polygon-options");

module.exports = React.createClass({
	componentDidMount: function() {
		this.map = new google.maps.Map(document.getElementById("map-canvas-full"), require("./map-options"));

		this.bounds = new google.maps.LatLngBounds();

		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		_.forEach(boroughs, _.bind(function(borough) {
			this.drawZone(borough.coord);
		}, this));

		this.map.fitBounds(this.bounds);
	},
	drawZone: function(coordinates) {
		var path = [];

		_.forEach(coordinates, _.bind(function(coord) {
			var LatLng = new google.maps.LatLng(coord.lat, coord.lng);

			// Add coordinate to the path for the polygon.
			path.push(LatLng);

			// Extend bound for the map.
			this.bounds.extend(LatLng);
		}, this));

		//
		// Draw polygon.
		//
		var polygon = new google.maps.Polygon({path: path, map: this.map});

		polygon.zoneSelected = false;

		polygon.setOptions(polygonOptions.out);

		google.maps.event.addListener(polygon, "mouseover", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(polygonOptions.over);
			}
		});

		google.maps.event.addListener(polygon, "mouseout", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(polygonOptions.out);
			}
		});

		google.maps.event.addListener(polygon, "click", function() {
			if (polygon.zoneSelected) {
				polygon.setOptions(polygonOptions.over);
				polygon.zoneSelected = false;
				this.props.criterion.polygon = [];
			} else {
				polygon.setOptions(polygonOptions.selected);
				polygon.zoneSelected = true;
				this.props.criterion.polygon = coordinates;
			}
		}.bind(this));
	},
	render: function() {
		return React.createElement("div", {
			id: "map-canvas-full",
			style: {
				margin: "0px",
				padding: "0px",
				height: "90%"
			}
		});
	}
});
