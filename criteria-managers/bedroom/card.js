"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("div", null,
				"Between " + this.props.criterion.min + " and " + this.props.criterion.max + " rooms")
		);
	}
});
