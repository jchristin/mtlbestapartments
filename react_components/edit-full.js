/* global module:true */

"use strict";

var React = require("react"),
	request = require("superagent"),
	EditPriceFull = require("./edit-price-full"),
	EditRoomFull = require("./edit-room-full"),
	EditMapFull = require("./edit-map-full");

module.exports = React.createClass({
	getChildren: function() {
		var num = parseInt(this.props.params.num);

		if (this.state.criteria && num <= this.state.criteria.length) {
			switch (this.state.criteria[num - 1].type) {
				case "price":
					return React.createElement(EditPriceFull);
				case "room":
					return React.createElement(EditRoomFull);
				case "zone":
					return React.createElement(EditMapFull);
			}
		}

		return null;
	},
	handleClick: function() {
		this.props.history.pushState(null, "/search/edit");
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
