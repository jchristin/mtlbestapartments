"use strict";

var React = require("react"),
	moment = require("moment"),
	priceFormater = require("./price-formater"),
	boroughs = require("../boroughs"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,
		lang: React.PropTypes.string
	},
	getBedroomString: function() {
		var formatMessage = this.props.intl.formatMessage;

		switch (this.props.apart.bedroom) {
			case 0:
				return formatMessage({
						id: "grid-item-bedroom-0"
					});

			case 1:
				return formatMessage({
						id: "grid-item-bedroom-1"
					});

			case 2:
				return formatMessage({
						id: "grid-item-bedroom-2"
					});

			case 3:
				return formatMessage({
						id: "grid-item-bedroom-3"
					});

			case 4:
				return formatMessage({
						id: "grid-item-bedroom-4+"
					});

			default:
				return "";
		}
	},
	handleClick: function() {
		this.context.router.push("/" + this.context.lang + "/a/" + this.props.apart._id);
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;
		var borough = boroughs[this.props.apart.borough];
		var boroughName = borough ? borough.name : "Montreal";

		return React.DOM.div({
				onClick: this.handleClick,
				className: "grid-item card"
			},
			React.DOM.img({
				className: "card-img-top",
				src: this.props.apart.images[0]
			}),
			React.DOM.div({
					className: "card-block"
				},
				React.createElement(priceFormater, {
						price: this.props.apart.price
					}
				),
				React.DOM.div(null, this.getBedroomString()),
				React.DOM.div(null, boroughName),
				React.DOM.div({
						className: "date"
					},
					React.DOM.small({
							className: "text-muted"
						},
						formatMessage({id: "grid-item-posted"}) + " " + moment(this.props.apart.date).fromNow()
					)
				)
			)
		);
	}
}));
