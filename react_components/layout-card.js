/* global module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	Masonry = require("react-masonry-component"),
	GridItem = require("./grid-item");

module.exports = React.createClass({
	render: function() {
		return React.DOM.div({
			className: "layout"
		}, React.createElement(Masonry, {
			className: "masonry",
			options: {
				gutter: 14
			},
			disableImagesLoaded: false
		}, _.map(this.props.apartments, function(apart) {
			return React.createElement(GridItem, {
				key: apart._id,
				apart: apart,
				lang: this.props.lang
			});
		})));
	}
});
