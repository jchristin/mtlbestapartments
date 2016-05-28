/* global module:true, window:true, ga:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	request = require("superagent"),
	queryString = require('query-string'),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
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
					ga("send", "pageview", "/signup-success");

					var parsed = queryString.parse(this.props.location.search);
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
						id: "signup-create-an-account"
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
										id: "signup-name"
									})),
								React.DOM.input({
									className: "form-control",
									type: "text",
									ref: "name",
									name: formatMessage({
											id: "signup-name-name"
										}),
									required: true
								})
							),
							React.DOM.div({
									className: "form-group"
								},
								React.DOM.label(null, formatMessage({
										id: "signup-email"
									})),
								React.DOM.input({
									className: "form-control",
									type: "text",
									ref: "email",
									name: formatMessage({
											id: "signup-name-email"
										}),
									required: true,
								})
							),
							React.DOM.div({
									className: "form-group"
								},
								React.DOM.label(null, formatMessage({
										id: "signup-password"
									})),
								React.DOM.input({
									className: "form-control",
									type: "password",
									ref: "password",
									name: formatMessage({
											id: "signup-name-password"
										}),
									required: true
								})
							),
							React.DOM.button({
								className: "btn btn-lg btn-primary btn-block",
								type: "submit"
							}, formatMessage({
									id: "signup-signup"
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
						React.createElement(Link, {
							to: "/" + this.context.lang + "/signin" + this.props.location.search
						}, formatMessage({
								id: "signup-already-have-account"
							}))
					)
				)
			)
		);
	}
}));
