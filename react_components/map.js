/* global google, document */

"use strict";

var React = require("react"),
	_ = require("lodash"),
	apartStore = require("../react_stores/apart-store"),
	zoneStore = require("../react_stores/zone-store");

module.exports = React.createClass({
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
			content += Apt.url;
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
			}, this
		);

		this.allZone.length = 0;
	},
	onMapDataChange: function(filteredApt) {

		if (this.allApt === undefined) {
			this.allApt = _.clone(filteredApt);
		}

		// Check for new marker to create (should run once)
		_.forEach(
			filteredApt,
			function(Apt) {
				if (Apt.marker === undefined) {
					// Create icon if not present.
					var position = new google.maps.LatLng(
						Apt.latitude,
						Apt.longitude);

					// Add marker nature
					Apt.marker = new google.maps.Marker({
						position: position,
						map: this.map,
						icon: this.markerIcon,
					});

					Apt.viewed = false;

					google.maps.event.addListener(Apt.marker, 'click', function() {
						this.updateinfowindow(Apt);
						this.infowindow.open(this.map, Apt.marker);
						Apt.marker.setIcon(this.markerIconDotViewed);
						Apt.viewed = true;
					}.bind(this));
				}

				if (!Apt.marker.getMap()) {
					Apt.marker.setMap(this.map);
				}

			}, this);

		// Diffing old vs new tab to hide makers.
		_.forEach(
			_.difference(this.allApt, filteredApt),
			function(Apt) {
				Apt.marker.setMap(null);
			});
	},
	handleZoomChanged: function(currentZoom) {

		var usePin = false;
		var iconNeedUpdate = false;

		if (this.allApt !== undefined) {
			// Check if zoom change require marker icon update.
			if (currentZoom !== this.zoom) {

				if ((currentZoom >= 15) && (this.zoom < 15)) {
					iconNeedUpdate = true;
					usePin = true;
				} else if ((currentZoom < 15) && (this.zoom >= 15)) {
					iconNeedUpdate = true;
					usePin = false;
				}

				this.zoom = currentZoom;
			}

			if (iconNeedUpdate) {

				_.forEach(
					this.allApt,
					function(Apt) {
						var markerIcon;

						// Compute marker icon to set.
						if (usePin) {
							markerIcon = this.markerIconPin;
						} else {
							markerIcon = (Apt.viewed) ? this.markerIconDotViewed : this.markerIconDot;
						}

						this.markerIcon = markerIcon;
						Apt.marker.setIcon(this.markerIcon);
					}.bind(this)
				);
			}
		}
	},
	onZoneChange: function(allZones) {
		this.clearZones();

		if (allZones.length) {
			// Build coordonates.
			_.forEach(
				allZones,
				function(zone) {
					var apath = [];
					_.forEach(
						zone.geometry.coordinates,
						function(coordinate) {
							var latlng = new google.maps.LatLng(
								coordinate[0],
								coordinate[1]);

							apath.push(latlng);
						}, this
					);

					var polygon = new google.maps.Polygon({
						path: apath,
						strokeColor: "#FF0000",
						strokeOpacity: 0.1,
						strokeWeight: 2,
						map: this.map
					});

					this.allZone.push(polygon);
				}, this
			);
		}
	},
	componentWillUnmount: function() {
		this.unsubscribeMap();
		this.unsubscribeZone();
	},
	componentDidMount: function() {
		this.allApt = undefined;
		this.allZone = [];
		this.zoom = 12;

		var mapOptions = {
			center: new google.maps.LatLng(45.506, -73.556),
			zoom: this.zoom
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

		this.markerIconPin = {
			url: "img/marker-pin-fleub.png",
			size: new google.maps.Size(60, 50),
			anchor: new google.maps.Point(16, 50)
		};

		this.markerIcon = this.markerIconDot;

		this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		this.infowindow = new google.maps.InfoWindow();

		google.maps.event.addListener(this.map, 'zoom_changed', function() {
			this.handleZoomChanged(this.map.getZoom());
		}.bind(this));

		this.unsubscribeMap = apartStore.listen(this.onMapDataChange);
		this.unsubscribeZone = zoneStore.listen(this.onZoneChange);
	},
	render: function() {
		return React.createElement("div", {
			id: 'map-canvas'
		});
	}
});
