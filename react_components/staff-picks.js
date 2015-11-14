/* global module:true */

"use strict";

var React = require("react"),
	Reflux = require("reflux"),
	apartStore = require("../react_stores/apart-store"),
	gridItem = require("./grid-item"),
	Masonry = require('react-masonry-component')(React),
	_ = require("lodash");

module.exports = React.createClass({
	mixins: [
		Reflux.listenTo(apartStore, "onMapDataChange"),
	],
	onMapDataChange: function(filteredApt) {
		var aparts = _.map(filteredApt, function(apart) {
			return React.createElement(gridItem, {
					key: apart._id,
					apart: apart
				});
		});

		this.setState({
			content: aparts
		});
	},
	getInitialState: function() {
		return {
			content: ""
		};
	},
	render: function() {
		return React.createElement("div", {
			className: "staff-picks"},
			React.createElement(Masonry, {
				className: "masonry",
				options: {isFitWidth: true},
				disableImagesLoaded: false
			}, this.state.content)
		);
	}
});
