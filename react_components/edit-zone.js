/* global module:true */

"use strict";

var React = require("react"),
EditMap = require("./edit-map");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null, this.props.criterion.title),
			React.createElement(EditMap, {criterion:this.props.criterion})
		);
	}
});
