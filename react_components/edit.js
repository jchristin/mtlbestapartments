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
	handleClick: function(i) {
		this.props.history.pushState(null, "/search/edit/" + (i + 1));
	},
	generateEditLayout: function(editElement, i, criterion) {
		return React.createElement("div", {
				className: "edit-search",
				key: i,
				onClick : this.handleClick.bind(this, i)
			},
			React.createElement(editElement, null, criterion),
			React.createElement("hr", null),
			React.createElement(
				StarsLayout, {
					stars: criterion.stars
				}),
			React.createElement("div", {
				className: "edit-search-sep"
			})
		);
	},
	generateLayout: function(criteria) {
		var zoneIndex = 1;
		var layout = _.map(criteria, _.bind(function(criterion, i) {
			switch (criterion.type) {
				case "price":
					return this.generateEditLayout(EditPrice, i, criterion);

				case "room":
					return this.generateEditLayout(EditRoom, i, criterion);

				case "zone":
					criterion.id = i;
					criterion.title = "Search zone " + zoneIndex;
					++zoneIndex;
					return this.generateEditLayout(EditZone, i, criterion);

				default:
					// Not handled yet
					console.log(criterion.type);
			}
		}, this));

		this.setState({
			content: layout
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
			}, this.state.content)
		);
	}
});
