/* global module:true */

"use strict";

var React = require("react"),
	panelStore = require("./panel-store");

module.exports = React.createClass({
	onPanelChange: function(isActivated) {
		this.setState({
			panelClassName: isActivated ? "panel" : ""
		});
	},
	getInitialState: function() {
		return {
			panelClassName: ""
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
			className: this.state.panelClassName
		});
	}
});
