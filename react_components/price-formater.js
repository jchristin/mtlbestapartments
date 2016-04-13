/* global  module:true */

"use strict";

var React = require("react"),
	FormattedNumber = require('react-intl').FormattedNumber,
	IntlProvider = require('react-intl').IntlProvider;

module.exports = React.createClass({
	render: function() {
		return React.createElement(IntlProvider, {
			locale: "en"
		}, React.createElement(FormattedNumber, {
			value: this.props.price || 0,
			style: "currency",
			currency: "CAD"
		}));
	}
});
