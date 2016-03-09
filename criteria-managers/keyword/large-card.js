"use strict";

var _ = require("lodash"),
	React = require("react");

module.exports = React.createClass({
	handleChange: function(e) {
		this.props.criterion.keywords = _.words(e.target.value);
	},
	render: function() {
		return React.createElement("div", null, React.createElement("input", {
			className: "form-control",
			placeholder: "ex: garden, brick",
			defaultValue: this.props.criterion.keywords,
			onChange: this.handleChange
		}));
	}
});
