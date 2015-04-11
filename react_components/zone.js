"use strict";

var React = require("react"),
	_ = require("lodash"),
	actions = require("../react_stores/actions"),
	zoneStore = require("../react_stores/zone-store"),
	boroughs = {
		"ahuntsic-cartierville": "Ahuntsic-Cartierville",
		"anjou": "Anjou",
		"cote-des-neiges-notre-dame-de-grace": "Cote-des-Neiges-Notre-Dame-de-Grace",
		"cote-saint-luc": "Cote-Saint-Luc",
		"dollard-des-ormeaux": "Dollard-des-Ormeaux",
		"dorval": "Dorval",
		"hampstead": "Hampstead",
		"lachine": "Lachine",
		"lasalle": "Lasalle",
		"le-plateau-mont-royal": "Le Plateau-Mont-Royal",
		"le-sud-ouest": "Le-Sud-Ouest",
		"mercier-hochelaga-maisonneuve": "Mercier-Hochelaga-Maisonneuve",
		"montreal-est": "Montreal-Est",
		"montreal-nord": "Montreal-Nord",
		"montreal-ouest": "Montreal-Ouest",
		"mont-royal": "Mont-Royal",
		"outremont": "Outremont",
		"pointe-claire": "Pointe-Claire",
		"riviere-des-prairies-pointe-aux-trembles": "Riviere-des-Prairies-Pointe-aux-Trembles",
		"rosemont-la-petite-patrie": "Rosemont-La Petite-Patrie",
		"saint-laurent": "Saint-Laurent",
		"saint-leonard": "Saint-Leonard",
		"senneville": "Senneville",
		"verdun": "Verdun",
		"ville-marie": "Ville-Marie",
		"villeray-saint-michel-parc-extension": "Villeray-Saint-Michel-Parc-Extension",
		"westmount": "Westmount",
	};

module.exports = React.createClass({
	createCheckbox: function(value, key) {
		var checked = _.find(zoneStore.zones, function(zone) {
			return zone.properties.name === key;
		});

		return React.createElement("div", null,
			React.createElement("input", {
				"data-borough": key,
				type: "checkbox",
				defaultChecked: checked,
				onChange: this.handleChange
			}, " " + value)
		);
	},
	handleChange: function(e) {
		var borough = e.target.getAttribute('data-borough');
		if(e.target.checked) {
			actions.addBorough(borough);
		} else {
			actions.removeBorough(borough);
		}
	},
	render: function() {
		return React.createElement("div", {
			className: "zone"
		}, _.map(boroughs, this.createCheckbox));
	}
});
