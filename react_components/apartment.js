"use strict";

var _ = require("lodash"),
	React = require("react"),
	jQuery = require("jquery"),
	request = require("superagent"),
	miniMap = require("./map-mini"),
	priceFormater = require("./price-formater"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		track: React.PropTypes.func
	},
	getInitialState: function() {
		return {
			layout: ""
		};
	},
	getBedroomString: function(bedroom) {
		if (bedroom) {
			var formatMessage = this.props.intl.formatMessage;

			return bedroom + " " + formatMessage({
				id: "apartment-bedroom"
			});
		}

		return "";
	},
	generateSlide: function(image, index) {
		return React.DOM.li({
			key: index
		}, React.DOM.img({
			src: image
		}));
	},
	getDescription: function(description) {
		return {
			__html: description
		};
	},
	generateLayout: function(apart) {
		var formatMessage = this.props.intl.formatMessage;

		var layout = React.DOM.div(null,
			React.DOM.div({
					className: "flexslider carousel"
				},
				React.DOM.ul({
						className: "slides"
					},
					_.map(apart.images, this.generateSlide)
				)
			),
			React.DOM.h6(null, React.createElement(priceFormater, {
				price: apart.price
			})),
			React.DOM.h6(null, this.getBedroomString(apart.bedroom)),
			React.DOM.p({
				dangerouslySetInnerHTML: this.getDescription(apart.description)
			}),
			React.DOM.a({
					className: "apartment-link",
					href: apart.url,
					onClick: this.context.track.bind(null, "clickKijijiLink", apart.url),
					target: "_blank"
				},
				formatMessage({
					id: "apartment-kijiji-link"
				})
			),
			React.createElement(miniMap, {
				coord: apart.coord
			})
		);

		this.setState({
			layout: layout
		});
	},
	componentDidMount: function() {
		this.context.track("watchApartDetail", this.props.apartmentId);

		global.jQuery = jQuery;
		require("flexslider");

		request.get("/api/apart/" + this.props.apartmentId).end(function(err, res) {
			if (err) {
				console.log(err);
			} else {
				this.generateLayout(res.body);
			}
		}.bind(this));
	},
	componentDidUpdate: function() {
		jQuery(".flexslider").flexslider({
			animation: "slide",
			slideshow: false,
			smoothHeight: true
		});
	},
	render: function() {
		return React.DOM.div({
			className: "row apartment"
		}, this.state.layout);
	}
}));
