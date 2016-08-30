"use strict";

var React = require("react"),
	request = require("superagent"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		track: React.PropTypes.func,
		lang: React.PropTypes.string
	},
	handleClick: function() {
		this.context.track("deleteAccount", null);
		request.del("/api/user").end(function(err) {
			if (err) {
				console.log(err);
			} else {
				window.location = "/" + this.context.lang + "/";
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
