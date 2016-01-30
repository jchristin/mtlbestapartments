/* global module:true, google, document */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	boroughs = require("../boroughs"),
	polygonOptions = require("./polygon-options");

module.exports = React.createClass({
	componentDidMount: function() {
		this.allZone = [];

		this.map = new google.maps.Map(document.getElementById("map-canvas-full"), require("./map-options"));

		this.bounds = new google.maps.LatLngBounds();

		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		_.forEach(boroughs, _.bind(function(borough) {
			var polygon = this.drawZone(borough.coord);
			this.allZone.push(polygon);
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
		}.bind(this));

		google.maps.event.addListener(polygon, "mouseout", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(polygonOptions.out);
			}
		}.bind(this));

		google.maps.event.addListener(polygon, "click", function() {
			if (polygon.zoneSelected) {
				polygon.setOptions(polygonOptions.over);
				polygon.zoneSelected = false;
			} else {
				polygon.setOptions(polygonOptions.selected);
				polygon.zoneSelected = true;
			}
		}.bind(this));

		return polygon;
	},
	handleClick: function() {
		this.props.history.pushState(null, "/search/new/room");
	},
	render: function() {
		return React.createElement("div", null, React.createElement("button", {
			onClick: this.handleClick
		}, "Validate"), React.createElement("div", {
			id: "map-canvas-full",
			style: {
				margin: "0px",
				padding: "0px",
				height: "90%"
			}
		}));
	}
});
