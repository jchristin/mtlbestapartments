/* global module:true */

"use strict";

var React = require("react"),
	Toolbar = require("./toolbar"),
	Sidebar = require("./sidebar"),
	SupportKit = require("supportkit");

SupportKit.init({
	appToken: "9vodhu6slw13v5t866npfylpx"
});

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "app"
			},
			React.createElement(Sidebar),
			React.createElement("div", {
					className: "main"
				},
				React.createElement(Toolbar),
				this.props.children
			)
		);
	}
});
