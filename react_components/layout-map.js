/* global module:true, google, document */

"use strict";

var React = require("react"),
	_ = require("lodash"),
	mapSettings = require("../criteria-managers/map-settings");

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	componentDidMount: function() {

		// Create marker icons (dot and pin)
		this.markerIconDot = {
			url: "img/marker-dot.png",
			size: new google.maps.Size(10, 10),
			anchor: new google.maps.Point(5, 5)
		};

		this.markerIconDotViewed = {
			url: "img/marker-dot-viewed.png",
			size: new google.maps.Size(10, 10),
			anchor: new google.maps.Point(5, 5)
		};

		this.markerIcon = this.markerIconDot;

		// Create the map.
		this.map = new google.maps.Map(document.getElementById("map-canvas-full"), mapSettings.options);

		// Apply style to the map.
		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		this.bounds = new google.maps.LatLngBounds();

		// Place marker.
		this.marker = [];
		this.marker = _.map(this.props.apartments, _.bind(function(apart) {
			var position = new google.maps.LatLng(apart.coord[1], apart.coord[0]);

			this.bounds.extend(position);

			var marker = new google.maps.Marker({position: position, map: this.map, icon: this.markerIcon});

			marker.addListener('click', function() {
				this.context.router.push("/a/" + apart._id);
			}.bind(this));

			return marker;
		}, this));

		this.map.fitBounds(this.bounds);
	},
	render: function() {
		return React.DOM.div({id: "map-canvas-full"});
	}
});
