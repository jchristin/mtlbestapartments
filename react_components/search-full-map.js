/* global module:true, google, document */

"use strict";

var React = require("react"),
	_ = require("lodash");

module.exports = React.createClass({
	componentDidMount: function() {
		this.boroughs = {
			"ahuntsic-cartierville": require("../boroughs/ahuntsic-cartierville"),
			"anjou": require("../boroughs/anjou"),
			"baie-durfe": require("../boroughs/baie-durfe"),
			"beaconsfield": require("../boroughs/beaconsfield"),
			"cote-des-neiges-notre-dame-de-grace": require("../boroughs/cote-des-neiges-notre-dame-de-grace"),
			"cote-saint-luc": require("../boroughs/cote-saint-luc"),
			"dollard-des-ormeaux": require("../boroughs/dollard-des-ormeaux"),
			"dorval": require("../boroughs/dorval"),
			"hampstead": require("../boroughs/hampstead"),
			"ile-bizard-sainte-genevieve": require("../boroughs/ile-bizard-sainte-genevieve"),
			"kirkland": require("../boroughs/kirkland"),
			"lachine": require("../boroughs/lachine"),
			"lasalle": require("../boroughs/lasalle"),
			"le-plateau-mont-royal": require("../boroughs/le-plateau-mont-royal"),
			"le-sud-ouest": require("../boroughs/le-sud-ouest"),
			"mercier-hochelaga-maisonneuve": require("../boroughs/mercier-hochelaga-maisonneuve"),
			"montreal-est": require("../boroughs/montreal-est"),
			"montreal-nord": require("../boroughs/montreal-nord"),
			"montreal-ouest": require("../boroughs/montreal-ouest"),
			"mont-royal": require("../boroughs/mont-royal"),
			"outremont": require("../boroughs/outremont"),
			"pierrefonds-roxboro": require("../boroughs/pierrefonds-roxboro"),
			"pointe-claire": require("../boroughs/pointe-claire"),
			"riviere-des-prairies-pointe-aux-trembles": require("../boroughs/riviere-des-prairies-pointe-aux-trembles"),
			"rosemont-la-petite-patrie": require("../boroughs/rosemont-la-petite-patrie"),
			"sainte-anne-de-bellevue": require("../boroughs/sainte-anne-de-bellevue"),
			"saint-laurent": require("../boroughs/saint-laurent"),
			"saint-leonard": require("../boroughs/saint-leonard"),
			"senneville": require("../boroughs/senneville"),
			"verdun": require("../boroughs/verdun"),
			"ville-marie": require("../boroughs/ville-marie"),
			"villeray-saint-michel-parc-extension": require("../boroughs/villeray-saint-michel-parc-extension"),
			"westmount": require("../boroughs/westmount"),
		};

		this.allZone = [];

		var mapOptions = {
			center: new google.maps.LatLng(45.506, -73.556),
			zoomControl: false, // Remove +/- buttons from the map
			streetViewControl: false, // Remove wingman from the map
			mapTypeControl: false, // Remove Map/Sat choice
			scrollwheel: false, // Remove scrollwheel zoom handle.
			draggable: false, // Remove draggable/movable map option.
			disableDoubleClickZoom: true, // Remove double click zoom option.
		};

		// Polygon option definitions.
		this.polygonOptionOver = {
			fillColor: "#FF0000",
			fillOpacity: 0.25,
			strokeOpacity: 0.1,
			strokeWeight: 2,
		};

		this.polygonOptionSelected = {
			fillColor: "#FF0000",
			fillOpacity: 0.5,
			strokeOpacity: 0.1,
			strokeWeight: 2,
		};

		this.polygonOptionOut = {
			fillColor: "#000000",
			fillOpacity: 0,
			strokeOpacity: 0,
			strokeWeight: 0,
		};

		// Create marker icons (dot and pin)
		this.markerIconDot = {
			url: "/img/marker-dot.png",
			size: new google.maps.Size(10, 10),
			anchor: new google.maps.Point(5, 5)
		};

		this.markerIconDotViewed = {
			url: "/img/marker-dot-viewed.png",
			size: new google.maps.Size(10, 10),
			anchor: new google.maps.Point(5, 5)
		};

		this.markerIcon = this.markerIconDot;

		this.map = new google.maps.Map(document.getElementById(this.props.id), mapOptions);
		this.bounds = new google.maps.LatLngBounds();

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

		_.forEach(
			this.boroughs,
			function(borough) {
				var polygon = this.drawZone(borough);
				this.allZone.push(polygon);
			}, this
		);

		this.map.fitBounds(this.bounds);
	},
	drawZone: function(coordinates) {
		var path = [];

		_.forEach(coordinates, function(coord) {
			var LatLng = new google.maps.LatLng(coord.lat, coord.lng);

			// Add coordinate to the path for the polygon.
			path.push(LatLng);

			// Extend bound for the map.
			this.bounds.extend(LatLng);
		}, this);

		//
		// Draw polygon.
		//
		var polygon = new google.maps.Polygon({
			path: path,
			fillColor: "#000000",
			fillOpacity: 0,
			strokeOpacity: 0,
			strokeWeight: 0,
			map: this.map
		});

		// test
		// polygon.markers = _.map(coordinates, function(coord, i) {
		// 	var position = new google.maps.LatLng(coord.lat, coord.lng);
		// 	return new google.maps.Marker({
		// 		position: position,
		// 		map: null,
		// 		title: "Marker #" + i
		// 	}, this);
		// }, this);
		// test

		polygon.zoneSelected = false;

		polygon.setOptions(this.polygonOptionOut);

		google.maps.event.addListener(polygon, "mouseover", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(this.polygonOptionOver);
			}
		}.bind(this));

		google.maps.event.addListener(polygon, "mouseout", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(this.polygonOptionOut);
			}
		}.bind(this));

		google.maps.event.addListener(polygon, "click", function() {
			if (polygon.zoneSelected) {
				polygon.setOptions(this.polygonOptionOut);
				polygon.zoneSelected = false;
			} else {
				polygon.setOptions(this.polygonOptionSelected);
				polygon.zoneSelected = true;
			}

			// test
			// _.forEach(
			// 	polygon.markers,
			// 	function(marker) {
			// 		if (polygon.zoneSelected) {
			// 			marker.setMap(this.map);
			// 		} else {
			// 			marker.setMap(null);
			// 		}
			// 	}, this
			// );
			// test
		}.bind(this));

		return polygon;
	},
	render: function() {
		return React.createElement("div", {
			id: this.props.id,
			style: {
				margin: "0px",
				padding: "0px",
				height: this.props.height
			}
		});
	}
});
