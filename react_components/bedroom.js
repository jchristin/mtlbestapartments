"use strict";

var React = require("react"),
	actions = require("../react_stores/actions"),
	$ = require("jquery-ui"),
	$ = require("jquery");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			bedroom: [1, 7]
		};
	},
	componentDidMount: function() {
		$("#bedroom").slider({
			range: true,
			min: 1,
			max: 7,
			step: 1,
			values: [1, 7],
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
