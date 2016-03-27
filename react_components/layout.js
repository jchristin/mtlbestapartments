/* global module:true */

"use strict";

var React = require("react"),
	LayoutCard = require("./layout-card"),
	LayoutMap = require("./layout-map"),
	LayoutList = require("./layout-list"),
	LayoutButtons = require("../layout"),
	_ = require("lodash"),
	request = require("superagent");

module.exports = React.createClass({
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
		LayoutButtons[type].checked = checked;
		this.setState({layoutType: type});
		this.storeLayoutType(type);
		this.forceUpdate();
	},
	createButton: function(type, label, checked) {

		return React.createElement("label", {
			key: type,
			className: "btn btn-secondary" + (checked ? " active" : "")
		}, React.createElement("input", {
			type: "checkbox",
			autoComplete: "off",
			onChange: this.handleChange.bind(this, type, !checked)
		}), label);
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

		return React.createElement("div", {
			className: "layout-btn-group"
		}, React.createElement("div", {
			className: "btn-group",
			"data-toggle": "buttons"
		}, _.map(LayoutButtons, _.bind(function(layoutbutton, key) {
			layoutbutton.checked = (this.state.layoutType === layoutbutton.type);
			return this.createButton(key, layoutbutton.label, layoutbutton.checked);
		}, this))), content);
	}
});
