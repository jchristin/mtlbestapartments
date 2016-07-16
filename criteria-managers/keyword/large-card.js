"use strict";

var _ = require("lodash"),
	React = require("react"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		track: React.PropTypes.func
	},
	handleChange: function(e) {
		this.props.criterion.keywords = _.words(e.target.value);
		this.context.track("setKeywords", this.props.criterion.keywords);
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div(null, React.DOM.input({
			className: "form-control",
			placeholder: formatMessage({ id: "keyword-placeholder" }),
			defaultValue: this.props.criterion.keywords,
			onChange: this.handleChange
		}));
	}
}));
