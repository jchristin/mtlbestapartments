/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function() {
		return React.DOM.div({
				className: "row"
			},
			React.DOM.div({
					className: "col-xs-center"
				},
				React.DOM.h2({
					className: "text-xs-center"
				}, "Sign in to Fleub"),
				React.DOM.div({
						className: "card"
					},
					React.DOM.div({
							className: "card-block"
						},
						React.DOM.form({
								action: "/api/signin" + this.props.location.search,
								method: "post"
							},
							React.DOM.div({
									className: "form-group"
								},
								React.DOM.label(null, "Email"),
								React.DOM.input({
									className: "form-control",
									type: "text",
									name: "username",
									required: true
								})
							),
							React.DOM.div({
									className: "form-group"
								},
								React.DOM.label(null, "Password"),
								React.DOM.input({
									className: "form-control",
									type: "password",
									name: "password",
									required: true
								})
							),
							React.DOM.button({
								className: "btn btn-lg btn-primary btn-block",
								type: "submit"
							}, "Sign in")
						)
					)
				),
				React.DOM.div({
						className: "card"
					},
					React.DOM.div({
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
