/* global module:true, window:true */

"use strict";

var React = require("react"),
	request = require("superagent");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			notification: ""
		};
	},
	handleSubmit: function(e) {
		e.preventDefault();
		request
			.post("/api/signup")
			.send({
				name: this.refs.name.value.trim(),
				email: this.refs.email.value.trim(),
				password: this.refs.password.value.trim()
			})
			.end(function(err, res) {
				if (err) {
					this.setState({
						notification: res.text
					});
				} else {
					window.location = "/signin";
				}
			}.bind(this));

		return false;
	},
	render: function render() {
		return React.createElement("div", null,
			React.createElement("div", null, this.state.notification),
			React.createElement("form", {
					name: "form",
					noValidate: "",
					onSubmit: this.handleSubmit
				},
				React.createElement("div", null,
					React.createElement("label", null, "Name:"),
					React.createElement("input", {
						type: "text",
						name: "name",
						ref: "name"
					})
				),
				React.createElement("div", null,
					React.createElement("label", null, "Email:"),
					React.createElement("input", {
						type: "text",
						name: "email",
						ref: "email"
					})
				),
				React.createElement("div", null,
					React.createElement("label", null, "Password:"),
					React.createElement("input", {
						type: "password",
						name: "password",
						ref: "password"
					})
				),
				React.createElement("div", null,
					React.createElement("input", {
						type: "submit",
						defaultValue: "Sign Up"
					})
				)
			));
	}
});
