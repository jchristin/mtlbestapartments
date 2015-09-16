"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
			className: "menu-item"
		}, "Item");
	}
});
