"use strict";

var React = require("react"),
	Item = require("./sidebar-item");

module.exports = React.createClass({
	render: function() {
		return React.DOM.div({
				className: "sidebar"
			},
			React.DOM.div({
					className: "sidebar-list-title"
				},
				React.DOM.h4(null, "Lists")
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
				path: "/posted",
				caption: "Posted apartments"
			})
		);
	}
});
