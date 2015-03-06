/* global module:true */

"use strict";

var React = require("react"),
	panelStore = require("./panel-store"),
	actions = require("./actions");

module.exports = React.createClass({
	onPanelChange: function(isActivated) {
		this.setState({
			panelClassName: isActivated ? "panel" : ""
		});
	},
	handleClick: function() {
		actions.togglePanel();
	},
	getInitialState: function() {
		return {
			panelClassName: "panel"
		};
	},
	componentDidMount: function() {
		this.unsubscribe = panelStore.listen(this.onPanelChange);
	},
	componentWillUnmount: function() {
		this.unsubscribe();
	},
	render: function() {
		return React.createElement("div", {
			onClick: this.handleClick,
			className: this.state.panelClassName
		});
	}
});
