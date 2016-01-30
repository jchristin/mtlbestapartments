"use strict";

var React = require("react"),
	Item = require("./sidebar-item");

module.exports = React.createClass({
	getLoggedMenu: function () {
		return React.createElement("div", {
				className: "sidebar-top"
			},
			React.createElement("div", {
				className: "name"
			}, this.context.user.name),
			React.createElement(Item, {
				icon: "fa-cog",
				path: "/settings",
				caption: "Settings"
			}),
			React.createElement(Item, {
				icon: "fa-sign-out",
				path: "/api/signout",
				target: "_self",
				caption: "Sign out"
			})
		);
	},
	getNotLoggedMenu: function () {
		return React.createElement("div", {
				className: "sidebar-top"
			},
			React.createElement(Item, {
				icon: "fa-sign-in",
				path: "/signin",
				caption: "Sign in"
			}),
			React.createElement(Item, {
				icon: "fa-sign-up",
				path: "/signup",
				caption: "Sign up"
			})
		);
	},
	contextTypes: {
		user: React.PropTypes.object
	},
	render: function() {
		return React.createElement("div", {
				className: "sidebar"
			},
			React.createElement("div", {
				className: "sidebar-top"
			}),
			this.context.user ? this.getLoggedMenu() : this.getNotLoggedMenu(),
			React.createElement("div", {
				className: "sidebar-list-title"
			}, "Lists"),
			React.createElement(Item, {
				icon: "fa-circle",
				path: "/favorite",
				caption: "Favorite"
			}),
			React.createElement(Item, {
				icon: "fa-circle",
				path: "/search",
				caption: "Search"
			}),
			React.createElement(Item, {
				icon: "fa-circle",
				path: "/staff-picks",
				caption: "Staff picks"
			}),
			React.createElement(Item, {
				icon: "fa-circle",
				path: "/posted",
				caption: "Posted apartments"
			})
		);
	}
});
