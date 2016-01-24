/* global module:true */

"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null,
				"Price between " + this.props.children.min + "$ and " + this.props.children.max + "$")
		);
	}
});
