/* global module:true */

"use strict";

var React = require("react"),
	Sidebar = require("./sidebar");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			expanded: false
		};
	},
	toggle: function(event) {
		event.stopPropagation();

		this.setState({
			expanded: !this.state.expanded
		});
	},
	collapse : function() {
		this.setState({
			expanded: false
		});
	},
	render: function() {
		return React.createElement("div", {
				className: "app",
				onClick: this.collapse
			},
			React.createElement(Sidebar),
			React.createElement("div", {
					className: "main" + (this.state.expanded ? " expanded" : "")
				},
				React.createElement("nav", {
						className: "navbar"
					},
					React.createElement("a", {
							className: "navbar-brand",
							onClick: this.toggle
						},
						React.createElement("i", {
							className: "fa fa-bars"
						})
					),
					React.createElement("a", {
							href: "/",
							className: "navbar-brand",
						},"Fleub"
					)
				),
				React.createElement("div", {
					className: "container"
				}, this.props.children)
			)
		);
	}
});
