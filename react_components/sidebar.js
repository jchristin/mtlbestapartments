"use strict";

var React = require("react");

module.exports = React.createClass({
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
				React.createElement("li", {
						className: "menu-item"
					},
					React.createElement("a", null,
						React.createElement("div", null, React.createElement("i", {
							className: "fa fa-usd"
						})),
						React.createElement("div", null, "Price")
					)
				),
				React.createElement("li", {
						className: "menu-item"
					},
					React.createElement("a", null,
						React.createElement("div", null, React.createElement("i", {
							className: "fa fa-home"
						})),
						React.createElement("div", null, "Bedrooms")
					)
				),
				React.createElement("li", {
						className: "menu-item"
					},
					React.createElement("a", null,
						React.createElement("div", null, React.createElement("i", {
							className: "fa fa-map-marker"
						})),
						React.createElement("div", null, "Map")
					)
				)
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
