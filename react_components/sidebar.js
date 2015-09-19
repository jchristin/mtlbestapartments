"use strict";

var React = require("react"),
	Item = require("./sidebar-item");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "sidebar"
			},
			React.createElement("div", {
				className: "sidebar-top"
			}, "Fleub"),
			React.createElement(Item, {
				icon: "fa-user",
				caption: "My account"
			}),
			React.createElement(Item, {
				icon: "fa-cog",
				caption: "Settings"
			}),
			React.createElement(Item, {
				icon: "fa-sign-out",
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
				caption: "Favorite"
			}),
			React.createElement(Item, {
				icon: "fa-circle",
				caption: "Search"
			}),
			React.createElement(Item, {
				icon: "fa-circle",
				caption: "Staff picks"
			}),
			React.createElement(Item, {
				icon: "fa-circle",
				caption: "Posted apartments"
			})
		);
	}
});
