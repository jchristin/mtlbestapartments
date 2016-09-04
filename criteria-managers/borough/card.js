/* global google, document */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	boroughs = require("../../boroughs"),
	mapSettings = require("../map-settings");

module.exports = React.createClass({
	componentWillMount: function() {
		this.mapUid = _.uniqueId("map-canvas-");
	},
	componentDidMount: function() {
		// Create the map.
		var map = new google.maps.Map(
			document.getElementById(this.mapUid),
			mapSettings.options
		);

		var bounds = new google.maps.LatLngBounds();

		// Draw the boroughs.
		_.forEach(this.props.criterion.boroughs, _.bind(function(borough) {
			var path = [];

			_.forEach(boroughs[borough].coord, _.bind(function(coord) {
				var latLng = new google.maps.LatLng(coord[1], coord[0]);
				path.push(latLng);
				bounds.extend(latLng);
			}, this));

			var polygon = new google.maps.Polygon({
				path: path,
				map: map
			});

			polygon.setOptions(mapSettings.polygon.selected);
		}, this));

		// Adjust bounds of the map.
		map.fitBounds(bounds);

		// Apply style to the map.
		var styledMap = new google.maps.StyledMapType(mapSettings.style);
		map.mapTypes.set("map-style", styledMap);
		map.setMapTypeId("map-style");
	},
	render: function() {
		return React.DOM.div({
			id: this.mapUid,
			style: {
				margin: "0px",
				padding: "0px",
				height: "400px"
			}
		});
	}
});
