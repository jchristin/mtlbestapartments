"use strict";

var _ = require("lodash"),
	React = require("react"),
	ListItem = require("./list-item"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	getInitialState: function() {
		return {apartments: this.props.apartments};
	},
	sortCallback: function(type, up) {
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
		return React.DOM.div({
			className: "sorticons"
		}, React.DOM.i({
			className: "fa fa-sort-asc",
			onClick: this.sortCallback.bind(this, type, true)
		}), React.DOM.i({
			className: "fa fa-sort-desc",
			onClick: this.sortCallback.bind(this, type, false)
		}), React.DOM.strong(null, captionname));
	},
	generateHeader: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
			className: "list-group-item"
		}, React.DOM.div({className: "list-img"}), React.DOM.div({
			className: "list-item-price"
		}, this.generateSortIcon(formatMessage({
				id: "layout-list-price"
			}), "price")), React.DOM.div({
			className: "list-item-bedroom"
		}, this.generateSortIcon(formatMessage({
				id: "layout-list-bedroom"
			}), "bedroom")), React.DOM.div({
			className: "list-item-borough"
		}, this.generateSortIcon(formatMessage({
				id: "layout-list-borough"
			}), "borough")));
	},
	render: function() {
		return React.DOM.div({
			className: "layout"
		}, React.DOM.div({
			className: "list-group"
		}, this.generateHeader(), _.map(this.state.apartments, function(apart, key) {
			return React.createElement(ListItem, {
				key: key,
				apart: apart
			});
		})));
	}
}));
