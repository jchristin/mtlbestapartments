/* global module:true */

"use strict";

var React = require("react");

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
					"Username:"
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
			)
		);
	}
});
