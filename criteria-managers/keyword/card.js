"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function() {
		return React.DOM.div(null,
			React.DOM.div(null,
				"Keywords: " + this.props.criterion.keywords)
		);
	}
});
