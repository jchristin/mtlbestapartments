/* global module:true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	editSearchPrice = require("./edit-price"),
	editSearchRoom = require("./edit-room"),
	editSearchZone = require("./edit-zone"),
	_ = require("lodash"),
	Masonry = require('react-masonry-component')(React);

module.exports = React.createClass({
	generateLayout: function(criterias) {
		var layout = _.map(criterias, function(criteria, i) {

			if (criteria.type === "price") {
				return React.createElement(editSearchPrice, {
					key: i
				}, criteria);
			} else if (criteria.type === "room") {
				return React.createElement(editSearchRoom, {
					key: i
				}, criteria);
			} else if (criteria.type === "zone") {
				criteria.id = i;
				return React.createElement(editSearchZone, {
					key: i
				}, criteria);
			} else {
				// Not handled yet
				console.log(criteria.type);
			}
		});

		this.setState({
			layout: layout
		});
	},
	componentDidMount: function() {
		request
			.get("/api/criteria")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.generateLayout(res.body);
				}
			}.bind(this));
	},
	getInitialState: function() {
		return {
			content: "No criteria found !"
		};
	},
	render: function() {
		return React.createElement("div", {
				className: "edit-search"
			},
			React.createElement(Masonry, {
				className: "masonry",
				options: {
					isFitWidth: true
				},
				disableImagesLoaded: false
			}, this.state.layout)
		);
	}
});
