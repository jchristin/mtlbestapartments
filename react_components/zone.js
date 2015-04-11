"use strict";

var React = require("react"),
	_ = require("lodash"),
	actions = require("../react_stores/actions"),
	zoneStore = require("../react_stores/zone-store"),
	boroughs = {
		"anjou": "Anjou",
		"le-plateau-mont-royal": "Le Plateau-Mont-Royal",
		"mercier-hochelaga-maisonneuve": "Mercier-Hochelaga-Maisonneuve",
		"montreal-est": "Montreal-Est",
		"montreal-nord": "Montreal-Nord",
		"riviere-des-prairies-pointe-aux-trembles": "Riviere-des-Prairies-Pointe-aux-Trembles",
		"rosemont-la-petite-patrie": "Rosemont-La Petite-Patrie",
		"saint-leonard": "Saint-Leonard",
		"ville-marie": "Ville-Marie",
		"senneville": "Senneville"
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
