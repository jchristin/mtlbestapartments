/* global module:true */

"use strict";

var React = require("react"),
	panelStore = require("../react_stores/panel-store");

module.exports = React.createClass({
	onPanelChange: function(isActivated, position, content) {
		if(content && isActivated) {
			content = React.createElement(content);
		} else {
			content = undefined;
		}

		this.setState({
			panelClassName: isActivated ? "panel on" : "panel off",
			position: position,
			content: content
		});
	},
	handleClick: function(e) {
		// Prevent the root component to hide the panel.
		e.stopPropagation();
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
			onClick: this.handleClick,
			className: this.state.panelClassName
		}, this.state.content);
	}
});
