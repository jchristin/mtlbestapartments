"use strict";

var _ = require("lodash"),
	React = require("react"),
	ListItem = require("./list-item");

module.exports = React.createClass({
	generateHeader: function() {
		return React.createElement("div", {
			className: "list-group-item"
		}, React.createElement("div", {
			className: "list-img"
		}), React.createElement("strong", {
			className: "list-item-price"
		}, "Price"), React.createElement("strong", {
			className: "list-item-bedroom"
		}, "Bedroom(s)"), React.createElement("strong", {
			className: "list-item-borough"
		}, "Borough"));
	},
	render: function() {
		return React.createElement("div", {
			className: "layout"
		}, React.createElement("div", {
			className: "list-group"
		}, this.generateHeader(), _.map(this.props.apartments, function(apart, key) {
			return React.createElement(ListItem, {
				key: key,
				apart: apart
			});
		})));
	}
});
