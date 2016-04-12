/* global  module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	jQuery = require("jquery"),
	request = require("superagent"),
	miniMap = require("./map-mini"),
	priceFormater = require("./price-formater");

module.exports = React.createClass({
	getInitialState: function() {
		return {layout: ""};
	},
	getBedroomString: function(bedroom) {
		if (bedroom) {
			return bedroom + " bedroom";
		}
	},
	generateSlide: function(image, index) {
		return React.DOM.li({
			key: index
		}, React.DOM.img({src: image}));
	},
	getDescription: function(description) {
		return {__html: description};
	},
	generateLayout: function(apart) {
		var layout = React.DOM.div({
			className: "col-md-6 offset-md-3"
		}, React.DOM.div({
			className: "flexslider carousel"
		}, React.DOM.ul({
			className: "slides"
		}, _.map(apart.images, this.generateSlide))), React.DOM.h6(null, React.createElement(priceFormater, {price: apart.price})), React.DOM.h6(null, this.getBedroomString(apart.bedroom)), React.DOM.p({
			dangerouslySetInnerHTML: this.getDescription(apart.description)
		}), React.DOM.a({
			className: "apt-detail-link",
			href: apart.url,
			target: "_blank"
		}, "Kijiji link"), React.createElement(miniMap, {coord: apart.coord}));

		this.setState({layout: layout});
	},
	componentDidMount: function() {
		global.jQuery = jQuery;
		require("flexslider");

		request.get("/api/apart/" + this.props.params._id).end(function(err, res) {
			if (err) {
				console.log(err);
			} else {
				this.generateLayout(res.body);
			}
		}.bind(this));
	},
	componentDidUpdate: function() {
		jQuery(".flexslider").flexslider({animation: "slide", slideshow: false, smoothHeight: true});
	},
	render: function() {
		return React.DOM.div({
			className: "row apt-detail"
		}, this.state.layout);
	}
});
