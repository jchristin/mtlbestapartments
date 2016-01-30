/* global module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	Masonry = require("react-masonry-component")(React),
	GridItem = require("./grid-item");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", {
			className: "layout"
		}, React.createElement(Masonry, {
			className: "masonry",
			options: {
				isFitWidth: true
			},
			disableImagesLoaded: false
		}, _.map(this.props.apartments, function(apart) {
			return React.createElement(GridItem, {
				key: apart._id,
				apart: apart
			});
		})));
	}
});