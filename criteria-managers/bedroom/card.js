"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function() {
		return React.DOM.div(null,
			React.DOM.div(null,
				"Between " + this.props.criterion.min + " and " + this.props.criterion.max + " bedrooms")
		);
	}
});
