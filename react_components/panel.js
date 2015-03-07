/* global module:true */

"use strict";

var React = require("react"),
	panelStore = require("./panel-store");

module.exports = React.createClass({
	onPanelChange: function(isActivated, position, content) {
		if(content && isActivated) {
			content = React.createElement(content);
		} else {
			content = undefined;
		}

		this.setState({
			panelClassName: isActivated ? "panel" : "",
			position: position,
			content: content
		});
	},
	getInitialState: function() {
		return {
			panelClassName: "",
			position: 0
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
			style: {
				top: this.state.position + "px"
			},
			className: this.state.panelClassName
		}, this.state.content);
	}
});
