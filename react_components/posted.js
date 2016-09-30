"use strict";

var React = require("react"),
	Layout = require("./layout"),
	request = require("superagent");

module.exports = React.createClass({
	contextTypes: {
		user: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			apartments: []
		};
	},
	componentWillMount: function() {
		request
			.get("/api/posted/" + this.context.user._id)
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						apartments: res.body
					});
				}
			}.bind(this));
	},
	render: function() {
		return React.DOM.div({
				className: "row"
			},
			React.createElement("h1", null, "Posted apartments"),
			React.createElement(Layout, {
				apartments: this.state.apartments
			})
		);
	}
});
