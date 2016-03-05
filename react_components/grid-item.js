"use strict";

var React = require("react"),
	moment = require("moment");

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getPriceString: function() {
		var price = this.props.apart.price;
		if (price) {
			return "$" + price;
		}
	},
	getBedroomString: function() {
		var bedroom = this.props.apart.bedroom;
		if (bedroom) {
			return bedroom + " bedroom";
		}
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
				},
				React.createElement("div", null, this.getPriceString()),
				React.createElement("div", null, this.getBedroomString()),
				React.createElement("div", null, this.props.apart.borough),
				React.createElement("div", {
						className: "date"
					},
					React.createElement("small", {
						className: "text-muted"
					}, "Posted " + moment(this.props.apart.date).fromNow())
				)
			)
		);
	}
});
