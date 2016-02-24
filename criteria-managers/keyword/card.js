"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null,
				"Keywords: " + this.props.criterion.keywords)
		);
	}
});
