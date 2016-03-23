"use strict";

var React = require("react"),
	Item = require("./sidebar-item");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "sidebar"
			},
			React.createElement("div", {
					className: "sidebar-list-title"
				},
				React.createElement("h4", null, "Lists")
			),
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
