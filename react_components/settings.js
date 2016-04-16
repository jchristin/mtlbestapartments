/* global module:true, window: true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	handleClick: function() {
		request.del("/api/user").end(function(err) {
			if (err) {
				console.log(err);
			} else {
				window.location = "/";
			}
		});
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div(null,
			formatMessage({
					id: "settings-title"
				}),
			React.DOM.button({
				onClick: this.handleClick
			}, formatMessage({
					id: "settings-delete-account"
				}))
		);
	}
}));
