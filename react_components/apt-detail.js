/* global  module:true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	miniMap = require("./map-mini");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			layout: "",
		};
	},
	getPriceString: function(price) {
		if (price) {
			return price + " $ CAD";
		}

		return "- $ CAD";
	},
	getRoomString: function(room) {
		if (room) {
			return room + " room";
		}

		return "- room";
	},
	generateLayout: function(apart) {
		var layout = React.createElement("div", {
				className: "apt-detail"
			},
			React.createElement("img", {
				src: apart.image
			}),
			React.createElement("div", {
				className: "apt-detail-price",
			}, this.getPriceString(apart.price)),
			React.createElement("div", {
				className: "apt-detail-room",
			}, this.getRoomString(apart.room)),
			React.createElement(miniMap, apart)
		);

		this.setState({
			layout: layout
		});
	},
	componentDidMount: function() {
		request
			.get("/api/flat?" + this.props.params._id)
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.generateLayout(res.body);
				}
			}.bind(this));
	},
	render: function() {
		return React.createElement("div", {
			className: "apt-detail-container"
		}, this.state.layout);
	}
});
