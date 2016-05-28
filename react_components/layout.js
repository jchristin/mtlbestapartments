/* global module:true */

"use strict";

var React = require("react"),
	LayoutCard = require("./layout-card"),
	LayoutMap = require("./layout-map"),
	LayoutList = require("./layout-list"),
	Layouts = require("./layouts"),
	_ = require("lodash"),
	request = require("superagent"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	displayName: 'Layout',
	
	getInitialState: function() {
		return {layoutType: null};
	},
	componentWillMount: function() {
		request.get("/api/layout").end(function(err, res) {
			if (err && err.status !== 404) {
				console.log(err);
			} else {
				if (res.body !== null) {
					this.setState({layoutType: res.body});
				} else {
					this.setState({layoutType: "card"});
				}
			}
		}.bind(this));
	},
	storeLayoutType: function(layoutType) {
		request.post("/api/layout").send({type: "layout", layout: layoutType}).end(function(err) {
			if (err) {
				console.log(err);
			}
		}.bind(this));
	},
	handleChange: function(type) {
		this.setState({layoutType: type});
		this.storeLayoutType(type);
	},
	createButton: function(layout, checked) {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.label({
			key: layout.type,
			className: "btn btn-secondary" + (checked
				? " active"
				: "")
		}, React.DOM.input({
			type: "checkbox",
			autoComplete: "off",
			onChange: this.handleChange.bind(this, layout.type)
		}), formatMessage({id: layout.id}));
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

				break;
		}

		return React.DOM.div(null, React.DOM.div({
			className: "text-xs-right"
		}, React.DOM.div({
			className: "btn-group",
			"data-toggle": "buttons"
		}, _.map(Layouts, _.bind(function(layout) {
			return this.createButton(layout, this.state.layoutType === layout.type);
		}, this)))), content);
	}
}));
