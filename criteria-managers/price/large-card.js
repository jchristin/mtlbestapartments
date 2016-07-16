"use strict";

var React = require("react"),
	injectIntl = require("react-intl").injectIntl,
	priceFormater = require("../../react_components/price-formater");

module.exports = injectIntl(React.createClass({
	contextTypes: {
		track: React.PropTypes.func
	},
	componentDidMount: function() {
		var Slider = require("bootstrap-slider");
		this.slider = new Slider("#slider-price", {
			min: 0,
			max: 4000,
			step: 50,
			value: [this.props.criterion.min, this.props.criterion.max],
			tooltip: "hide"
		});

		this.slider.on("slide", function(event) {
			this.updateUi(event);
		}.bind(this));

		this.slider.on("slideStop", function(event) {
			this.updateUi(event);
		}.bind(this));
	},
	updateUi: function(event) {
		this.props.criterion.min = event[0];
		this.props.criterion.max = event[1];
		this.context.track("setPrice", {min: this.props.criterion.min, max: this.props.criterion.max});
		this.forceUpdate();
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div(null,
			React.DOM.div(null,
				React.DOM.span(null, formatMessage({ id: "price-between" })),
				React.createElement(priceFormater, {price: this.props.criterion.min}),
				React.DOM.span(null, formatMessage({ id: "price-and" })),
				React.createElement(priceFormater, {price: this.props.criterion.max})
			),
			React.DOM.input({
				type: "text",
				id: "slider-price"
			})
		);
	}
}));
