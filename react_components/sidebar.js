"use strict";

var React = require("react"),
	Item = require("./sidebar-item"),
	actions = require("../react_stores/actions");

module.exports = React.createClass({
	handleClick: function() {
		actions.togglePanel();
	},
	render: function() {
		return React.createElement("div", {
				className: "sidebar"
			},
			React.createElement("div", {
				className: "sidebar-logo"
			}),
			React.createElement("ul", {
					className: "sidebar-nav"
				},
				React.createElement(Item, {
					icon: "fa-usd",
					caption: "Price",
					content: require("./price")
				}),
				React.createElement(Item, {
					icon: "fa-home",
					caption: "Bedrooms",
					content: require("./bedroom")
				}),
				React.createElement(Item, {
					icon: "fa-map-marker",
					caption: "Zone"
				})
			),
			React.createElement("div", {
					className: "sidebar-footer"
				},
				React.createElement("div", {
						className: "share"
					},
					React.createElement("div", null, "SHARE"),
					React.createElement("ul", null,
						React.createElement("li", null, React.createElement("i", {
							className: "fa fa-google-plus-square"
						})),
						React.createElement("li", null, React.createElement("i", {
							className: "fa fa-twitter-square"
						})),
						React.createElement("li", null, React.createElement("i", {
							className: "fa fa-facebook-square"
						}))
					)
				)
			)
		);
	}
});
