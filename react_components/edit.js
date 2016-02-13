/* global module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	request = require("superagent"),
	criteriaManagers = require("../criteria-managers"),
	Masonry = require('react-masonry-component')(React),
	StarsLayout = require("./edit-stars");

module.exports = React.createClass({
	handleClick: function(i) {
		this.props.history.pushState(null, "/search/edit/" + (i + 1));
	},
	handleDeleteCriterion: function(i) {
		_.pullAt(this.state.criteria, i);

		this.setState({
			criteria: this.state.criteria
		});

		request
			.post("/api/search/criteria")
			.send(this.state.criteria)
			.end(function(err) {
				if (err) {
					console.log(err);
				}
			}.bind(this));
	},
	generateEditLayout: function(Card, i, criterion) {
		return React.createElement("div", {
				key: i,
				className: "edit-search"
			},
			React.createElement("i", {
				className: "fa fa-trash",
				onClick : this.handleDeleteCriterion.bind(this, i)
			}),
			React.createElement("div", {
					onClick : this.handleClick.bind(this, i)
				},
				React.createElement(Card, {criterion: criterion}),
				React.createElement("hr", null),
				React.createElement(
					StarsLayout, {
						stars: criterion.stars
					}),
					React.createElement("div", {
						className: "edit-search-sep"
					})
				)
		);
	},
	generateLayout: function() {
		if (this.state.criteria) {
			var layout = _.map(this.state.criteria, _.bind(function(criterion, i) {
				var criterionManager = criteriaManagers[criterion.type];
				if(!criterionManager){
					// Not handled yet
					console.log(criterion.type);
					return;
				}

				return this.generateEditLayout(criterionManager.Card, i, criterion);
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
			criteria: []
		};
	},
	handleAddZone: function() {
		this.state.criteria.push({
			type: "zone",
			stars: 5,
			borough: "",
			polygon: []
		});

		this.setState({
			criteria: this.state.criteria
		});

		this.addCriterion();
	},
	handleAddPrice: function() {
		this.state.criteria.push({
			type: "price",
			stars: 5,
			min: 0,
			max: 4000
		});

		this.addCriterion();
	},
	handleAddRoom: function() {
		this.state.criteria.push({
			type: "bedroom",
			stars: 5,
			min: 1,
			max: 5
		});

		this.addCriterion();
	},
	addCriterion: function() {
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
			},
			React.createElement("i", {
				className: "fa fa-usd",
				onClick: this.handleAddPrice
			}),
			React.createElement("i", {
				className: "fa fa-bed",
				onClick: this.handleAddRoom
			}),
			React.createElement("i", {
				className: "fa fa-globe",
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
