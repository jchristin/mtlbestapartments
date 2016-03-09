/* global module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	Link = require("react-router").Link,
	request = require("superagent"),
	criteriaManagers = require("../criteria-managers");

module.exports = React.createClass({
	createCard: function(criterion) {
		var criterionManager = criteriaManagers[criterion.type];
		return React.createElement("div", {
				className: "card",
				key: criterion.type
			},
			React.createElement("div", {
					className: "card-block",
				},
				React.createElement("h4", {
					className: "card-title",
				}, criterionManager.name),
				React.createElement(criterionManager.LargeCard, {criterion: criterion})
			)
		);
	},
	createLoading: function() {
		if(this.state.criteria === null) {
			return React.createElement("i", {
				className: "fa fa-refresh fa-spin"
			});
		}
	},
	getAllCriteria: function(criteria) {
		var allCriteria = _.map(criteriaManagers, function(criterionManager) {
			return _.cloneDeep(criterionManager.default);
		});

		_.forEach(criteria, function(criterion) {
			var index = _.findIndex(allCriteria, ["type", criterion.type]);
			if(index !== -1) {
				allCriteria[index] = criterion;
			}
		});

		return allCriteria;
	},
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return { criteria: null };
	},
	componentDidMount: function() {
		request
			.get("/api/search/criteria")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						criteria: this.getAllCriteria(res.body)
					});
				}
			}.bind(this));
	},
	render: function() {
		return React.createElement("div", {
				className: "row"
			},
			React.createElement("div", {
					className: "col-md-6 offset-md-3"
				},
				React.createElement(Link, {
					to: "/search"
				}, React.createElement("i", {
					className: "fa fa-long-arrow-left"
				} , " Back to search result")),
				React.createElement("h1", {
					className : "m-t-1"
				}, "Search criteria", this.createLoading()),
				_.map(this.state.criteria, this.createCard)
			)
		);
	}
});
