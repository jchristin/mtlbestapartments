/* global google, document */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	Reflux = require("reflux"),
	apartStore = require("../react_stores/apart-store"),
	zoneStore = require("../react_stores/zone-store"),
	actions = require("../react_stores/actions.js"),
	infoBoxComponent = require("./info-box");

module.exports = React.createClass({
	mixins: [
		Reflux.listenTo(apartStore, "onMapDataChange"),
		Reflux.listenTo(zoneStore, "onZoneChange"),
	],
	createMarker: function(Apt) {
		var position = new google.maps.LatLng(
			Apt.latitude,
			Apt.longitude);

		// Add marker nature
		Apt.marker = new google.maps.Marker({
			position: position,
			map: this.map,
			icon: this.markerIcon,
		});

		google.maps.event.addListener(Apt.marker, 'click', function() {
			this.infoBox.setContent(
				React.renderToStaticMarkup(
					React.createElement(infoBoxComponent, {
						apart: Apt
					})
				)
			);

			this.infoBox.open(this.map, Apt.marker);

			Apt.marker.setIcon(this.markerIconDotViewed);
		}.bind(this));

	},
	createWalkingMarker: function(lat, lng) {
		var position = new google.maps.LatLng(lat, lng);

		this.walkingmarker = new google.maps.Marker({
			position: position,
			map: this.map,
			draggable: true,
		});

		actions.setWalkingZoneCenter([lat, lng]);

		google.maps.event.addListener(this.walkingmarker, 'dragend', function(e) {
			actions.setWalkingZoneCenter([e.latLng.lat(), e.latLng.lng()]);
		}.bind(this));
	},
	clearZones: function() {
		_.forEach(
			this.allZone,
			function(zone) {
				zone.setMap(null);
				zone.setVisible(false);
			}
		);

		this.allZone.length = 0;
	},
	onMapDataChange: function(filteredApt) {

		this.filteredApt = filteredApt;

		if (this.allApt === undefined) {
			this.allApt = _.clone(filteredApt);
		}

		// Check for new marker to create (should run once)
		_.forEach(
			filteredApt,
			function(Apt) {
				if (Apt.marker === undefined) {
					this.createMarker(Apt);
				}

				if (!Apt.marker.getMap()) {
					Apt.marker.setMap(this.map);
				}

			}, this
		);

		_.forEach(
			_.difference(this.allApt, filteredApt),
			function(Apt) {
				Apt.marker.setMap(null);
			}
		);
	},
	drawZone: function(zone) {
		var apath = _.map(
			zone.geometry.coordinates[0],
			function(coord) {
				return new google.maps.LatLng(coord[0], coord[1]);
			}
		);

		return new google.maps.Polygon({
			path: apath,
			strokeColor: "#FF0000",
			strokeOpacity: 0.1,
			strokeWeight: 2,
			map: this.map
		});
	},
	onZoneChange: function(allZones) {
		this.clearZones();

		_.forEach(
			allZones,
			function(zone) {
				var polygon = this.drawZone(zone);
				this.allZone.push(polygon);
			}, this
		);
	},
	componentDidMount: function() {
		var InfoBoxLib = require("google-maps-infobox");

		this.allApt = undefined;
		this.allZone = [];

		this.walkingmarker = undefined;

		var mapOptions = {
			center: new google.maps.LatLng(45.506, -73.556),
			minZoom: 11,
			maxZoom: 16,
			zoom: 12
		};

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

		this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		// Limit the pan zone.
		var lastValidCenter = this.map.getCenter();

		this.allowedBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(45.392061, -73.981247), //...south-west
			new google.maps.LatLng(45.772672, -73.331680) //....north-east
		);

		google.maps.event.addListener(this.map, "center_changed", function() {
			if (this.allowedBounds.contains(this.map.getCenter())) {
				lastValidCenter = this.map.getCenter();
				return;
			}

			this.map.panTo(lastValidCenter);
		}.bind(this));

		google.maps.event.addListener(this.map, "click", function(e) {
			this.infoBox.close();

			if (zoneStore.enableWalkingZone && (this.walkingmarker === undefined)) {
				this.createWalkingMarker(e.latLng.lat(), e.latLng.lng());
			}
		}.bind(this));

		this.infoBox = new InfoBoxLib({
			alignBottom: true,
			disableAutoPan: false,
			pixelOffset: new google.maps.Size(-140, -15),
			zIndex: null,
			closeBoxURL: "",
			infoBoxClearance: new google.maps.Size(15, 50),
			pane: "floatPane",
			enableEventPropagation: false
		});
	},
	render: function() {
		return React.createElement("div", {
			id: "map-canvas"
		});
	}
});
