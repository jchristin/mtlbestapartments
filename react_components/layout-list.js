"use strict";

var _ = require("lodash"),
	React = require("react"),
	ListItem = require("./list-item");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
			className: "layout"
		}, React.createElement("div", {
			className: "list-group"
		}, _.map(this.props.apartments, function(apart, key) {
			return React.createElement(ListItem, {
				key: key,
				apart: apart
			});
		})));
	}
});
