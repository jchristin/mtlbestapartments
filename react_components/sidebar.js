"use strict";

var React = require("react"),
	Item = require("./sidebar-item"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
				className: "sidebar"
			},
			React.DOM.div({
					className: "sidebar-list-title"
				},
				React.DOM.h4(null, "Lists")
			),
			React.createElement(Item, {
				icon: "fa-circle",
				path: "/favorite",
				caption: formatMessage({
						id: "sidebar-favorite"
					})
			}),
			React.createElement(Item, {
				icon: "fa-circle",
				path: "/search",
				caption: formatMessage({
						id: "sidebar-search"
					})
			}),
			React.createElement(Item, {
				icon: "fa-circle",
				path: "/posted",
				caption: formatMessage({
						id: "sidebar-posted-apt"
					})
			})
		);
	}
}));
