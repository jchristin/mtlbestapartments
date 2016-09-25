/* global module:true */

"use strict";

var React = require("react"),
	PostMap = require("./post-map"),
	PostBed = require("./post-bed"),
	PostPrice = require("./post-price"),
	PostPics = require("./post-pics"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	componentDidMount: function() {
		this.address = "";
		this.bed = 0;
		this.price = 0;
		this.pictures = [];
	},
	getInitialState: function() {
		return {
			showMap: true,
			showBed: false,
			showPrice: false,
			showPics: false
		};
	},
	callbackMap: function(address) {
		this.address = address;
		this.setState({
			showBed: true
		});
	},
	callbackBed: function(bed) {
		this.bed = bed;
		this.setState({
			showPrice: true
		});
	},
	callbackPrice: function(price) {
		this.price = price;
		this.setState({
			showPics: true
		});
	},
	callbackPics: function(pictures) {
		this.pictures = pictures;
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
			className: "post-apt"
		}, React.DOM.strong(null, formatMessage({
			id: "postapt-title"
		})),
		React.DOM.div(null,
			React.DOM.div({
				className: this.state.showMap ? "post-show" : "post-hide"
			},
			React.DOM.div({
				className: "card"
			}, React.DOM.div({
				className: "card-block"
			}, React.createElement(PostMap, {
				id: "map",
				callback: this.callbackMap
			})))),
			React.DOM.div({
				className: this.state.showBed ? "post-show" : "post-hide"
			},
			React.DOM.div({
				className: "card"
			}, React.DOM.div({
				className: "card-block"
			}, React.createElement(PostBed, {
				id: "bed",
				callback: this.callbackBed
			})))),
			React.DOM.div({
				className: this.state.showPrice ? "post-show" : "post-hide"
			},
			React.DOM.div({
				className: "card"
			}, React.DOM.div({
				className: "card-block"
			}, React.createElement(PostPrice, {
				id: "price",
				callback: this.callbackPrice
			})))),
			React.DOM.div({
				className: this.state.showPics ? "post-show" : "post-hide"
			},
			React.DOM.div({
				className: "card"
			}, React.DOM.div({
				className: "card-block"
			}, React.createElement(PostPics, {
				id: "pics",
				callback: this.callbackPics
			})))),
			React.DOM.div({
				className: "post-apt-empty-end"
			}, "")
		));
	}
}));
