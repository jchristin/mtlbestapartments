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

					// Add marker nature
					Apt.marker = new google.maps.Marker({
						position: position,
						map: this.map,
						icon: this.markerIcon,
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
	componentWillUnmount: function() {
		this.unsubscribe();
	},
	componentDidMount: function() {
		this.allApt = undefined;

		var mapOptions = {
			center: new google.maps.LatLng(45.506, -73.556),
			zoom: 12
		};

		this.markerIcon = {
			url: "img/marker-dot.png",
			size: new google.maps.Size(10, 10),
			anchor: new google.maps.Point(5, 5)
		};

		this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

		this.infowindow = new google.maps.InfoWindow();
		this.unsubscribe = apartStore.listen(this.onMapDataChange);
	},
	render: function() {
		return React.createElement("div", {
			id: 'map-canvas'
		});
	}
});
