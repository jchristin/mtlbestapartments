"use strict";

var React = require("react");

var createMenuTile = function(caption, icon, subtiles) {
	return {
		size: 1,
		content: [React.createElement("div", null, React.createElement("i", {
				className: "fa " + icon
			})),
			React.createElement("div", null, caption)
		],
		subtiles: subtiles
	};
};

var priceSliderTile = {
	size: 3,
	content: React.createElement(require("./price"))
};

var roomSliderTile = {
	size: 3,
	content: React.createElement(require("./bedroom"))
};

var priceMenuTile = createMenuTile("Price", "fa-usd", [priceSliderTile]);
var roomMenuTile = createMenuTile("Bedroom", "fa-home", [roomSliderTile]);
var zoneMenuTile = createMenuTile("Zone", "fa-map-marker");

module.exports = [priceMenuTile, roomMenuTile, zoneMenuTile];
