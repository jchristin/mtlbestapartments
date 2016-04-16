/* global module:true */

"use strict";

var React = require("react"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div(null, formatMessage({
				id: "favorite-title"
			}));
	}
}));
