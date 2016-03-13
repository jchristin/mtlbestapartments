"use strict";

var React = require("react");

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getPriceString: function() {
		var price = this.props.apart.price;
		if (price) {
			return "$" + price;
		} else {
			return "$ -";
		}
	},
	getBedroomString: function() {
		var bedroom = this.props.apart.bedroom;
		if (bedroom) {
			return bedroom + " bedroom";
		} else {
			return "- bedroom";
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
		}, this.getPriceString()), React.createElement("div", {
			className: "list-item-bedroom"
		}, this.getBedroomString()), React.createElement("div", {
			className: "list-item-borought"
		}, this.props.apart.borough));
	}
});
