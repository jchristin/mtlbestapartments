"use strict";

var _ = require("lodash"),
	React = require("react"),
	ListItem = require("./list-item"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	componentDidUpdate: function() {
		if (this.props.apartments.length !== 0 && this.state.apartments.length === 0 && this.state.apartments !== this.props.apartments) {
			this.setState({
				apartments: this.props.apartments
			});
		}
	},
	getInitialState: function() {
		return {
			apartments: this.props.apartments
		};
	},
	sortCallback: function(type, up) {
		this.state.apartments = _.sortBy(this.props.apartments, function(apart) {
			var data = 0;

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
			}

			return -data;
		});

		this.setState({
			apartments: this.state.apartments
		});
	},
	generateSortIcon: function(type) {
		return React.DOM.div({
				className: "list-item-sorticons"
			},
			React.DOM.div({
					className: "list-item-sorticons-up"
				},
				React.DOM.div({
					className: "fa fa-caret-up",
					onClick: this.sortCallback.bind(this, type, false)
				})
			),
			React.DOM.div({
					className: "list-item-sorticons-down"
				},
				React.DOM.div({
					className: "fa fa-caret-down",
					onClick: this.sortCallback.bind(this, type, true)
				})
			)
		);
	},
	generateHeader: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
				className: "list-group-item"
			},
			React.DOM.div({
				className: "list-img"
			}),
			React.DOM.div({
					className: "list-item-price"
				},
				this.generateSortIcon("price"),
				React.DOM.div({
						className: "list-item-caption"
					},
					React.DOM.strong(null, formatMessage({
						id: "layout-list-price"
					}))
				)
			),
			React.DOM.div({
					className: "list-item-bedroom"
				},
				this.generateSortIcon("bedroom"),
				React.DOM.div({
						className: "list-item-caption"
					},
					React.DOM.strong(null, formatMessage({
						id: "layout-list-bedroom"
					}))
				)
			),
			React.DOM.div({
					className: "list-item-borough"
				},
				this.generateSortIcon("borough"),
				React.DOM.div({
						className: "list-item-caption"
					},
					React.DOM.strong(null, formatMessage({
						id: "layout-list-borough"
					}))
				)
			)
		);
	},
	render: function() {
		return React.DOM.div({
			className: "list-group"
		}, this.generateHeader(), _.map(this.state.apartments, function(apart, key) {
			return React.createElement(ListItem, {
				key: key,
				apart: apart
			});
		}));
	}
}));
