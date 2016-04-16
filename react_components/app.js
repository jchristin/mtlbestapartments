/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	Sidebar = require("./sidebar");

module.exports = React.createClass({
	contextTypes: {
		user: React.PropTypes.object
	},
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
	createLoggedMenu: function () {
		return React.DOM.ul({
				className: "nav navbar-nav pull-xs-right",
			},
			React.DOM.li({
					className: "nav-item dropdown"
				},
				React.DOM.a({
					id: "account",
					href: "#",
					"data-toggle": "dropdown",
					"aria-haspopup": true,
					"aria-expanded": false,
					className: "nav-link"
				}, "Account"),
				React.DOM.div({
						className: "dropdown-menu dropdown-menu-right",
						"aria-labelledby": "account"
					},
					React.DOM.h6({
						className: "dropdown-header"
					}, this.context.user.name),
					React.createElement(Link, {
						to: "/settings",
						className: "dropdown-item"
					}, "Settings"),
					React.DOM.a({
						href: "/api/signout",
						className: "dropdown-item"
					}, "Sign out")
				)
			)
		);
	},
	createNotLoggedMenu: function () {
		return React.DOM.ul({
					className: "nav navbar-nav pull-xs-right",
			},
			React.DOM.li({
					className: "nav-item"
				},
				React.createElement(Link, {
					to: "/signin",
					className: "nav-link"
				}, "Sign in")
			)
		);
	},
	componentDidMount: function() {
		global.jQuery = require("jquery");
		require("../node_modules/bootstrap/dist/js/umd/dropdown");
	},
	render: function() {
		return React.DOM.div({
				className: "app",
				onClick: this.collapse
			},
			React.createElement(Sidebar),
			React.DOM.div({
					className: "main" + (this.state.expanded ? " expanded" : "")
				},
				React.DOM.nav({
						className: "navbar"
					},
					React.DOM.a({
							className: "navbar-brand",
							onClick: this.toggle
						},
						React.DOM.i({
							className: "fa fa-bars"
						})
					),
					React.createElement(Link, {
							to: "/",
							className: "navbar-brand",
						},"Fleub"
					),
					this.context.user ? this.createLoggedMenu() : this.createNotLoggedMenu()
				),
				React.DOM.div({
					className: "container"
				}, this.props.children)
			)
		);
	}
});
