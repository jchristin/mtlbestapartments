"use strict";

var React = require("react"),
	Request = require("superagent");

module.exports = React.createClass({
	handleChange: function() {
		Request.post("/api/upload/img0001")
			.set("Content-Type", "application/octet-stream")
			.send(this.refs.file.files[0])
			.end(function(err) {
				if (err) {
					console.log(err);
				}
			});
	},
	render: function() {
		return React.DOM.input({
			ref: "file",
			type: "file",
			onChange: this.handleChange
		});
	}
});
