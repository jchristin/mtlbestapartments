/* global google, document */

"use strict";

var React = require("react"),
	_ = require("lodash"),
	apartStore = require("../react_stores/apart-store");

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

					var markerIcon = {
						url: "img/marker-dot.png",
						size: new google.maps.Size(60, 50),
						anchor: new google.maps.Point(16, 50)
					};

					// Add marker nature
					Apt.marker = new google.maps.Marker({
						position: position,
						map: this.map,
						icon: markerIcon,
					});

					google.maps.event.addListener(Apt.marker, 'click', function() {
						this.updateinfowindow(Apt);
						this.infowindow.open(this.map, Apt.marker);
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

	componentDidMount: function() {
		this.allApt = undefined;

		var mapOptions = {
			center: this.mapCenterLatLng(),
			zoom: 12
		};

		this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		this.setMapStyle();

		this.infowindow = new google.maps.InfoWindow();
		this.unsubscribe = apartStore.listen(this.onMapDataChange);
	},

	componentWillUnmount: function() {
		this.unsubscribe();
	},

	mapCenterLatLng: function() {
		return new google.maps.LatLng(45.506, -73.556);
	},

	setMapStyle: function() {
		var styles = [{
			"stylers": [{
				"visibility": "on"
			}, {
				"saturation": -100
			}, {
				"gamma": 0.54
			}]

			// Global features
		}, {
			"featureType": "all",
			"elementType": "labels.text.fill",
			"stylers": [{
				"saturation": 100
			}, {
				"color": "#1e292c"
			}]
		}, {
			"featureType": "poi",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "simplified"
			}]

			// Road features
		}, {
			"featureType": "road",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "road",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#ffffff"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "road",
			"elementType": "geometry.stroke",
			"stylers": [{
				"gamma": 7.18
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "geometry",
			"stylers": [{
				"hue": "#0e1b1f"
			}, {
				"saturation": -88
			}, {
				"lightness": 54
			}, {
				"visibility": "simplified"
			}]

			// Miscelaneous features
		}, {
			"featureType": "water",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#0e1b1f"

			}]
		}, {
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [{
				"color": "#91bed4"
			}]

			// Subway features
		}, {
			"featureType": "transit.station",
			"elementType": "labels.icon",
			"stylers": [{
				"hue": "#85a0a7"
			}, {
				"saturation": 50
			}, {
				"visibility": "simplified"
			}]
		}, {
			"featureType": "transit.line",
			"elementType": "geometry",
			"stylers": [{
				"gamma": 0.48
			}, {
				"visibility": "on"
			}]
		}];

		// Create a new StyledMapType object, passing it the array of styles,
		// as well as the name to be displayed on the map type control.
		var styledMap = new google.maps.StyledMapType(styles, {
			name: 'map_style'
		});

		this.map.mapTypes.set('map_style', styledMap);
		this.map.setMapTypeId('map_style');
	},

	render: function() {
		return React.createElement("div", {
			id: 'map-canvas'
		});
	}
});
