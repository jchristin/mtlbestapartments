/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
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
								React.DOM.label(null, formatMessage({
										id: "signin-email"
									})),
								React.DOM.input({
									className: "form-control",
									type: "text",
									name: formatMessage({
											id: "signin-name-username"
										}),
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
									name: formatMessage({
											id: "signin-name-password"
										}),
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
							to: "/" + this.props.params.lang + "/signup"
						}, formatMessage({
								id: "signin-create-an-account"
							})), "."
					)
				)
			)
		);
	}
}));
