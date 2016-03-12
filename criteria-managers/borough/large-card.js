/* global google, document */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	boroughs = require("../../boroughs"),
	mapSettings = require("../map-settings");

module.exports = React.createClass({
	componentDidMount: function() {
		this.map = new google.maps.Map(
			document.getElementById("map-canvas-full"),
			mapSettings.options);

		this.bounds = new google.maps.LatLngBounds();

		var styledMap = new google.maps.StyledMapType(mapSettings.style);
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		_.forEach(boroughs, _.bind(function(borough, id) {
			this.drawBorough(borough, id);
		}, this));

		this.map.fitBounds(this.bounds);
	},
	drawBorough: function(borough, id) {
		var path = [];

		_.forEach(borough.coord, _.bind(function(coord) {
			var latLng = new google.maps.LatLng(coord[1], coord[0]);
			path.push(latLng);
			this.bounds.extend(latLng);
		}, this));

		// Draw polygon.
		var polygon = new google.maps.Polygon({path: path, map: this.map});

		polygon.zoneSelected = this.props.criterion.boroughs.indexOf(id) != -1;
		if (polygon.zoneSelected) {
			polygon.setOptions(mapSettings.polygon.selected);
		} else {
			polygon.setOptions(mapSettings.polygon.out);
		}

		google.maps.event.addListener(polygon, "mouseover", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(mapSettings.polygon.over);
			}
		});

		google.maps.event.addListener(polygon, "mouseout", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(mapSettings.polygon.out);
			}
		});

		google.maps.event.addListener(polygon, "click", function() {
			if (polygon.zoneSelected) {
				polygon.setOptions(mapSettings.polygon.over);
				polygon.zoneSelected = false;
				_.pull(this.props.criterion.boroughs, id);
			} else {
				polygon.setOptions(mapSettings.polygon.selected);
				polygon.zoneSelected = true;
				this.props.criterion.boroughs.push(id);
			}
		}.bind(this));
	},
	render: function() {
		return React.createElement("div", {
			id: "map-canvas-full"
		});
	}
});
