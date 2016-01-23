/* global module:true */

"use strict";

var React = require("react"),
	searchNewPrice = require("./search-full-price-new"),
	searchNewRoom = require("./search-full-room-new");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			visibilityPrice: "hidden",
			visibilityRoom: "hidden",
		};
	},
	handleClickPrice: function() {
		this.setState({
			visibilityRoom: "visible",
		});
	},
	handleClickRoom: function() {},
	componentDidMount: function() {
		this.setState({
			visibilityPrice: "visible",
		});
	},
	render: function() {
		return React.createElement("div", {
				className: "search-new"
			},
			React.createElement("div", {
					className: "search-full-price-new",
					style: {
						visibility: this.state.visibilityPrice
					}
				}, React.createElement(searchNewPrice),
				React.createElement("button", {
					onClick: this.handleClickPrice
				}, "Validate Price")),
			React.createElement("div", {
					className: "search-full-room-new",
					style: {
						visibility: this.state.visibilityRoom
					}
				}, React.createElement(searchNewRoom),
				React.createElement("button", {
					onClick: this.handleClickRoom
				}, "Validate Room"))
		);
	}
});
