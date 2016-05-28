/* global module:true */

"use strict";

var React = require("react"),
	PostMap = require("./post-map"),
	PostBed = require("./post-bed"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},
	getInitialState: function () {
		return {uiIndex: 0};
	},
	callback: function () {
		this.setState({
			uiIndex: this.state.uiIndex + 1
		});
	},
	render: function () {
		var formatMessage = this.props.intl.formatMessage;
		var content = [];

		for (var i = 0; i <= this.state.uiIndex; i++) {
			switch (i) {
				case 0:
					content.push(React.createElement(PostMap, {
						location: this.props.location,
						callback: this.callback,
						key: i + 1,
						id: "#map"
					}));
					break;
				case 1:
					content.push(React.createElement(PostBed, {
						location: this.props.location,
						callback: this.callback,
						key: i + 1,
						id: "#bed"
					}));
					break;
				default:
					break;
			}
		}
		return React.DOM.div({className: "post-apt"},
			React.DOM.strong(null, formatMessage({id: "postapt-title"})),
			React.DOM.div(null, content),
			React.DOM.div({className: "post-apt-empty-end"}, "")
		);
	}
}));
