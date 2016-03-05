"use strict";

var React = require("react");

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
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
	handleClick: function()
	{
		this.context.router.push("/a/" + this.props.apart._id);
	},
	render: function() {
		return React.createElement("div", {
				onClick: this.handleClick,
				className: "grid-item card",
			},
			React.createElement("img", {
				className: "card-img-top",
				src: this.props.apart.images[0]
			}),
			React.createElement("div", {
					className: "card-block",
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
