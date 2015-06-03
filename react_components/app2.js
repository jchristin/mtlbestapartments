/* global module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	Ribbon = require("./ribbon");

var tiles2 = require("./tiles");

var tiles = _.map(_.range(10), function(i) {
	return React.createElement("div", null, i);
});

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null, React.createElement(Ribbon, {tiles:tiles2}));
	}
});
