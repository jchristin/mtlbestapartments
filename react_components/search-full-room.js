/* global module:true */

"use strict";

var React = require("react"),
	starsLayout = require("./edit-stars");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			roomMin: 1,
			roomMax: 5,
			stars: 5,
		};
	},
	changeMinRoom: function(event) {
		this.setState({
			roomMin: event.target.value
		});
	},
	changeMaxRoom: function(event) {
		this.setState({
			roomMax: event.target.value
		});
	},
	render: function() {
		return React.createElement("div", {
				className: "search-new-container-room"
			},
			React.createElement("i", {
				className: "fa fa-bed"
			}),
			React.createElement("div", {
				className: "edit-search-bed-caption"
			}, "Number of room between " + this.state.roomMin + " room and " + this.state.roomMax + " rooms"),
			React.createElement("hr", {
				className: "edit-search-room-caption-sep"
			}),
			React.createElement(
				starsLayout, {
					stars: this.state.stars,
					editable: true
				}
			),
			React.createElement("input", {
				type: "range",
				name: "points",
				min: "1",
				max: "4",
				step: "1",
				value: this.state.roomMin,
				onChange: this.changeMinRoom
			}),
			React.createElement("input", {
				type: "range",
				name: "points",
				min: "1",
				max: "5",
				step: "1",
				value: this.state.roomMax,
				onChange: this.changeMaxRoom
			})
		);
	}
});
