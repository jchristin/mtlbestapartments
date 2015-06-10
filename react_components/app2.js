/* global module:true */

"use strict";

var React = require("react"),
	Ribbon = require("./ribbon"),
	Canvas = require("./map"),
	tiles = require("./tiles");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(Ribbon, {tiles:tiles}),
			React.createElement(Canvas)
		);
	}
});
