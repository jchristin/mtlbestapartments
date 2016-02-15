/* global module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	request = require("superagent"),
	criteriaManagers = require("../criteria-managers"),
	Masonry = require('react-masonry-component')(React),
	StarsLayout = require("./edit-stars");

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	handleEditClick: function(i) {
		this.context.router.push("/search/edit/" + (i + 1));
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
	generateCardLayout: function(Card, i, criterion) {
		return React.createElement("div", {
				key: i,
				className: "edit-search"
			},
			React.createElement("i", {
				className: "fa fa-trash",
				onClick : this.handleDeleteCriterion.bind(this, i)
			}),
			React.createElement("div", {
					onClick : this.handleEditClick.bind(this, i)
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

				return this.generateCardLayout(criterionManager.Card, i, criterion);
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
	handleAddCriterion: function(type) {
		this.state.criteria.push(_.cloneDeep(criteriaManagers[type].default));

		request
			.post("/api/search/criteria")
			.send(this.state.criteria)
			.end(function(err) {
				if (err) {
					console.log(err);
				}

				this.context.router.push("/search/edit/" + this.state.criteria.length);
			}.bind(this));
	},
	render: function() {
		return React.createElement("div", {
				className: "edit-search-container"
			},
			_.map(criteriaManagers, _.bind(function(criterionManager, type) {
				return React.createElement("i", {
					className: "fa " + criterionManager.icon,
					key: type,
					onClick: this.handleAddCriterion.bind(this, type)
				});
			}, this)),
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
