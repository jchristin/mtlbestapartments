/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div(null,
			formatMessage({
					id: "home-title"
				}),
			React.createElement(Link, {
				to: "/signin"
			}, formatMessage({
					id: "home-sign-in"
				})),
			React.createElement(Link, {
				to: "/signup"
			}, formatMessage({
					id: "home-sign-up"
				}))
		);
	}
}));
