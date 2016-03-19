/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "row"
			},
			React.createElement("div", {
					className: "col-xs-center"
				},
				React.createElement("h2", {
					className: "text-xs-center"
				}, "Sign in to Fleub"),
				React.createElement("div", {
						className: "card"
					},
					React.createElement("div", {
							className: "card-block"
						},
						React.createElement("form", {
								action: "/api/signin" + this.props.location.search,
								method: "post"
							},
							React.createElement("div", {
									className: "form-group"
								},
								React.createElement("label", null, "Email"),
								React.createElement("input", {
									className: "form-control",
									type: "text",
									name: "username",
									required: true
								})
							),
							React.createElement("div", {
									className: "form-group"
								},
								React.createElement("label", null, "Password"),
								React.createElement("input", {
									className: "form-control",
									type: "password",
									name: "password",
									required: true
								})
							),
							React.createElement("button", {
								className: "btn btn-lg btn-primary btn-block",
								type: "submit"
							}, "Sign in")
						)
					)
				),
				React.createElement("div", {
						className: "card"
					},
					React.createElement("div", {
							className: "card-block"
						},
						"New to Fleub? ",
						React.createElement(Link, {
							to: "/signup"
						}, "Create an account"), "."
					)
				)
			)
		);
	}
});
