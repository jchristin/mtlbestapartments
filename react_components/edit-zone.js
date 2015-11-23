/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars"),
	miniMapEdit = require("./map-mini-edit");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "edit-search"
			},
			React.createElement("i", {
				className: "fa fa-map-marker"
			}),
			React.createElement("div", {
				className: "edit-search-zone-caption"
			}, "Walking zone"),
			React.createElement("hr", {
				className: "edit-search-zone-caption-sep"
			}),
			React.createElement(
				starsLayout, {
					stars: this.props.children.stars
				}
			),
			React.createElement(
				miniMapEdit, {
					polygon: this.props.children.polygon,
					boroughs: this.props.children.boroughs,
				}
			)
		);
	}
});
