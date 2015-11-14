/* global module:true */

"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "grid-item",
			},
			React.createElement("a", {
					href: this.props.apart._id,
					target: "_blank"
				},
				React.createElement("img", {
					src: this.props.apart.image,
				})
			)
		);
	}
});
