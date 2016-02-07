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
			React.createElement(editElement, {criterion: criterion}),
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
	generateLayout: function() {
		if (this.state.criteria) {
			var zoneIndex = 1;
			var layout = _.map(this.state.criteria, _.bind(function(criterion, i) {
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

			return layout;
		} else if (this.state.requestGet) {
			return "No criteria found !";
		} else {
			return "";
		}
	},
	componentDidMount: function() {
		request
			.get("/api/search/criteria")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						requestGet: true,
						criteria: res.body
					});
				}
			}.bind(this));
	},
	getInitialState: function() {
		return {
			requestGet: false,
			criteria: undefined
		};
	},
	handleAddZone: function() {

		var criterion = {
			type: "zone",
			stars: 5,
			borough: "",
			polygon: []
		};

		this.state.criteria.push(criterion);

		request
			.post("/api/search/criteria")
			.send(this.state.criteria)
			.end(function(err) {
				if (err) {
					console.log(err);
				}

				this.props.history.pushState(
					null, "/search/edit/" + (this.state.criteria.length)
				);
			}.bind(this));
	},
	render: function() {
		return React.createElement("div", {
				className: "edit-search-container"
			}, React.createElement("i", {
				className: "fa fa-plus-square",
				onClick: this.handleAddZone
			}),
			React.createElement(Masonry, {
				className: "masonry",
				options: {
					isFitWidth: true
				},
				disableImagesLoaded: false
			}, this.generateLayout())
		);
	}
});
