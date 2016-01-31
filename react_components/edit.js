/* global module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	request = require("superagent"),
	EditPrice = require("./edit-price"),
	EditRoom = require("./edit-room"),
	EditZone = require("./edit-zone"),
	Masonry = require('react-masonry-component')(React),
	StarsLayout = require("./edit-stars");

module.exports = React.createClass({
	generateEditLayout: function(editElement, i, criteria) {
		return React.createElement("div", {
				className: "edit-search",
				key: i
			},
			React.createElement(editElement, null, criteria),
			React.createElement("hr", null),
			React.createElement(
				StarsLayout, {
					stars: criteria.stars
				}),
			React.createElement("div", {
				className: "edit-search-sep"
			})
		);
	},
	generateLayout: function(criterias) {
		var zoneIndex = 1;
		var layout = _.map(criterias, _.bind(function(criteria, i) {
			if (criteria.type === "price") {
				return this.generateEditLayout(EditPrice, i, criteria);
			} else if (criteria.type === "room") {
				return this.generateEditLayout(EditRoom, i, criteria);
			} else if (criteria.type === "zone") {
				criteria.id = i;
				criteria.title = "Search zone " + zoneIndex;
				++zoneIndex;
				return this.generateEditLayout(EditZone, i, criteria);
			} else {
				// Not handled yet
				console.log(criteria.type);
			}
		}, this));

		this.setState({
			layout: layout
		});
	},
	componentDidMount: function() {
		request
			.get("/api/search/criteria")
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
				className: "edit-search-container"
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
