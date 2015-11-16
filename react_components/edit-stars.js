/* global module:true */

"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function() {
		var starsLayout = [];
		var numOfStars = (0 || this.props.stars);

		for (var i = 0; i < numOfStars; i++) {
			starsLayout.push(React.createElement("i", {
				key: i,
				className: "fa fa-star"
			}));
		}

		for (var j = 0; j < (5 - numOfStars); j++) {
			starsLayout.push(React.createElement("i", {
				key: j + numOfStars,
				className: "fa fa-star-o"
			}));
		}

		return React.createElement("div", {
			className: "edit-stars"
		}, starsLayout);
	}
});
