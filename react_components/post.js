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
	getInitialState: function() {
		return {
			showMap: true,
			showBed: false,
			showPrice: false,
			showPics: false
		};
	},
	callback: function(state) {
		switch (state) {
			case "map":
				this.setState({
					showBed: true
				});
				break;
			case "bed":
				this.setState({
					showPrice: true
				});
				break;
			case "price":
				this.setState({
					showPics: true
				});
				break;
			default:
				break;
		}
	},
	createCard: function(element, id) {
		return React.DOM.div({
			className: "card"
		}, React.DOM.div({
			className: "card-block"
		}, React.createElement(element, {
			id: id,
			callback: this.callback
		})));
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
			this.createCard(PostMap, "map")),
			React.DOM.div({
				className: this.state.showBed ? "post-show" : "post-hide"
			},
			this.createCard(PostBed, "bed")),
			React.DOM.div({
				className: this.state.showPrice ? "post-show" : "post-hide"
			},
			this.createCard(PostPrice, "price")),
			React.DOM.div({
				className: this.state.showPics ? "post-show" : "post-hide"
			},
			this.createCard(PostPics, "pics")),
			React.DOM.div({
				className: "post-apt-empty-end"
			}, "")
		));
	}
}));
