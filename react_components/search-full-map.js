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

		this.map = new google.maps.Map(
			document.getElementById(this.props.id),
			require("./map-options"));

		this.bounds = new google.maps.LatLngBounds();

		var styledMap = new google.maps.StyledMapType(require("./map-style"));
		this.map.mapTypes.set("map-style", styledMap);
		this.map.setMapTypeId("map-style");

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

		polygon.zoneSelected = false;

		polygon.setOptions(require("./polygon-option-out"));

		google.maps.event.addListener(polygon, "mouseover", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(require("./polygon-option-over"));
			}
		}.bind(this));

		google.maps.event.addListener(polygon, "mouseout", function() {
			if (!polygon.zoneSelected) {
				polygon.setOptions(require("./polygon-option-out"));
			}
		}.bind(this));

		google.maps.event.addListener(polygon, "click", function() {
			if (polygon.zoneSelected) {
				polygon.setOptions(require("./polygon-option-over"));
				polygon.zoneSelected = false;
			} else {
				polygon.setOptions(require("./polygon-option-selected"));
				polygon.zoneSelected = true;
			}
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
