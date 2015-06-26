/* global module:true */

"use strict";

var React = require("react"),
	Sidebar = require("./sidebar"),
	Panel = require("./panel"),
	Canvas = require("./map"),
	actions = require("../react_stores/actions"),
	SupportKit = require("supportkit");

SupportKit.init({
	appToken: "9vodhu6slw13v5t866npfylpx"
});

module.exports = React.createClass({
	handleClick: function() {
		actions.hidePanel();
	},
	render: function() {
		return React.createElement("div", {
				onClick: this.handleClick,
			},
			React.createElement(Sidebar),
			React.createElement(Panel),
			React.createElement("div", {
					className: "map-container"
				},
				React.createElement(Canvas)
			)
		);
	}
});
