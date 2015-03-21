"use strict";

var React = require("react"),
	actions = require("../react_stores/actions"),
	apartStore = require("../react_stores/apart-store"),
	$ = require("jquery-ui"),
	$ = require("jquery");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			price: apartStore.price
		};
	},
	componentDidMount: function() {
		$("#price").slider({
			range: true,
			min: 0,
			max: 4000,
			step: 50,
			values: this.state.price,
			slide: function(event, ui) {
				actions.setPrice(ui.values);
				this.setState({
					price: ui.values
				});
			}.bind(this)
		});
	},
	render: function() {
		return React.createElement("div", {
				className: "price"
			},
			React.createElement("div", {
				className: "caption"
			}, this.state.price[0] + "$ - " + this.state.price[1] + "$"),
			React.createElement("div", {
				id: "price"
			}));
	}
});
