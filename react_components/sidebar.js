"use strict";

var React = require("react"),
	Item = require("./sidebar-item");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "sidebar"
			},
			React.createElement("div", {
				className: "sidebar-logo"
			}),
			React.createElement("div", {
				className: "sidebar-top"
			}),
			React.createElement(Item, {
				icon: "fa-user",
				path: "/account",
				caption: "My account"
			}),
			React.createElement(Item, {
				icon: "fa-cog",
				path: "/settings",
				caption: "Settings"
			}),
			React.createElement(Item, {
				icon: "fa-sign-out",
				path: "/signout",
				caption: "Sign out"
			}),
			React.createElement("hr", {
				className: "sidebar-divider"
			}),
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
