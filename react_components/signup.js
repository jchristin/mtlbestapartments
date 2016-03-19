/* global module:true, window:true */

"use strict";

var React = require("react"),
	request = require("superagent");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			notification: null
		};
	},
	createNotification: function(message)
	{
		return React.createElement("div", {
				className: "alert alert-danger",
				role: "alert"
			}, message
		);
	},
	handleSubmit: function(e) {
		e.preventDefault();
		request
			.post("/api/signup")
			.send({
				name: this.refs.name.value.trim(),
				username: this.refs.email.value.trim(),
				password: this.refs.password.value.trim()
			})
			.end(function(err, res) {
				if (err) {
					this.setState({
						notification: this.createNotification(res.text)
					});
				} else {
					window.location = "/";
				}
			}.bind(this));

		return false;
	},
	render: function() {
		return React.createElement("div", {
				className: "row"
			},
			React.createElement("div", {
					className: "col-xs-center"
				},
				React.createElement("h2", {
					className: "text-xs-center"
				}, "Create an account"),
				this.state.notification,
				React.createElement("div", {
						className: "card"
					},
					React.createElement("div", {
							className: "card-block"
						},
						React.createElement("form", {
								name: "form",
								noValidate: "",
								onSubmit: this.handleSubmit
							},
							React.createElement("div", {
									className: "form-group"
								},
								React.createElement("label", null, "Name"),
								React.createElement("input", {
									className: "form-control",
									type: "text",
									ref: "name",
									name: "name",
									required: true
								})
							),
							React.createElement("div", {
									className: "form-group"
								},
								React.createElement("label", null, "Email"),
								React.createElement("input", {
									className: "form-control",
									type: "text",
									ref: "email",
									name: "email",
									required: true,
								})
							),
							React.createElement("div", {
									className: "form-group"
								},
								React.createElement("label", null, "Password"),
								React.createElement("input", {
									className: "form-control",
									type: "password",
									ref: "password",
									name: "password",
									required: true
								})
							),
							React.createElement("button", {
								className: "btn btn-lg btn-primary btn-block",
								type: "submit"
							}, "Sign up")
						)
					)
				)
			)
		);
	}
});
