/* global module:true */

"use strict";

var React = require("react"),
	EditPriceFull = require("./edit-price-full"),
	EditRoomFull = require("./edit-room-full"),
	EditMapFull = require("./edit-map-full");

module.exports = React.createClass({
	getChildren: function() {
		switch (this.props.params.num) {
			case "1":
				return React.createElement(EditMapFull);
			case "2":
				return React.createElement(EditRoomFull);
			case "3":
				return React.createElement(EditPriceFull);
		}

		return null;
	},
	handleClick: function() {
		var num = parseInt(this.props.params.num) + 1;
		if(num > 3) {
			// TODO Post criteria.
			this.props.history.pushState(null, "/search");
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
