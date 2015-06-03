"use strict";

var React = require("react");

var createTile = function(caption) {
	return {
		size: 1,
		content: React.createElement("div", null, caption),
	};
};

var tileB = {
	size: 1,
	content: [React.createElement("div", null, React.createElement("i", {
			className: "fa fa-cog"
		})),
		React.createElement("div", null, "Settings")
	],
	subtiles: [createTile("1"),createTile("2"), createTile("3"), createTile("4"), createTile("5")  ]
};

module.exports = [createTile("A"), tileB, createTile("B"), createTile("C")];
