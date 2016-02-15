/* global module:true */

"use strict";

var _ = require("lodash"),
	React = require("react"),
	request = require("superagent"),
	criteriaManagers = require("../criteria-managers"),
	criteriaManagersWanted = [
		criteriaManagers.zone,
		criteriaManagers.bedroom,
		criteriaManagers.price
	];

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState : function() {
		return {
			criteria: _.map(criteriaManagersWanted, function(criteriaManager) {
				return _.cloneDeep(criteriaManager.default);
			})
		};
	},
	getChildren: function() {
		var criterionIndex = this.props.params.num	;
		if(criterionIndex > criteriaManagersWanted.length) {
			return;
		}

		return React.createElement(criteriaManagersWanted[criterionIndex - 1].LargeCard, {
			criterion: this.state.criteria[criterionIndex - 1]
		});
	},
	handleClick: function() {
		var num = parseInt(this.props.params.num) + 1;
		if(num > 3) {
			// Remove zone criterion if not defined by the user.
			if(!this.state.criteria[0].polygon) {
				this.state.criteria.splice(0, 1);
			}

			request
				.post("/api/search/criteria")
				.send(this.state.criteria)
				.end(function(err) {
					if (err) {
						console.log(err);
					}

					this.context.router.push("/search/edit");
				}.bind(this));
		} else {
			this.context.router.push("/search/new/" + num);
		}
	},
	render: function() {
		return React.createElement("div", {
			className: "new-full"
		}, React.createElement("div", null, React.createElement("button", {
			onClick: this.handleClick
		}, "Next")), this.getChildren());
	}
});
