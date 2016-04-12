"use strict";

var React = require("react");

module.exports = React.createClass({
	handleChange: function(number, checked) {
		this.props.criterion.bedrooms[number] = checked;
		this.forceUpdate();
	},
	createButton: function(number, label) {
		var checked = this.props.criterion.bedrooms[number];

		return React.DOM.label({
				className: "btn btn-secondary" + (checked ? " active" : "")
			},
			React.DOM.input({
				type: "checkbox",
				autoComplete: "off",
				onChange: this.handleChange.bind(this, number, !checked)
			}), label
		);
	},
	render: function() {
		return React.DOM.div({
				className: "btn-group",
				"data-toggle":
				"buttons"
			},
			this.createButton(0, "Studio"),
			this.createButton(1, "1"),
			this.createButton(2, "2"),
			this.createButton(3, "3"),
			this.createButton(4, "4+")
		);
	}
});
