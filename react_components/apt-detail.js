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
	getBedroomString: function(bedroom) {
		if (bedroom) {
			return bedroom + " bedroom";
		}

		return "- bedroom";
	},
	generateLayout: function(apart) {
		var layout = React.createElement("div", {
				className: "apt-detail"
			},
			React.createElement("a", {
				href: apart.url,
				target: "_blank"
			}, React.createElement("img", {
					src: apart.image
				})
			),
			React.createElement("div", {
				className: "apt-detail-price",
			}, this.getPriceString(apart.price)),
			React.createElement("div", {
				className: "apt-detail-bedroom",
			}, this.getBedroomString(apart.bedroom)),
			React.createElement(
				miniMap, {
					coord: apart.coord
				}
			)
		);

		this.setState({
			layout: layout
		});
	},
	componentDidMount: function() {
		request
			.get("/api/apart/" + this.props.params._id)
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
