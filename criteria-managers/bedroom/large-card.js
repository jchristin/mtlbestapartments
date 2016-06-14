"use strict";

var React = require("react");

module.exports = React.createClass({
	contextTypes: {
		track: React.PropTypes.func
	},
	handleClick: function(number, checked) {
		this.props.criterion.bedrooms[number] = checked;
		this.context.track("setBedroom", {number: number, checked: checked});
		this.forceUpdate();
	},
	createButton: function(number, label) {
		var checked = this.props.criterion.bedrooms[number];
		return React.DOM.button({
			type: "button",
			className: "btn btn-secondary" + (checked ? " active" : ""),
			onClick: this.handleClick.bind(this, number, !checked)
		}, label);
	},
	render: function() {
		return React.DOM.div({
				className: "btn-group",
				role: "group"
			},
			this.createButton(0, "Studio"),
			this.createButton(1, "1"),
			this.createButton(2, "2"),
			this.createButton(3, "3"),
			this.createButton(4, "4+")
		);
	}
});
