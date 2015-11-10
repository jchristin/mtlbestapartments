/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			"HOME",
			React.createElement(Link, {
				to: "/signin"
			}, "Sign In"),
			React.createElement(Link, {
				to: "/signup"
			}, "Sign Up")
		);
	}
});
