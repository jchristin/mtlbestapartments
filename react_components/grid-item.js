"use strict";

var React = require("react"),
	moment = require("moment"),
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
				return "1 bedroom";

			case 2:
				return "2 bedrooms";

			case 3:
				return "3 bedrooms";

			case 4:
				return "4+ bedrooms";

			default:
				return "";
		}
	},
	handleClick: function() {
		this.context.router.push("/a/" + this.props.apart._id);
	},
	render: function() {
		return React.DOM.div({
			onClick: this.handleClick,
			className: "grid-item card"
		}, React.DOM.img({
			className: "card-img-top",
			src: this.props.apart.images[0]
		}), React.DOM.div({
			className: "card-block"
		}, React.createElement(priceFormater, {price: this.props.apart.price}), React.DOM.div(null, this.getBedroomString()), React.DOM.div(null, this.props.apart.borough), React.DOM.div({
			className: "date"
		}, React.DOM.small({
			className: "text-muted"
		}, "Posted " + moment(this.props.apart.date).fromNow()))));
	}
});
