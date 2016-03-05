/* global module:true */

"use strict";

var React = require("react"),
	Sidebar = require("./sidebar"),
	Smooch = require("smooch");

Smooch.init({
	appToken: "9vodhu6slw13v5t866npfylpx"
});

module.exports = React.createClass({
	getInitialState: function() {
		return {
			expanded: false
		};
	},
	toggle: function() {
		this.setState({
			expanded: !this.state.expanded
		});
	},
	render: function() {
		return React.createElement("div", {
				className: "app"
			},
			React.createElement(Sidebar),
			React.createElement("div", {
					className: "main" + (this.state.expanded ? " expanded" : "")
				},
				React.createElement("div", {
						className: "toolbar"
					},
					React.createElement("a", {
							className: "sidebar-toggle hidden-md-up",
							onClick: this.toggle
						},
						React.createElement("i", {
							className: "fa fa-bars"
						})
					)
				),
				this.props.children
			)
		);
	}
});
