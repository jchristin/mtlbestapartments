/* global module:true */

"use strict";

var React = require("react"),
	LayoutCard = require("./layout-card"),
	LayoutMap = require("./layout-map"),
	LayoutList = require("./layout-list"),
	LayoutButtons = require("../layout"),
	_ = require("lodash"),
	request = require("superagent"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	getInitialState: function() {
		return {
			layoutType: null
		};
	},
	componentWillMount: function() {
		request
			.get("/api/layout")
			.end(function(err, res) {
				if (err && err.status !== 404) {
					console.log(err);
				} else {
					if (res.body !== null) {
						this.setState({
							layoutType: res.body
						});
					} else {
						this.setState({
							layoutType: "card"
						});
					}
				}
			}.bind(this));
	},
	storeLayoutType: function(layoutType) {
		request
			.post("/api/layout")
			.send({
				type: "layout",
				layout: layoutType
			})
			.end(function(err) {
				if (err) {
					console.log(err);
				}
			}.bind(this));
	},
	handleChange: function(type, checked) {
		this.setState({layoutType: type});
		this.storeLayoutType(type);
		this.forceUpdate();
	},
	createButton: function(type, checked) {

		var formatMessage = this.props.intl.formatMessage;

		var message;
		switch (type) {
			case "map":
				message = formatMessage({
						id: "layout-index-map"
					});
				break;
			case "card":
				message = formatMessage({
						id: "layout-index-card"
					});
				break;
			case "list":
				message = formatMessage({
						id: "layout-index-list"
					});
				break;
			default:
				break;
		}

		return React.DOM.label({
			key: type,
			className: "btn btn-secondary" + (checked ? " active" : "")
		}, React.DOM.input({
			type: "checkbox",
			autoComplete: "off",
			onChange: this.handleChange.bind(this, type, !checked)
		}), message);
	},
	render: function() {
		var content;

		switch (this.state.layoutType) {
			case "card":
				content = React.createElement(LayoutCard, {apartments: this.props.apartments});
				break;

			case "map":
				content = React.createElement(LayoutMap, {apartments: this.props.apartments});
				break;

			case "list":
				content = React.createElement(LayoutList, {apartments: this.props.apartments});
				break;

			default:
				// Not handled yet
				if (this.state.layoutType) {
					console.log(this.state.layoutType);
				}

				content = null;
				break;
		}

		return React.DOM.div({
			className: "layout-btn-group"
		}, React.DOM.div({
			className: "btn-group",
			"data-toggle": "buttons"
		}, _.map(LayoutButtons, _.bind(function(layoutbutton, key) {
			return this.createButton(key, this.state.layoutType === layoutbutton.type);
		}, this))), content);
	}
}));
