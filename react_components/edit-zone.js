/* global module:true */

"use strict";

var React = require("react"),
EditMap = require("./edit-map");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null, this.props.children.title),
			React.createElement(EditMap, null, this.props.children)
		);
	}
});
