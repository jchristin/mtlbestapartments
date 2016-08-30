"use strict";

var React = require("react"),
	FormattedNumber = require("react-intl").FormattedNumber,
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	render: function() {
		return React.createElement(FormattedNumber, {
			value: this.props.price || 0,
			style: "currency",
			currency: "CAD"
		});
	}
}));
