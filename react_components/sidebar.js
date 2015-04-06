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
					caption: "Rooms",
					content: require("./bedroom")
				}),
				React.createElement(Item, {
					icon: "fa-map-marker",
					caption: "Zone",
					content: require("./zone")
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
