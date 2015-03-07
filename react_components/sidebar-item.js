"use strict";

var React = require("react"),
	actions = require("./actions");

module.exports = React.createClass({
	handleClick: function(e) {
		// Prevent the root component to hide the panel.
		e.stopPropagation();

		var position = this.refs.item.getDOMNode().getBoundingClientRect().top;
		actions.togglePanel(position);
	},
	render: function() {
		return React.createElement("li", {
				ref: "item",
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
