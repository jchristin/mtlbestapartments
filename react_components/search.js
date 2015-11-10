/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			"SERACH",
			React.createElement(Link, {
				to: "/search/edit"
			}, "Edit")
		);
	}
});
