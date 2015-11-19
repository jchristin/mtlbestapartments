/* global google, document */

"use strict";

var React = require("react");

module.exports = React.createClass({

	componentDidMount: function() {
		var center = new google.maps.LatLng(
			this.props.coord[1],
			this.props.coord[0]);

		var mapOptions = {
			center: center,
			zoom: 15,
			draggable: false,
			scrollwheel: false,
			disableDoubleClickZoom: true,
			zoomControl: false
		};

		// Create the map.
		this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		// Apply style to the map.
		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		// Place marker.
		this.marker = new google.maps.Marker({
			position: center,
			map: this.map,
		});
	},
	render: function() {
		return React.createElement("div", {
			id: "map-canvas"
		});
	}
});
