/* global module:true */

"use strict";

var React = require("react"),
	miniMapEdit = require("./map-mini-edit");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null, this.props.children.title),
			React.createElement(miniMapEdit, null, this.props.children)
		);
	}
});
