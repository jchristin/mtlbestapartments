"use strict";

var React = require("react"),
	actions = require("./actions");

module.exports = React.createClass({
	handleClick: function() {
		actions.togglePanel();
	},
	render: function() {
		return React.createElement("li", {
				onClick: this.handleClick,
				className: "menu-item"
			},
			React.createElement("a", null,
				React.createElement("div", null, React.createElement("i", {
					className: "fa " + this.props.icon
				})),
				React.createElement("div", null, this.props.caption)
			)
		);
	}
});
