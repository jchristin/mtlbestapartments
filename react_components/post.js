/* global module:true */

"use strict";

var React = require("react"),
	PostMap = require("./post-map"),
	PostBed = require("./post-bed"),
	PostPrice = require("./post-price"),
	PostPics = require("./post-pics"),
	injectIntl = require("react-intl").injectIntl;

var stateId = ["map", "bed", "price", "pics"];

module.exports = injectIntl(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			uiIndex: 0
		};
	},
	callback: function() {
		if (this.state.uiIndex + 1 < stateId.length) {
			this.setState({
				uiIndex: this.state.uiIndex + 1
			});
		} else {
			console.log("last state reached");
		}
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;
		var content = [];

		for (var i = 0; i <= this.state.uiIndex; i += 1) {
			switch (i) {
				case 0:
					content.push(React.DOM.div({
						className: "card",
						key: i + 1
					}, React.DOM.div({
						className: "card-block"
					}, React.createElement(PostMap, {
						location: this.props.location,
						callback: this.callback,
						id: stateId[i]
					}))));
					break;
				case 1:
					content.push(React.DOM.div({
						className: "card",
						key: i + 1
					}, React.DOM.div({
						className: "card-block"
					}, React.createElement(PostBed, {
						location: this.props.location,
						callback: this.callback,
						id: stateId[i]
					}))));
					break;
				case 2:
					content.push(React.DOM.div({
						className: "card",
						key: i + 1
					}, React.DOM.div({
						className: "card-block"
					}, React.createElement(PostPrice, {
						location: this.props.location,
						callback: this.callback,
						id: stateId[i]
					}))));
					break;
				case 3:
					content.push(React.DOM.div({
						className: "card",
						key: i + 1
					}, React.DOM.div({
						className: "card-block"
					}, React.createElement(PostPics, {
						location: this.props.location,
						callback: this.callback,
						id: stateId[i]
					}))));
					break;
				default:
					break;
			}
		}

		return React.DOM.div({
			className: "post-apt"
		}, React.DOM.strong(null, formatMessage({
			id: "postapt-title"
		})), React.DOM.div(null, content), React.DOM.div({
			className: "post-apt-empty-end"
		}, ""));
	}
}));
