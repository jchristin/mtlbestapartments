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
		return React.createElement("div", {
			className: "infoBox"
		},
			React.createElement("div", {
					className: "img-container"
				},
				React.createElement("a", {
						href: this.props.apart.url,
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
