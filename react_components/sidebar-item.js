"use strict";

var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	getNotificationCountString: function() {
		// var notificationCount = request.getNotification(this.props.name);
		var notificationCount = 1;
		if (notificationCount) {
			return notificationCount + "";
		}

		return "";
	},
	render: function() {
		return React.createElement(Link, {
				to: this.props.path,
				className: "sidebar-item"
			},
			React.createElement("span", null, React.createElement("i", {
				className: "fa " + this.props.icon
			})),
			React.createElement("span", null, this.props.caption)
		);
	}
});
