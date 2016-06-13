/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	request = require("superagent"),
	queryString = require("query-string"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		track: React.PropTypes.func,
		lang: React.PropTypes.string
	},
	getInitialState: function() {
		return {
			notification: null
		};
	},
	createNotification: function(message)
	{
		return React.DOM.div({
				className: "alert alert-danger",
				role: "alert"
			}, message
		);
	},
	handleSubmit: function(e) {
		e.preventDefault();
		request
			.post("/api/signin")
			.send({
				username: this.refs.username.value.trim(),
				password: this.refs.password.value.trim()
			})
			.end(function(err, res) {
				if (err) {
					this.context.track("signInFailed", err);
					this.setState({
						notification: this.createNotification(res.text)
					});
				} else {
					var parsed = queryString.parse(this.props.location.search);
					this.context.track("signInSucceeded", parsed.next);
					if(parsed.next) {
						window.location = parsed.next;
					} else {
						window.location = "/" + this.context.lang + "/";
					}
				}
			}.bind(this));

		return false;
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
				className: "row"
			},
			React.DOM.div({
					className: "col-xs-center"
				},
				React.DOM.h2({
					className: "text-xs-center"
				}, formatMessage({
						id: "signin-sign-in-to-fleub"
					})),
				this.state.notification,
				React.DOM.div({
						className: "card"
					},
					React.DOM.div({
							className: "card-block"
						},
						React.DOM.form({
								name: "form",
								noValidate: "",
								onSubmit: this.handleSubmit
							},
							React.DOM.div({
									className: "form-group"
								},
								React.DOM.label(null, formatMessage({
										id: "signin-email"
									})),
								React.DOM.input({
									className: "form-control",
									type: "text",
									ref: "username",
									name: "username",
									required: true
								})
							),
							React.DOM.div({
									className: "form-group"
								},
								React.DOM.label(null, formatMessage({
										id: "signin-password"
									})),
								React.DOM.input({
									className: "form-control",
									type: "password",
									ref: "password",
									name: "password",
									required: true
								})
							),
							React.DOM.button({
								className: "btn btn-lg btn-primary btn-block",
								type: "submit"
							}, formatMessage({
									id: "signin-signin"
								}))
						)
					)
				),
				React.DOM.div({
						className: "card"
					},
					React.DOM.div({
							className: "card-block"
						},
						formatMessage({
								id: "signin-new-to-fleub"
							}),
						React.createElement(Link, {
							to: "/" + this.context.lang + "/signup" + this.props.location.search
						}, formatMessage({
								id: "signin-create-an-account"
							})), "."
					)
				)
			)
		);
	}
}));
