"use strict";

var React = require("react"),
	priceFormater = require("./price-formater");

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getBedroomString: function() {
		switch (this.props.apart.bedroom) {
			case 0:
				return "Studio";

			case 1:
				return "1";

			case 2:
				return "2";

			case 3:
				return "3";

			case 4:
				return "4+";

			default:
				return "";
		}
	},
	handleClick: function() {
		this.context.router.push("/a/" + this.props.apart._id);
	},
	render: function() {
		return React.createElement("div", {
			className: "list-group-item",
			key: this.props.apart._id,
			onClick: this.handleClick
		}, React.createElement("div", {
			className: "list-img"
		}, React.createElement("img", {
			className: "list-img-content",
			src: this.props.apart.images[0]
		})), React.createElement("div", {
			className: "list-item-price"
		}, React.createElement(priceFormater, {price: this.props.apart.price})), React.createElement("div", {
			className: "list-item-bedroom"
		}, this.getBedroomString()), React.createElement("div", {
			className: "list-item-borough"
		}, this.props.apart.borough));
	}
});
