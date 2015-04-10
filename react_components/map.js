/* global google, document */

"use strict";

var React = require("react"),
	Reflux = require("reflux"),
	_ = require("lodash"),
	apartStore = require("../react_stores/apart-store"),
	zoneStore = require("../react_stores/zone-store");

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
			this.updateinfowindow(Apt);
			this.infowindow.open(this.map, Apt.marker);
			Apt.marker.setIcon(this.markerIconDotViewed);
		}.bind(this));

	},
	updateinfowindow: function(Apt) {
		var content = '';

		if (Apt.image !== null) {
			content += '<div align="center">';
			content += '<img src="';
			content += Apt.image;
			content += '" width="300" ALIGN="middle" />';
			content += '</div>';
		}

		if (Apt.url !== null) {
			content += '<div align="center">';
			content += '<a href="';
			content += Apt._id;
			content += '" target=_blank>';
			content += 'link';
			content += '</a>';
			content += '</div>';
		}

		content += '</div>';

		this.infowindow.setContent(content);
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
		this.allApt = undefined;
		this.allZone = [];

		var mapOptions = {
			center: new google.maps.LatLng(45.506, -73.556),
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

		this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		this.infowindow = new google.maps.InfoWindow();
	},
	render: function() {
		return React.createElement("div", {
			id: 'map-canvas'
		});
	}
});
