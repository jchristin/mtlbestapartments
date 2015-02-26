/* global module:true */

"use strict";

var React = require("react"),
	Sidebar = require("./sidebar"),
	Panel = require("./panel");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(Sidebar),
			React.createElement(Panel)
		);
	}
});
