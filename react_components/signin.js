/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function render() {
		return React.createElement(
			"form", {
				action: "/api/signin",
				method: "post"
			},
			React.createElement(
				"div",
				null,
				React.createElement(
					"label",
					null,
					"Email:"
				),
				React.createElement("input", {
					type: "text",
					name: "username"
				})
			),
			React.createElement(
				"div",
				null,
				React.createElement(
					"label",
					null,
					"Password:"
				),
				React.createElement("input", {
					type: "password",
					name: "password"
				})
			),
			React.createElement(
				"div",
				null,
				React.createElement("input", {
					type: "submit",
					defaultValue: "Sign In"
				})
			),
			React.createElement(Link, {
				to: "/signup"
			}, "Sign Up")
		);
	}
});
