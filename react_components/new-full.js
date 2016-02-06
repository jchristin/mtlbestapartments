/* global module:true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	EditPriceFull = require("./edit-price-full"),
	EditRoomFull = require("./edit-room-full"),
	EditMapFull = require("./edit-map-full");

module.exports = React.createClass({
	getInitialState : function() {
		return {
			criteria: [
				{
					type: "zone",
					stars: 5
				}, {
					type: "room",
					min: 0,
					max: 5,
					stars: 5
				}, {
					type: "price",
					min: 0,
					max: 4000,
					stars: 5
				}
			]
		};
	},
	getChildren: function() {
		switch (this.props.params.num) {
			case "1":
				return React.createElement(EditMapFull, {criterion: this.state.criteria[0]});
			case "2":
				return React.createElement(EditRoomFull, {criterion: this.state.criteria[1]});
			case "3":
				return React.createElement(EditPriceFull, {criterion: this.state.criteria[2]});
		}

		return null;
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

					this.props.history.pushState(null, "/search/edit");
				}.bind(this));
		} else {
			this.props.history.pushState(null, "/search/new/" + num);
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
