/* global module:true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	criteriaManagers = require("../criteria-managers");

module.exports = React.createClass({
	getChildren: function() {
		var num = parseInt(this.props.params.num);

		if (this.state.criteria && num <= this.state.criteria.length) {
			var criterion = this.state.criteria[num - 1];
			var criterionManager = criteriaManagers[criterion.type];
			if(!criterionManager) {
				console.log("Criterion not supported:" + criterion.type);
				return;
			}

			return React.createElement(criterionManager.LargeCard, {criterion: criterion});
		}

		return null;
	},
	handleClick: function() {
		request
			.post("/api/search/criteria")
			.send(this.state.criteria)
			.end(function(err) {
				if (err) {
					console.log(err);
				}

				this.props.history.pushState(null, "/search/edit");
			}.bind(this));
	},
	getInitialState: function() {
		return {criteria: undefined};
	},
	componentWillMount: function() {
		request.get("/api/search/criteria").end(function(err, res) {
			if (err) {
				console.log(err);
			} else {
				this.setState({criteria: res.body});
			}
		}.bind(this));
	},
	render: function() {
		return React.createElement("div", {
			className: "edit-full"
		}, React.createElement("div", null, React.createElement("button", {
			onClick: this.handleClick
		}, "Validate")), this.getChildren());
	}
});
