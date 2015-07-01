"use strict";

var React = require("react"),
	actions = require("../react_stores/actions"),
	apartStore = require("../react_stores/apart-store");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			bedroom: apartStore.bedroom
		};
	},
	componentDidMount: function() {
		$("#bedroom").slider({
			range: true,
			min: 1,
			max: 7,
			step: 1,
			values: this.state.bedroom,
			slide: function(event, ui) {
				actions.setBedroom(ui.values);
				this.setState({
					bedroom: ui.values
				});
			}.bind(this)
		});
	},
	render: function() {
		return React.createElement("div", {
				className: "bedroom"
			},
			React.createElement("div", {
				className: "caption"
			}, this.state.bedroom[0] + " - " + this.state.bedroom[1]),
			React.createElement("div", {
				id: "bedroom"
			}));
	}
});
