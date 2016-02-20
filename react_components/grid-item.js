/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	getPriceString: function() {
		var price = this.props.apart.price;
		if (price) {
			return price + " $ CAD";
		}

		return "- $ CAD";
	},
	getBedroomString: function() {
		var bedroom = this.props.apart.bedroom;
		if (bedroom) {
			return bedroom + " bedroom";
		}

		return "- bedroom";
	},
	render: function() {
		return React.createElement("div", {
				className: "grid-item",
			},
			React.createElement(Link, {
					to: "/a/" + this.props.apart._id,
				},
				React.createElement("img", {
					src: this.props.apart.image,
				})
			),
			React.createElement("div", {
					className: "grid-item-detail",
				}, React.createElement("div", {
					className: "grid-item-detail-price",
				}, this.getPriceString()),
				React.createElement("div", {
					className: "grid-item-detail-bedroom",
				}, this.getBedroomString()),
				React.createElement("div", {
					className: "grid-item-detail-borough",
				}, this.props.apart.borough)
			)
		);
	}
});
