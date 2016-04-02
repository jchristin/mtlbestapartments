"use strict";

var React = require("react"),
	priceFormater = require("../../react_components/price-formater");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("span", null, "Price between "),
			React.createElement(priceFormater, {price: this.props.criterion.min}),
			React.createElement("span", null, " and "),
			React.createElement(priceFormater, {price: this.props.criterion.max})
		);
	}
});
