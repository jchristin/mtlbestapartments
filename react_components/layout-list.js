"use strict";

var _ = require("lodash"),
	React = require("react"),
	ListItem = require("./list-item");

module.exports = React.createClass({
	getInitialState: function() {
		return {apartments: this.props.apartments};
	},
	sortCallback: function(type, up) {
		console.log("sortCallback");
		this.state.apartments = _.sortBy(this.props.apartments, function(apart) {
			var data;
			switch (type) {
				case "price":
					data = apart.price;
					break;
				case "bedroom":
					data = apart.bedroom;
					break;
				case "borough":
					data = apart.borough;
					break;
				default:
					console.log("Unknown type :" + type);
					break;
			}

			if (up) {
				return data;
			} else {
				return -data;
			}
		});

		this.setState({apartments: this.state.apartments});
	},
	generateSortIcon: function(captionname, type) {
		return React.createElement("div", {
			className: "sorticons"
		}, React.createElement("i", {
			className: "fa fa-sort-asc",
			onClick: this.sortCallback.bind(this, type, true)
		}), React.createElement("i", {
			className: "fa fa-sort-desc",
			onClick: this.sortCallback.bind(this, type, false)
		}), React.createElement("strong", null, captionname));
	},
	generateHeader: function() {
		return React.createElement("div", {
			className: "list-group-item"
		}, React.createElement("div", {className: "list-img"}), React.createElement("div", {
			className: "list-item-price"
		}, this.generateSortIcon("Price", "price")), React.createElement("div", {
			className: "list-item-bedroom"
		}, this.generateSortIcon("Bedroom(s)", "bedroom")), React.createElement("div", {
			className: "list-item-borough"
		}, this.generateSortIcon("Borough", "borough")));
	},
	render: function() {
		return React.createElement("div", {
			className: "layout"
		}, React.createElement("div", {
			className: "list-group"
		}, this.generateHeader(), _.map(this.state.apartments, function(apart, key) {
			return React.createElement(ListItem, {
				key: key,
				apart: apart
			});
		})));
	}
});
