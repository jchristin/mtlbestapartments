/* global module:true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	gridItem = require("./grid-item"),
	Masonry = require('react-masonry-component')(React),
	_ = require("lodash");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			content: ""
		};
	},
	componentDidMount: function() {
		request
			.get("/api/staff-picks")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						content: _.map(res.body, function(apart) {
							return React.createElement(gridItem, {
								key: apart._id,
								apart: apart
							});
						})
					});
				}
			}.bind(this));
	},
	render: function() {
		return React.createElement("div", {
				className: "staff-picks"
			},
			React.createElement(Masonry, {
				className: "masonry",
				options: {
					isFitWidth: true
				},
				disableImagesLoaded: false
			}, this.state.content)
		);
	}
});
