/* global module:true, window: true */

"use strict";

var React = require("react"),
	request = require("superagent");

module.exports = React.createClass({
	handleClick: function() {
		request.del("/api/user").end(function(err) {
			if (err) {
				console.log(err);
			} else {
				window.location = "/";
			}
		});
	},
	render: function() {
		return React.createElement("div", null,
			"SETTINGS",
			React.createElement("button", {
				onClick: this.handleClick
			}, "Delete account")
		);
	}
});
