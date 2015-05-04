"use strict";

var React = require("react");

module.exports = React.createClass({
	getPriceString: function() {
		var price = this.props.apart.price;
		if (price) {
			return price + "$";
		}

		return "Contact";
	},
	render: function() {
		return React.createElement("div", {},
			React.createElement("div", {
					className: "img-container"
				},
				React.createElement("a", {
						href: this.props.apart._id,
						target: "_blank"
					},
					React.createElement("img", {
						src: this.props.apart.image,
					})
				),
				React.createElement("div", {
						className: "price"
					},
					React.createElement("strong", null, this.getPriceString())
				)
			)
		);
	}
});
