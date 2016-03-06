/* global  module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	jQuery = require("jquery"),
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
			return "$" + price;
		}
	},
	getBedroomString: function(bedroom) {
		if (bedroom) {
			return bedroom + " bedroom";
		}
	},
	generateSlide: function(image, index) {
		return React.createElement("li", {
				key: index
			},
			React.createElement("img", {
				src: image
			})
		);
	},
	getDescription: function(description) {
		return {__html: description};
	},
	generateLayout: function(apart) {
		var layout = React.createElement("div", {
				className: "col-md-6 offset-md-3"
			},
			React.createElement("div", {
					className: "flexslider carousel"
				},
				React.createElement("ul", {
						className: "slides"
					},
					_.map(apart.images, this.generateSlide)
				)
			),
			React.createElement("h6", null, this.getPriceString(apart.price)),
			React.createElement("h6", null, this.getBedroomString(apart.bedroom)),
			React.createElement("p", {
				dangerouslySetInnerHTML: this.getDescription(apart.description)
			}),
			React.createElement("a", {
				className: "apt-detail-link",
				href: apart.url,
				target: "_blank",
			}, "Kijiji link"),
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
		global.jQuery = jQuery;
		require("flexslider");

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
	componentDidUpdate : function() {
		jQuery(".flexslider").flexslider({
			animation: "slide",
			slideshow: false,
			smoothHeight: true
		  });
	},
	render: function() {
		return React.createElement("div", {
			className: "row apt-detail"
		}, this.state.layout);
	}
});
