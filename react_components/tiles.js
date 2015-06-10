"use strict";

var React = require("react");

var createTile = function(caption) {
	return {
		size: 1,
		content: React.createElement("div", null, caption),
	};
};

var tilePrice = {
	size: 1,
	content: [React.createElement("div", null, React.createElement("i", {
			className: "fa fa-usd"
		})),
		React.createElement("div", null, "Price")
	],
	subtiles: []
};

module.exports = [tilePrice, createTile("B"), createTile("C")];
