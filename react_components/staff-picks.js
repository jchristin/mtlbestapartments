/* global module:true */

"use strict";

var React = require("react"),
	Reflux = require("reflux"),
	apartStore = require("../react_stores/apart-store"),
	infoBoxComponent = require("./info-box"),
	_ = require("lodash");

module.exports = React.createClass({
	mixins: [
		Reflux.listenTo(apartStore, "onMapDataChange"),
	],
	onMapDataChange: function(filteredApt) {
		var aparts = _.map(filteredApt, function(apart) {
			return React.createElement(infoBoxComponent, {
				apart: apart
			});
		});

		this.setState({
			content: aparts
		});
	},
	getInitialState: function() {
		return {
			content: ""
		};
	},
	render: function() {
		return React.createElement("div", {
			className: "staff-picks"
		}, this.state.content);
	}
});
