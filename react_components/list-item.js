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
		this.context.router.push("/" + this.props.lang + "/a/" + this.props.apart._id);
	},
	render: function() {
		return React.DOM.div({
			className: "list-group-item",
			key: this.props.apart._id,
			onClick: this.handleClick
		}, React.DOM.div({
			className: "list-img"
		}, React.DOM.img({
			className: "list-img-content",
			src: this.props.apart.images[0]
		})), React.DOM.div({
			className: "list-item-price"
		}, React.createElement(priceFormater, {price: this.props.apart.price})), React.DOM.div({
			className: "list-item-bedroom"
		}, this.getBedroomString()), React.DOM.div({
			className: "list-item-borough"
		}, this.props.apart.borough));
	}
});
